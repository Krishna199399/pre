import type { Field } from 'payload'

/** Shared "section header" fields used by most blocks: small label, heading, intro text. */
export const sectionHeader: Field = {
  type: 'collapsible',
  label: 'Section heading',
  admin: { initCollapsed: false },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          label: 'Small label',
          type: 'text',
          admin: { width: '30%', description: 'Optional, e.g. "Get In Touch"' },
        },
        { name: 'heading', type: 'text', admin: { width: '70%' } },
      ],
    },
    { name: 'intro', type: 'textarea' },
  ],
}

export const sectionBackground: Field = {
  name: 'background',
  type: 'select',
  defaultValue: 'white',
  admin: { description: 'Section background colour.' },
  options: [
    { label: 'White', value: 'white' },
    { label: 'Light blue', value: 'muted' },
    { label: 'Dark navy', value: 'navy' },
  ],
}

/** Icons the admin can pick for cards when no image is uploaded. Rendered with lucide-react. */
export const iconOptions = [
  'GraduationCap',
  'Hotel',
  'ChefHat',
  'Flame',
  'ShieldCheck',
  'HardHat',
  'Briefcase',
  'Users',
  'Award',
  'Globe',
  'TrendingUp',
  'BookOpen',
  'Wrench',
  'HeartHandshake',
  'Lightbulb',
  'Sparkles',
  'Wifi',
  'Wallet',
  'Bus',
  'MessageSquare',
  'Target',
  'Eye',
  'Scale',
  'Leaf',
  'Building2',
  'CheckCircle2',
] as const

export const iconField: Field = {
  name: 'icon',
  type: 'select',
  options: iconOptions.map((v) => ({ label: v.replace(/([a-z])([A-Z0-9])/g, '$1 $2'), value: v })),
  admin: { description: 'Used when no image is uploaded.' },
}
