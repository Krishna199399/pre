import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionBackground, sectionHeader } from '@/fields/section'

/**
 * Columns of bullet lists — career opportunities, admission procedure steps, eligibility.
 * A single column with a picture is shown as a split: picture on one side, the list (e.g. steps) on the other.
 */
export const ListColumns: Block = {
  slug: 'listColumns',
  interfaceName: 'ListColumnsBlock',
  labels: { singular: 'List columns', plural: 'List columns' },
  fields: [
    sectionHeader,
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'check',
          admin: { width: '50%' },
          options: [
            { label: 'Tick marks', value: 'check' },
            { label: 'Numbered steps', value: 'numbered' },
            { label: 'Tags / pills', value: 'pills' },
          ],
        },
        { ...sectionBackground, admin: { ...sectionBackground.admin, width: '50%' } } as typeof sectionBackground,
      ],
    },
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'text', type: 'textarea', required: true }],
        },
        { name: 'note', type: 'text', admin: { description: 'Optional line under the list, e.g. office timings.' } },
        { name: 'enableLink', label: 'Add a button', type: 'checkbox' },
        link({
          appearances: false,
          overrides: { admin: { condition: (_: unknown, s: { enableLink?: boolean }) => Boolean(s?.enableLink) } },
        }),
      ],
    },
  ],
}
