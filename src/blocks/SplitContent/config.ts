import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { richEditor } from '@/fields/richEditor'
import { sectionBackground } from '@/fields/section'

/** Image on one side, text on the other — About intro, Vision, Mission, Director's message. */
export const SplitContent: Block = {
  slug: 'splitContent',
  interfaceName: 'SplitContentBlock',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', label: 'Small label', type: 'text', admin: { width: '30%' } },
        { name: 'heading', type: 'text', admin: { width: '70%' } },
      ],
    },
    { name: 'content', type: 'richText', editor: richEditor },
    {
      name: 'checklist',
      type: 'array',
      admin: { description: 'Optional bullet points with tick marks.', initCollapsed: true },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        {
          name: 'imagePosition',
          type: 'select',
          defaultValue: 'left',
          admin: { width: '33%' },
          options: [
            { label: 'Image left', value: 'left' },
            { label: 'Image right', value: 'right' },
          ],
        },
        {
          name: 'imageStyle',
          type: 'select',
          defaultValue: 'landscape',
          admin: { width: '33%' },
          options: [
            { label: 'Landscape photo', value: 'landscape' },
            { label: 'Portrait photo', value: 'portrait' },
            { label: 'Illustration (no crop)', value: 'contain' },
          ],
        },
        { ...sectionBackground, admin: { ...sectionBackground.admin, width: '33%' } } as typeof sectionBackground,
      ],
    },
    { name: 'signature', type: 'text', admin: { description: 'Optional sign-off, e.g. "Raghavendra M Anegundi, Director"' } },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
  ],
}
