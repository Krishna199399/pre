import type { CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { normalizeRegNo } from '../utilities/studentLogin'

/**
 * Students who can look up their results on /student-portal using Registration No. + Date of Birth.
 * Not readable publicly — the portal reads it server-side after the details match.
 */
export const Students: CollectionConfig = {
  slug: 'students',
  labels: { singular: 'Student', plural: 'Students' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['regNo', 'name', 'course', 'batch'],
    listSearchableFields: ['regNo', 'name', 'phone'],
    group: 'Student Portal',
  },
  defaultSort: 'regNo',
  access: { create: authenticated, delete: authenticated, read: authenticated, update: authenticated },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'regNo',
          label: 'Registration No.',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '40%',
            description: 'The short form the student types, e.g. DFISM111. You can paste the full number (PRE/DWD/DFISM/25-26/111) — it is shortened automatically.',
          },
          hooks: {
            // Store the short login form so the portal lookup always matches.
            beforeValidate: [({ value }) => (typeof value === 'string' ? normalizeRegNo(value) : value)],
          },
        },
        { name: 'name', label: 'Full name', type: 'text', required: true, admin: { width: '60%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dob',
          label: 'Date of birth',
          type: 'date',
          required: true,
          admin: {
            description: 'Used as the portal password (DD/MM/YYYY).',
            width: '33%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
        },
        { name: 'course', type: 'relationship', relationTo: 'courses', admin: { width: '33%' } },
        { name: 'batch', type: 'text', admin: { width: '33%', description: 'e.g. 2025-26' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'fatherName', label: "Father's name", type: 'text', admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '50%' } },
      ],
    },
    // Kept in the database but not used: the media library is not part of the results-only admin
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { hidden: true } },
    {
      name: 'results',
      type: 'join',
      collection: 'results',
      on: 'student',
      admin: { defaultColumns: ['examName', 'percentage', 'result', 'published'] },
    },
  ],
}
