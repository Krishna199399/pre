/**
 * Single source of truth for public URLs.
 * Pages and blog posts live at the site root (matching the old WordPress URLs),
 * courses get their own detail pages under /courses.
 */
export type LinkableCollection = 'pages' | 'posts' | 'courses'

/**
 * Every page URL ends with a slash, like the old WordPress site (/about-prestige/) — next.config has
 * `trailingSlash: true`. Adds the slash to internal paths; leaves files (/sitemap.xml), external links,
 * #anchors and ?queries alone.
 */
export const withSlash = (href: string): string => {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const cut = href.search(/[?#]/)
  const path = cut === -1 ? href : href.slice(0, cut)
  const rest = cut === -1 ? '' : href.slice(cut)
  const last = path.split('/').pop() || ''
  if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(last)) return href
  return `${path}/${rest}`
}

/** Path without its trailing slash — for comparing two paths. */
export const stripSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path)

export const docPath = (relationTo: LinkableCollection | string, slug?: string | null): string => {
  if (!slug) return '/'
  if (relationTo === 'courses') return `/courses/${slug}/`
  if (relationTo === 'pages' && slug === 'home') return '/'
  return `/${slug}/`
}

type LinkLike = {
  type?: 'reference' | 'custom' | null
  url?: string | null
  reference?: { relationTo: string; value: unknown } | null
}

/** Resolve a Payload `link` field to an href (same rules as CMSLink). */
export const linkHref = (link?: LinkLike | null): string | null => {
  if (!link) return null
  if (link.type === 'reference' && link.reference && typeof link.reference.value === 'object') {
    const slug = (link.reference.value as { slug?: string | null })?.slug
    return slug ? docPath(link.reference.relationTo, slug) : null
  }
  return link.url ? withSlash(link.url) : null
}
