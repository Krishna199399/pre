import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { programCategory } from '../fields/programCategory'
import { revalidateSiteAfterChange, revalidateSiteAfterDelete } from '../hooks/revalidateSite'

export const Recruiters: CollectionConfig = {
  slug: 'recruiters',
  labels: { singular: 'Recruiter', plural: 'Recruiters' },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'category', 'order'], group: 'Placements' },
  defaultSort: 'order',
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    programCategory({
      required: true,
      admin: { description: 'Which logo row this company appears in.' },
    }),
    { name: 'website', type: 'text' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
  hooks: { afterChange: [revalidateSiteAfterChange], afterDelete: [revalidateSiteAfterDelete] },
}
