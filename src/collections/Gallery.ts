import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { fileUrlNoSlash } from '../hooks/fileUrlNoSlash'
import { revalidateSiteAfterChange, revalidateSiteAfterDelete } from '../hooks/revalidateSite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Photo gallery. Upload many images at once with "Bulk upload", then pick a category. */
export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery photo', plural: 'Gallery' },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'category', 'alt', 'createdAt'],
    group: 'Media',
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  fields: [
    {
      name: 'alt',
      label: 'Description',
      type: 'text',
      admin: { description: 'Short description of the photo (helps Google and screen readers).' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'hotel-tourism',
      options: [
        { label: 'Hotel & Tourism', value: 'hotel-tourism' },
        { label: 'Fire & Industrial Safety', value: 'fire-safety' },
        { label: 'Campus & Events', value: 'campus' },
      ],
    },
  ],
  upload: {
    // Static directory for uploaded gallery images
    staticDir: path.resolve(dirname, '../../public/gallery'),
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300 },
      { name: 'medium', width: 800 },
      { name: 'large', width: 1600 },
    ],
  },
  hooks: {
    afterChange: [revalidateSiteAfterChange],
    afterDelete: [revalidateSiteAfterDelete],
    // File URLs must not end in "/" (see hooks/fileUrlNoSlash)
    afterRead: [fileUrlNoSlash],
  },
}
