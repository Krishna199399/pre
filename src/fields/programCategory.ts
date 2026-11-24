import type { SelectField } from 'payload'

export const programCategoryOptions = [
  { label: 'Hotel & Tourism Management', value: 'hotel-tourism' },
  { label: 'Fire & Industrial Safety Management', value: 'fire-safety' },
]

export const programCategory = (
  overrides: Partial<Omit<SelectField, 'type' | 'options'>> = {},
): SelectField => ({
  name: 'category',
  type: 'select',
  options: programCategoryOptions,
  ...overrides,
}) as SelectField
