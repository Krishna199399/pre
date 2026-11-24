import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateSiteAfterChange, revalidateSiteAfterDelete } from '../hooks/revalidateSite'

export const Faculty: CollectionConfig = {
  slug: 'faculty',
  labels: { singular: 'Faculty member', plural: 'Faculty' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'role', 'order'], group: 'Academics' },
  defaultSort: 'order',
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'role',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'e.g. HOD, Hotel Management Faculty' },
        },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'qualification', type: 'text' },
    { name: 'bio', type: 'textarea' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    {
      name: 'visible',
      label: 'Show on website',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
  hooks: { afterChange: [revalidateSiteAfterChange], afterDelete: [revalidateSiteAfterDelete] },
}
