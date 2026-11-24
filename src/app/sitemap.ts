import type { MetadataRoute } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { SITE } from '@/seo/site'
import { docPath } from '@/utilities/docPath'

// Rebuilt at most once an hour, so new blog posts and pages appear without a redeploy.
export const revalidate = 3600

/** /sitemap.xml — every public page, course and blog post. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url()
  const payload = await getPayload({ config: configPromise })
  const find = <T extends 'pages' | 'posts' | 'courses'>(collection: T) =>
    payload.find({
      collection,
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: { slug: true, updatedAt: true },
    })

  const [pages, courses, posts] = await Promise.all([find('pages'), find('courses'), find('posts')])

  // Main pages get a higher priority so crawlers visit them first.
  const priority: Record<string, number> = { home: 1, courses: 0.9, admissions: 0.9, 'apply-online': 0.8, placements: 0.8, 'contact-us': 0.8 }

  return [
    ...pages.docs
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${base}${docPath('pages', p.slug as string)}`,
        lastModified: p.updatedAt,
        changeFrequency: (p.slug === 'home' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
        priority: priority[p.slug as string] ?? 0.6,
      })),
    ...courses.docs
      .filter((c) => c.slug)
      .map((c) => ({ url: `${base}${docPath('courses', c.slug as string)}`, lastModified: c.updatedAt, changeFrequency: 'monthly' as const, priority: 0.9 })),
    { url: `${base}/blog/`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/student-portal/`, changeFrequency: 'monthly', priority: 0.5 },
    ...posts.docs
      .filter((p) => p.slug)
      .map((p) => ({ url: `${base}${docPath('posts', p.slug as string)}`, lastModified: p.updatedAt, changeFrequency: 'yearly' as const, priority: 0.5 })),
  ]
}
