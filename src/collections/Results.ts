import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticated } from '../access/authenticated'
import { importResultsEndpoint } from '../endpoints/importResults'

type Subject = { subject?: string; maxMarks?: number | null; passMarks?: number | null; marksObtained?: number | null }

export const gradeFor = (percentage: number): string => {
  if (percentage >= 75) return 'Distinction'
  if (percentage >= 60) return 'First Class'
  if (percentage >= 50) return 'Second Class'
  if (percentage >= 35) return 'Pass Class'
  return '—'
}

/** Works out totals, percentage, grade and pass/fail so the admin only enters marks. */
const computeTotals: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  const subjects: Subject[] = data.subjects ?? originalDoc?.subjects ?? []
  const total = subjects.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0)
  const maxTotal = subjects.reduce((sum, s) => sum + (Number(s.maxMarks) || 0), 0)
  const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 10000) / 100 : 0
  const failedSubject = subjects.some(
    (s) => s.passMarks != null && Number(s.marksObtained) < Number(s.passMarks),
  )
  const passed = !failedSubject && percentage >= 35

  data.total = total
  data.maxTotal = maxTotal
  data.percentage = percentage
  if (!data.overrideGrade) {
    data.result = passed ? 'pass' : 'fail'
    data.grade = passed ? gradeFor(percentage) : '—'
  }

  // Readable title for the admin list, e.g. "PID25001 · Final Examination 2025-26"
  const studentId = typeof data.student === 'object' ? data.student?.id : data.student
  if (studentId) {
    try {
      const student = await req.payload.findByID({ collection: 'students', id: studentId, depth: 0, req })
      data.title = `${student.regNo} · ${student.name} · ${data.examName ?? ''}`.trim()
    } catch {
      data.title = data.examName
    }
  }
  return data
}

export const Results: CollectionConfig = {
  slug: 'results',
  labels: { singular: 'Result', plural: 'Results' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'percentage', 'grade', 'result', 'published'],
    group: 'Student Portal',
    description:
      'Enter marks per subject — total, percentage, grade and pass/fail are calculated automatically. Students only see results marked "Published". For a whole batch, use "Import from Excel" in the menu.',
  },
  access: { create: authenticated, delete: authenticated, read: authenticated, update: authenticated },
  fields: [
    { name: 'title', type: 'text', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        { name: 'student', type: 'relationship', relationTo: 'students', required: true, index: true, admin: { width: '50%' } },
        {
          name: 'examName',
          label: 'Examination',
          type: 'text',
          required: true,
          defaultValue: 'Final Examination',
          admin: { width: '50%', description: 'e.g. "Final Examination 2025-26"' },
        },
      ],
    },
    {
      name: 'subjects',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'Subject', plural: 'Subjects' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'subject', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'maxMarks', type: 'number', required: true, defaultValue: 100, min: 1, admin: { width: '20%' } },
            { name: 'passMarks', type: 'number', defaultValue: 35, min: 0, admin: { width: '20%' } },
            { name: 'marksObtained', type: 'number', required: true, min: 0, admin: { width: '20%' } },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'total', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'maxTotal', label: 'Out of', type: 'number', admin: { readOnly: true, width: '25%' } },
        { name: 'percentage', type: 'number', admin: { readOnly: true, width: '25%' } },
        {
          name: 'result',
          type: 'select',
          options: [
            { label: 'Pass', value: 'pass' },
            { label: 'Fail', value: 'fail' },
          ],
          admin: { width: '25%', readOnly: false },
        },
      ],
    },
    { name: 'grade', type: 'text' },
    {
      name: 'overrideGrade',
      label: 'Set grade and result manually',
      type: 'checkbox',
      admin: { description: 'Tick only if the grade/result should not be calculated from marks.' },
    },
    { name: 'remarks', type: 'textarea' },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar', description: 'Students can see this result only when ticked.' },
    },
    {
      name: 'declaredOn',
      label: 'Result date',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd/MM/yyyy' } },
    },
  ],
  hooks: { beforeChange: [computeTotals] },
  // POST /api/results/import — used by the "Import from Excel" screen
  endpoints: [importResultsEndpoint],
}
