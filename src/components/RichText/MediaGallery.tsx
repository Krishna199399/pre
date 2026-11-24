import { Expand } from 'lucide-react'
import React from 'react'

import type { Media as MediaType, MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

const asMedia = (m: MediaBlockProps['media']) => (m && typeof m === 'object' ? (m as MediaType) : null)

/** One picture inside an article: never wider/taller than needed, opens full size (useful for newspaper clippings). */
export function ArticleImage({ media }: { media: MediaBlockProps['media'] }) {
  const m = asMedia(media)
  if (!m) return null
  return (
    <figure className="not-prose my-8">
      <a
        href={getMediaUrl(m.url)}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mx-auto block w-fit overflow-hidden rounded-2xl border border-border bg-card"
        aria-label={`Open full-size image${m.alt ? `: ${m.alt}` : ''}`}
      >
        <Media resource={m} imgClassName="block h-auto max-h-[34rem] w-auto max-w-full" size="(min-width: 1024px) 48rem, 100vw" />
        <ZoomHint />
      </a>
      {m.alt && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{m.alt}</figcaption>}
    </figure>
  )
}

/** Two or more pictures in a row → tidy grid of equal frames; nothing is cropped. */
export function MediaGallery({ items }: { items: MediaBlockProps[] }) {
  const list = items.map((i) => asMedia(i.media)).filter((m): m is MediaType => !!m)
  if (!list.length) return null
  return (
    <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
      {list.map((m, i) => (
        <a
          key={`${m.id}-${i}`}
          href={getMediaUrl(m.url)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open full-size image${m.alt ? `: ${m.alt}` : ''}`}
          className={cn(
            'group relative block overflow-hidden rounded-2xl border border-border bg-card',
            // An odd last picture takes the full row
            list.length % 2 === 1 && i === list.length - 1 && 'sm:col-span-2',
          )}
        >
          <div className={cn('relative', list.length % 2 === 1 && i === list.length - 1 ? 'aspect-[16/9]' : 'aspect-[4/3]')}>
            <Media
              resource={m}
              fill
              imgClassName="object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
              size="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          <ZoomHint />
        </a>
      ))}
    </div>
  )
}

const ZoomHint = () => (
  <span className="absolute right-3 bottom-3 inline-flex size-9 items-center justify-center rounded-full bg-navy/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
    <Expand className="size-4" aria-hidden />
  </span>
)

type LexicalNode = { type: string; fields?: { blockType?: string } & Record<string, unknown> } & Record<string, unknown>

/** Groups runs of 2+ consecutive picture blocks into one "mediaGroup" block so they render as a grid. */
export function groupConsecutiveMedia<T extends { root: { children: unknown[] } }>(state: T): T {
  const out: LexicalNode[] = []
  let run: LexicalNode[] = []
  const flush = () => {
    if (run.length > 1) {
      out.push({
        type: 'block',
        version: 2,
        format: '',
        fields: { blockType: 'mediaGroup', id: `group-${out.length}`, items: run.map((n) => n.fields) },
      })
    } else out.push(...run)
    run = []
  }
  for (const node of state.root.children as LexicalNode[]) {
    if (node.type === 'block' && node.fields?.blockType === 'mediaBlock') run.push(node)
    else {
      flush()
      out.push(node)
    }
  }
  flush()
  return { ...state, root: { ...state.root, children: out } }
}
