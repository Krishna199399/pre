import type { Metadata } from 'next/types'
import React from 'react'

import { BlogListing } from '@/components/BlogListing'
import { metaFor } from '@/utilities/generateMeta'

export const dynamic = 'force-static'
export const revalidate = 600

export default function Page() {
  return <BlogListing page={1} />
}

export function generateMetadata(): Metadata {
  return metaFor('blog', '/blog/')
}
