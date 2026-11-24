import type { Block } from 'payload'

import { sectionBackground, sectionHeader } from '@/fields/section'

/** Scrolling recruiter logo rows (managed under Placements → Recruiters). */
export const RecruitersBlock: Block = {
  slug: 'recruiters',
  interfaceName: 'RecruitersBlock',
  labels: { singular: 'Recruiter logos', plural: 'Recruiter logos' },
  fields: [
    sectionHeader,
    {
      name: 'rows',
      type: 'select',
      defaultValue: 'split',
      options: [
        { label: 'Two rows (Hotel & Tourism / Fire & Safety)', value: 'split' },
        { label: 'One row with all logos', value: 'single' },
      ],
    },
    sectionBackground,
  ],
}
