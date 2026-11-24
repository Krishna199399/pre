import type { Block } from 'payload'

import { sectionBackground, sectionHeader } from '@/fields/section'

/** All faculty members (managed under Academics → Faculty). */
export const FacultyGrid: Block = {
  slug: 'facultyGrid',
  interfaceName: 'FacultyGridBlock',
  labels: { singular: 'Faculty grid', plural: 'Faculty grids' },
  fields: [sectionHeader, sectionBackground],
}
