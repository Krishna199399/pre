import type { Metadata } from 'next'

import type { Config, Course, Media, Page, Post } from '../payload-types'

import { PAGE_SEO, SITE_KEYWORDS, type PageSeo } from '@/seo/site'

import { docPath, withSlash } from './docPath'
import { getServerSideURL } from './getURL'
import { mergeOpenGraph, SITE_NAME } from './mergeOpenGraph'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    return ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }
  return undefined
}

/** Some descriptions imported from WordPress contain HTML entities ("&amp;"); show real characters. */
const decodeEntities = (s: string) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#0?39;|&#x27;|&rsquo;|&lsquo;/g, '’')
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')

/** Builds page metadata from the code-defined SEO entry (src/seo/site.ts) for a known route. */
export const metaFor = (key: string, path: string, extra: Partial<PageSeo> = {}): Metadata => {
  const seo = { ...PAGE_SEO[key], ...extra } as PageSeo
  path = withSlash(path)
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: path },
    openGraph: mergeOpenGraph({ title: seo.title, description: seo.description, url: path }),
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
  }
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<Course> | null
  collection?: 'pages' | 'posts' | 'courses'
}): Promise<Metadata> => {
  const { doc, collection = 'pages' } = args
  const slug = typeof doc?.slug === 'string' ? doc.slug : 'home'

  // Code-defined SEO wins for pages and courses (admin is results-only, so this is where SEO lives).
  const seo: PageSeo | undefined = PAGE_SEO[collection === 'courses' ? `course:${slug}` : slug]

  const ogImage =
    getImageURL(doc?.meta?.image) ||
    getImageURL(doc && 'heroImage' in doc ? doc.heroImage : undefined) ||
    getImageURL(doc && 'image' in doc ? doc.image : undefined)

  let title =
    seo?.title ||
    doc?.meta?.title ||
    (doc?.title && slug !== 'home' ? `${doc.title} | ${SITE_NAME}` : `${SITE_NAME} | Hotel Management & Fire Safety Institute`)
  // Long blog titles: drop the "| Prestige Institute Dharwad" suffix so Google shows the headline in full
  if (title.length > 60) title = title.replace(/\s*\|\s*Prestige Institute Dharwad\s*$/i, '')
  const description = decodeEntities(seo?.description || doc?.meta?.description || '') || undefined

  // Blog posts: keywords from their categories + the institute's core topics
  const keywords =
    seo?.keywords ||
    (collection === 'posts'
      ? [
          ...((doc as Partial<Post>)?.categories || []).flatMap((c) => (typeof c === 'object' && c?.title ? [c.title] : [])),
          'Prestige Institute Dharwad',
          'hotel management',
          'fire and industrial safety',
        ]
      : SITE_KEYWORDS)

  const path = docPath(collection, slug)
  const isPost = collection === 'posts'

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: path,
      ...(isPost
        ? {
            type: 'article',
            publishedTime: (doc as Partial<Post>)?.publishedAt || undefined,
            modifiedTime: (doc as Partial<Post>)?.updatedAt || undefined,
          }
        : {}),
    }),
    twitter: { card: 'summary_large_image', title, description, images: ogImage ? [ogImage] : undefined },
  }
}
