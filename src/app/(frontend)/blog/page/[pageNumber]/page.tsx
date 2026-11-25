import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { BlogListing, POSTS_PER_PAGE } from '@/components/BlogListing'
import { SITE_NAME } from '@/utilities/mergeOpenGraph'

export const revalidate = 600

type Args = {
  params: Promise<{ pageNumber: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const page = Number(pageNumber)
  if (!Number.isInteger(page) || page < 1) notFound()
  if (page === 1) redirect('/blog/')
  return <BlogListing page={page} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Blog — Page ${pageNumber || ''} | ${SITE_NAME}`,
    description: 'More news, awards, industry visits and career guidance from Prestige Institute Dharwad.',
    alternates: { canonical: `/blog/page/${pageNumber}/` },
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { totalDocs } = await payload.count({ collection: 'posts', overrideAccess: false })
    const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ pageNumber: String(i + 2) }))
  } catch {
    // DB not migrated yet or unavailable at build time — pages rendered on-demand instead
    return []
  }
}
