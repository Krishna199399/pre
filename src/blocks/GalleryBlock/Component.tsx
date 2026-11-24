import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { GalleryBlock as Props } from '@/payload-types'

import { Section, SectionHeader } from '@/components/Section'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { GalleryClient, type GalleryPhoto } from './Gallery.client'

export const GalleryBlockComponent: React.FC<Props> = async ({
  eyebrow,
  heading,
  intro,
  showFilters,
  limit,
  background,
}) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'gallery',
    limit: limit && limit > 0 ? limit : 500,
    sort: '-createdAt',
    depth: 0,
  })

  const photos: GalleryPhoto[] = docs
    .filter((d) => d.url)
    .map((d) => ({
      id: String(d.id),
      category: d.category,
      alt: d.alt || '',
      thumb: getMediaUrl(d.sizes?.medium?.url || d.url, d.updatedAt),
      full: getMediaUrl(d.sizes?.large?.url || d.url, d.updatedAt),
      width: d.sizes?.large?.width || d.width,
      height: d.sizes?.large?.height || d.height,
    }))

  return (
    <Section background={background}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={background === 'navy'} />
      <GalleryClient photos={photos} showFilters={showFilters !== false} />
    </Section>
  )
}
