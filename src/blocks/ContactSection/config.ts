import type { Block } from 'payload'

import { sectionHeader } from '@/fields/section'

/** Contact details (from Site Settings) + a form + optional map. */
export const ContactSection: Block = {
  slug: 'contactSection',
  interfaceName: 'ContactSectionBlock',
  labels: { singular: 'Contact section', plural: 'Contact sections' },
  fields: [
    sectionHeader,
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    {
      name: 'showMap',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Uses the map link from Site Settings → Contact.' },
    },
  ],
}
