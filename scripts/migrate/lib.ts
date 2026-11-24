/**
 * Helpers for the one-time WordPress → Payload migration.
 * Downloads are cached in .migration-cache/ so the script can be re-run quickly.
 */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { Payload } from 'payload'

export const WP = 'https://prestigeinstitutedharwad.in'
export const UPLOADS = `${WP}/wp-content/uploads/`
export const CACHE_DIR = path.resolve(process.cwd(), '.migration-cache')
fs.mkdirSync(path.join(CACHE_DIR, 'files'), { recursive: true })

const UA = { 'User-Agent': 'Mozilla/5.0 (site migration)' }

export const log = (...args: unknown[]) => console.log('›', ...args)

export async function fetchJSON<T = unknown>(url: string): Promise<T> {
  const key = path.join(CACHE_DIR, crypto.createHash('md5').update(url).digest('hex') + '.json')
  if (fs.existsSync(key) && !process.env.MIGRATE_REFRESH) return JSON.parse(fs.readFileSync(key, 'utf8'))
  const res = await fetch(url, { headers: UA })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const json = await res.json()
  fs.writeFileSync(key, JSON.stringify(json))
  return json as T
}

/** Decode the HTML entities WordPress puts in titles. */
export const decode = (s: string) =>
  s
    .replace(/&#8217;|&#039;|&rsquo;|&#x27;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&#038;|&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))

export const stripTags = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

const absolute = (u: string) => (u.startsWith('http') ? u : u.startsWith('/') ? WP + u : UPLOADS + u)

/** WordPress serves resized copies like photo-300x200.jpg; the original has no size suffix. */
const originalOf = (u: string) => u.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, '')

async function download(url: string): Promise<string | null> {
  const rel = decodeURIComponent(new URL(url).pathname).replace(/^\/+/, '').replace(/[^\w.\-/]+/g, '_')
  const file = path.join(CACHE_DIR, 'files', rel)
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file
  const res = await fetch(url, { headers: UA })
  if (!res.ok) return null
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  return file
}

/** Download a file, trying the full-size original first. Returns the local path. */
export async function fetchFile(url: string): Promise<string> {
  const abs = absolute(url)
  const full = originalOf(abs)
  const file = (full !== abs && (await download(full))) || (await download(abs))
  if (!file) throw new Error(`Could not download ${abs}`)
  return file
}

const mediaMemo = new Map<string, number>()

/**
 * Upload an image (or video) into a Payload upload collection, once.
 * Re-running the script reuses the existing document with the same filename.
 */
export async function upload(
  payload: Payload,
  url: string,
  alt = '',
  collection: 'media' | 'gallery' = 'media',
  extra: Record<string, unknown> = {},
): Promise<number> {
  const memoKey = `${collection}:${originalOf(absolute(url))}`
  const memo = mediaMemo.get(memoKey)
  if (memo) return memo

  const filePath = await fetchFile(url)
  const filename = path.basename(filePath)

  const existing = await payload.find({
    collection,
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  let id: number
  if (existing.docs[0]) {
    id = existing.docs[0].id as number
  } else {
    const doc = await payload.create({
      collection,
      data: { alt, ...extra } as never,
      filePath,
      context: { disableRevalidate: true },
    })
    id = doc.id as number
    log(`uploaded ${collection}/${filename}`)
  }
  mediaMemo.set(memoKey, id)
  return id
}

/* ───────────── Lexical rich-text builders ───────────── */

type Node = Record<string, unknown>

/** "Hello **world**" → text nodes with bold formatting. */
const inline = (s: string): Node[] =>
  s
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**')
        ? { type: 'text', text: part.slice(2, -2), format: 1, style: '', mode: 'normal', detail: 0, version: 1 }
        : { type: 'text', text: part, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
    )

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }

export const p = (s: string): Node => ({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: inline(s) })
export const h = (tag: 'h2' | 'h3' | 'h4', s: string): Node => ({ ...base, type: 'heading', tag, children: inline(s) })
export const ul = (items: string[], ordered = false): Node => ({
  ...base,
  type: 'list',
  listType: ordered ? 'number' : 'bullet',
  tag: ordered ? 'ol' : 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...base, type: 'listitem', value: i + 1, children: inline(t) })),
})

export const root = (...children: Node[]) => ({
  root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children },
})

/** Plain paragraphs → rich text. */
export const rt = (...paragraphs: string[]) => root(...paragraphs.map(p))

/* ───────────── Blog post HTML → Lexical ───────────── */

const cleanInline = (html: string) =>
  html
    .replace(/<(?!\/?(strong|b|em|i|u|a|br|ul|ol|li)\b)[^>]+>/gi, '') // drop span/div/etc, keep content
    .replace(/<(strong|b|em|i|u|ul|ol|li)\b[^>]*>/gi, '<$1>') // strip attributes
    .replace(/<a\b[^>]*?href="([^"]*)"[^>]*>/gi, '<a href="$1">')
    // links to the old domain → site-relative so they keep working on the new site
    .replace(/<a href="https?:\/\/(?:www\.)?prestigeinstitutedharwad\.in(\/[^"]*)?"/gi, (_, p) => `<a href="${(p || '/').replace(/\/$/, '') || '/'}"`)
    // links without a usable target → plain text
    .replace(/<a href="(?:#?|javascript:[^"]*)">([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<a(?![^>]*href=)[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<i>\s*<\/i>/g, '')
    .replace(/&nbsp;/g, ' ')

export type PostToken = { kind: 'html'; html: string } | { kind: 'media'; src: string; alt: string }

/** Flatten Elementor markup into a sequence of simple blocks + images, in reading order. */
export function tokenizePost(html: string): PostToken[] {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<noscript[\s\S]*?<\/noscript>/g, '')
    .replace(/<i\s+[^>]*class="[^"]*(fa|eicon|icon)[^"]*"[^>]*>\s*<\/i>/g, '')

  const tokens: PostToken[] = []
  const re =
    /<(h[1-6]|p|ul|ol|blockquote)\b[^>]*>([\s\S]*?)<\/\1>|<img\b[^>]*>|<video\b[\s\S]*?<\/video>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned))) {
    const whole = m[0]
    if (/^<img/i.test(whole) || /^<video/i.test(whole)) {
      const src =
        whole.match(/\bsrc="([^"]+\.(?:jpe?g|png|webp|gif|mp4|webm))"/i)?.[1] ||
        whole.match(/<source[^>]+src="([^"]+)"/i)?.[1]
      if (src && !/\/plugins\//.test(src)) tokens.push({ kind: 'media', src, alt: decode(whole.match(/\balt="([^"]*)"/)?.[1] || '') })
      continue
    }
    const tag = m[1].toLowerCase()
    const inner = m[2]
    // images nested inside a paragraph
    for (const img of inner.match(/<img\b[^>]*>/gi) || []) {
      const src = img.match(/\bsrc="([^"]+)"/)?.[1]
      if (src) tokens.push({ kind: 'media', src, alt: decode(img.match(/\balt="([^"]*)"/)?.[1] || '') })
    }
    const body = cleanInline(inner).trim()
    if (!stripTags(body)) continue
    const outTag = tag === 'h1' ? 'h2' : tag === 'h5' || tag === 'h6' ? 'h4' : tag
    tokens.push({ kind: 'html', html: `<${outTag}>${body}</${outTag}>` })
  }
  return tokens
}

const randomId = () => crypto.randomBytes(12).toString('hex')

/**
 * Some WordPress posts were pasted in as Markdown, so the text literally contains "## Heading" and
 * "*bold*" / "**bold**". Turn those into real headings and bold text, and drop any stray asterisks.
 */
export function fixPastedMarkdown(state: { root: { children: Node[] } }) {
  // Only matching pairs (*x* or **x**) of a short phrase become bold; unmatched asterisks are dropped.
  const bold = (text: string, format: number): Node[] =>
    text
      .split(/((?<!\*)\*{1,2}(?!\*)[^*\n]{1,80}?(?<!\*)\*{1,2}(?!\*))/g)
      .filter(Boolean)
      .map((part) => {
        const m = part.match(/^(\*{1,2})([^*]+?)\1$/)
        if (m) return { type: 'text', text: m[2], format: format | 1, style: '', mode: 'normal', detail: 0, version: 1 }
        return { type: 'text', text: part.replace(/\*/g, ''), format, style: '', mode: 'normal', detail: 0, version: 1 }
      })
      .filter((n) => n.text)
  const walk = (node: Node): Node => {
    const children = node.children as Node[] | undefined
    if (!children) return node
    const next = children.flatMap((c) =>
      c.type === 'text' && typeof c.text === 'string' && c.text.includes('*')
        ? bold(c.text, (c.format as number) || 0)
        : [walk(c)],
    )
    return { ...node, children: next }
  }

  state.root.children = state.root.children.map((node) => {
    // Ignore line breaks before the "## " marker
    let children = (node.children as Node[] | undefined) || []
    const lead = children.findIndex((c) => c.type !== 'linebreak')
    if (node.type === 'paragraph' && lead > 0) children = children.slice(lead)
    const first = children[0]
    const h = node.type === 'paragraph' && first?.type === 'text' && (first.text as string)?.match(/^(#{2,4})\s+/)
    if (h) {
      const tag = (['h2', 'h3', 'h4'] as const)[Math.min(h[1].length, 4) - 2]
      const stripped = [{ ...first, text: (first.text as string).slice(h[0].length) }, ...children.slice(1)]
      return walk({ ...node, type: 'heading', tag, children: stripped })
    }
    return walk(node)
  })
  return state
}

/** Replace "@@MEDIA:12@@" marker paragraphs with Payload media blocks. */
export function swapMediaMarkers(state: { root: { children: Node[] } }) {
  state.root.children = state.root.children.map((node) => {
    const children = (node.children as Node[] | undefined) || []
    const text = children.map((c) => (c.text as string) || '').join('').trim()
    const m = text.match(/^@@MEDIA:(\d+)@@$/)
    if (node.type === 'paragraph' && m) {
      return {
        type: 'block',
        version: 2,
        format: '',
        fields: { id: randomId(), blockName: '', blockType: 'mediaBlock', media: Number(m[1]) },
      }
    }
    return node
  })
  return state
}
