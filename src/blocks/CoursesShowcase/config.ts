import type { Block } from 'payload'

import { sectionBackground, sectionHeader } from '@/fields/section'

/** Course cards pulled from the Courses collection. */
export const CoursesShowcase: Block = {
  slug: 'coursesShowcase',
  interfaceName: 'CoursesShowcaseBlock',
  labels: { singular: 'Courses', plural: 'Courses' },
  fields: [
    sectionHeader,
    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      admin: { description: 'Leave empty to show all courses.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'cards',
          admin: { width: '50%' },
          options: [
            { label: 'Cards', value: 'cards' },
            { label: 'Detailed (image + summary + facts)', value: 'detailed' },
          ],
        },
        { ...sectionBackground, admin: { ...sectionBackground.admin, width: '50%' } } as typeof sectionBackground,
      ],
    },
  ],
}
