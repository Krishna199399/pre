import type { Block } from 'payload'

import { sectionBackground, sectionHeader } from '@/fields/section'

/** Photo gallery with category filter tabs and a lightbox (photos managed under Media → Gallery). */
export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: { singular: 'Photo gallery', plural: 'Photo galleries' },
  fields: [
    sectionHeader,
    {
      type: 'row',
      fields: [
        { name: 'showFilters', type: 'checkbox', defaultValue: true, admin: { width: '33%' } },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 0,
          admin: { width: '33%', description: '0 = show all photos' },
        },
        { ...sectionBackground, admin: { ...sectionBackground.admin, width: '33%' } } as typeof sectionBackground,
      ],
    },
  ],
}
