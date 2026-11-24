import type { Block } from 'payload'

import { sectionBackground } from '@/fields/section'

/** Row of big numbers — 1000+ students placed, 100% placement assistance, etc. */
export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: { singular: 'Numbers / stats', plural: 'Numbers / stats' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '40%', description: 'e.g. 1000+' } },
            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    sectionBackground,
  ],
}
