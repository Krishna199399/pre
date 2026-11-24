import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'subItems',
          label: 'Dropdown items',
          type: 'array',
          admin: { description: 'Optional. When filled, this menu item opens a dropdown.' },
          fields: [link({ appearances: false })],
        },
      ],
      maxRows: 12,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'topLinks',
      label: 'Top bar links',
      type: 'array',
      maxRows: 3,
      admin: { description: 'Small links on the right of the dark top bar (e.g. Student Portal).' },
      fields: [link({ appearances: false })],
    },
    {
      name: 'cta',
      label: 'Highlighted button',
      type: 'group',
      fields: [link({ appearances: false })],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
