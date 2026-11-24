import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import React, { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { PostView } from '@/components/PostView'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { docPath } from '@/utilities/docPath'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { FAQSection } from '@/components/FAQSection'
import { FAQS } from '@/seo/faqs'

/**
 * Pages and blog posts share the root URL space (e.g. /about-prestige and /kle-college-visit-...),
 * exactly like the old WordPress site, so existing Google links keep working.
 */
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const [pages, posts] = await Promise.all([
    payload.find({ collection: 'pages', draft: false, limit: 1000, overrideAccess: false, pagination: false, select: { slug: true } }),
    payload.find({ collection: 'posts', draft: false, limit: 1000, overrideAccess: false, pagination: false, select: { slug: true } }),
  ])

  return [...pages.docs, ...posts.docs]
    .filter((doc) => doc.slug && doc.slug !== 'home')
    .map(({ slug }) => ({ slug: slug as string }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug: slugParam } = await paramsPromise
  // The home page lives at "/", never at "/home" (avoids duplicate content in Google).
  if (slugParam === 'home') permanentRedirect('/')
  const slug = slugParam || 'home'
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = decodedSlug === 'home' ? '/' : '/' + decodedSlug

  const page = await queryPageBySlug({ slug: decodedSlug })

  if (page) {
    const { hero, layout, title } = page
    return (
      <article>
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <RenderHero {...hero} title={title} path={docPath('pages', decodedSlug)} />
        <RenderBlocks blocks={layout} />
        {/* Questions & answers for search / AI answer engines (src/seo/faqs.ts) */}
        {FAQS[decodedSlug] && <FAQSection heading={FAQS[decodedSlug].heading} items={FAQS[decodedSlug].items} />}
      </article>
    )
  }

  const post = decodedSlug === 'home' ? null : await queryPostBySlug({ slug: decodedSlug })

  if (post) {
    const payload = await getPayload({ config: configPromise })
    const more = await payload.find({
      collection: 'posts',
      limit: 3,
      depth: 1,
      overrideAccess: false,
      sort: '-publishedAt',
      where: { id: { not_equals: post.id } },
    })
    return (
      <>
        <PayloadRedirects disableNotFound url={url} />
        {draft && <LivePreviewListener />}
        <PostView post={post} morePosts={more.docs} />
      </>
    )
  }

  return <PayloadRedirects url={url} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({ slug: decodedSlug })
  if (page) return generateMeta({ doc: page, collection: 'pages' })

  const post = await queryPostBySlug({ slug: decodedSlug })
  return generateMeta({ doc: post, collection: 'posts' })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})
