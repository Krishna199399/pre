import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { Reveal } from '@/components/Reveal'
import type { Media } from '@/payload-types'

import { PageBanner } from '@/heros/PageBanner'

export const POSTS_PER_PAGE = 12

/** Shared by /blog and /blog/page/[n]. */
export async function BlogListing({ page = 1 }: { page?: number }) {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page,
    overrideAccess: false,
    sort: '-publishedAt',
    select: { title: true, slug: true, categories: true, meta: true, heroImage: true, publishedAt: true },
  })

  return (
    <>
      <PageBanner
        title="Blog"
        eyebrow="News & Insights"
        text="Campus news, industry visits, awards and career guidance for Hotel & Tourism and Fire & Industrial Safety students."
        collage={posts.docs.map((p) => p.heroImage).filter((m): m is Media => !!m && typeof m === 'object').slice(0, 3)}
      />
      <section className="section bg-card">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
          {posts.totalPages > 1 && posts.page && (
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </section>
    </>
  )
}
