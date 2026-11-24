import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'page',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Home page hero (large)', value: 'home' },
        { label: 'Page banner (title strip)', value: 'page' },
      ],
      required: true,
    },
    {
      type: 'row',
      admin: { condition: (_, { type } = {}) => type !== 'none' },
      fields: [
        { name: 'eyebrow', label: 'Small label', type: 'text', admin: { width: '30%' } },
        {
          name: 'heading',
          type: 'text',
          admin: { width: '70%', description: 'Leave empty to use the page title.' },
        },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      admin: { condition: (_, { type } = {}) => type !== 'none' },
    },
    {
      ...linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
      admin: { condition: (_: unknown, { type }: { type?: string } = {}) => type === 'home' },
    } as Field,
    {
      name: 'highlights',
      type: 'array',
      maxRows: 4,
      admin: {
        condition: (_, { type } = {}) => type === 'home',
        description: 'Short points shown under the buttons, e.g. "100% Placement Assistance".',
      },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'badges',
      label: 'Floating badges',
      type: 'array',
      maxRows: 3,
      admin: {
        condition: (_, { type } = {}) => type === 'home',
        description: 'Small cards floating over the hero photo, e.g. "1000+" / "Students placed".',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'label', type: 'text', required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'slides',
      label: 'Slideshow photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, { type } = {}) => type === 'home',
        description:
          'Background photos that change every few seconds. Wide photos (16:9) work best; keep the left side calm so the text stays readable. Drag to reorder.',
      },
    },
    {
      name: 'media',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
        description:
          'Page banner: a wide photo fills the right side of the banner. A tall (portrait) photo is shown in a frame with its alt text as a caption — good for a person.',
      },
    },
    {
      name: 'collage',
      label: 'Banner collage',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 4,
      admin: {
        condition: (_, { type } = {}) => type === 'page',
        description:
          'Optional, used when there is no Image: 2–4 pictures shown as a fanned stack (e.g. certificates or faculty photos). Pictures are never cropped.',
      },
    },
  ],
  label: false,
}
