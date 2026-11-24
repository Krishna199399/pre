import React from 'react'

import type { ImageGridBlock as Props, Media } from '@/payload-types'

import { Section, SectionHeader } from '@/components/Section'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { ImageGridClient } from './ImageGrid.client'

export const ImageGridBlock: React.FC<Props> = ({ eyebrow, heading, intro, images, columns, background }) => {
  const items = (images || [])
    .filter((i): i is typeof i & { image: Media } => typeof i.image === 'object' && !!i.image?.url)
    .map((i) => ({
      src: getMediaUrl(i.image.sizes?.large?.url || i.image.url, i.image.updatedAt),
      thumb: getMediaUrl(i.image.sizes?.medium?.url || i.image.url, i.image.updatedAt),
      alt: i.caption || i.image.alt || '',
      width: i.image.width,
      height: i.image.height,
    }))

  return (
    <Section background={background}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={background === 'navy'} />
      <ImageGridClient items={items} columns={columns || '3'} />
    </Section>
  )
}
