import type { Block } from 'payload'

import { link } from '@/fields/link'
import { iconField, sectionBackground, sectionHeader } from '@/fields/section'

/** Grid of cards — "What We Offer", "Why Choose Us", "Our Values", facilities, etc. */
export const FeatureCards: Block = {
  slug: 'featureCards',
  interfaceName: 'FeatureCardsBlock',
  labels: { singular: 'Feature cards', plural: 'Feature cards' },
  fields: [
    sectionHeader,
    {
      type: 'row',
      fields: [
        {
          name: 'style',
          type: 'select',
          defaultValue: 'cards',
          admin: { width: '33%' },
          options: [
            { label: 'Cards with image on top', value: 'cards' },
            { label: 'Compact cards with icon', value: 'icon' },
            { label: 'Simple list (title + text)', value: 'simple' },
          ],
        },
        {
          name: 'columns',
          type: 'select',
          defaultValue: '3',
          admin: { width: '33%' },
          options: ['2', '3', '4'].map((v) => ({ label: `${v} columns`, value: v })),
        },
        { ...sectionBackground, admin: { ...sectionBackground.admin, width: '33%' } } as typeof sectionBackground,
      ],
    },
    {
      name: 'imageFit',
      type: 'select',
      defaultValue: 'cover',
      admin: { condition: (_, s) => s?.style === 'cards', description: 'Use "Show whole image" for icons and illustrations.' },
      options: [
        { label: 'Fill the frame (photos)', value: 'cover' },
        { label: 'Show whole image (icons/illustrations)', value: 'contain' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
            { ...iconField, admin: { ...iconField.admin, width: '50%' } } as typeof iconField,
          ],
        },
        { name: 'enableLink', type: 'checkbox' },
        link({
          appearances: false,
          overrides: { admin: { condition: (_: unknown, s: { enableLink?: boolean }) => Boolean(s?.enableLink) } },
        }),
      ],
    },
  ],
}
