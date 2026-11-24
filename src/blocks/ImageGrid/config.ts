import type { Block } from 'payload'

import { sectionBackground, sectionHeader } from '@/fields/section'

/** A set of images that open in a lightbox — affiliation certificates, etc. */
export const ImageGrid: Block = {
  slug: 'imageGrid',
  interfaceName: 'ImageGridBlock',
  labels: { singular: 'Image grid', plural: 'Image grids' },
  fields: [
    sectionHeader,
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          admin: { width: '50%' },
          options: ['2', '3', '4'].map((v) => ({ label: `${v} columns`, value: v })),
        },
        { ...sectionBackground, admin: { ...sectionBackground.admin, width: '50%' } } as typeof sectionBackground,
      ],
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
  ],
}
