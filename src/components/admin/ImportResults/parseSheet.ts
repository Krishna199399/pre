import * as XLSX from 'xlsx'

import type { ImportRow } from '@/endpoints/importResults'

/** Columns of the template. Subject columns carry max/pass marks in brackets: "Food Production (100/35)". */
export const TEMPLATE_HEADERS = [
  'Reg No',
  'Student Name',
  'Date of Birth (DD/MM/YYYY)',
  'Course',
  'Batch',
  "Father's Name",
  'Phone',
  'Examination',
  'Subject 1 (100/35)',
  'Subject 2 (100/35)',
  'Subject 3 (50/18)',
]

const EXAMPLE_ROW = [
  'DFISM111',
  'Ravi Kumar',
  '15/06/2004',
  'Fire & Industrial Safety',
  '2025-26',
  'Suresh Kumar',
  '9876543210',
  'Final Examination 2025-26',
  78,
  65,
  41,
]

const HELP = [
  ['How to fill this sheet'],
  [''],
  ['1. One row per student. Delete the example row (Ravi Kumar) before importing.'],
  ['2. Reg No: the short form, e.g. DFISM111 (the full PRE/DWD/DFISM/25-26/111 also works).'],
  ['3. Student Name and Date of Birth are needed for new students. Date of birth is the student’s portal password — DD/MM/YYYY.'],
  ['4. Course: write "Hotel & Tourism" or "Fire & Industrial Safety".'],
  ['5. Subjects: rename the "Subject 1 (100/35)" columns to your real subjects. In brackets: maximum marks / pass marks.'],
  ['   Add or delete subject columns as needed. Leave a mark empty if the student did not take that subject; write AB if absent.'],
  ['6. Use the same Examination name for the whole batch, e.g. "Final Examination 2025-26".'],
  ['   Importing again with the same Reg No + Examination replaces that result (useful for corrections).'],
]

export function downloadTemplate() {
  const wb = XLSX.utils.book_new()
  const sheet = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, EXAMPLE_ROW])
  sheet['!cols'] = TEMPLATE_HEADERS.map((h) => ({ wch: Math.max(14, h.length + 2) }))
  XLSX.utils.book_append_sheet(wb, sheet, 'Results')
  const help = XLSX.utils.aoa_to_sheet(HELP)
  help['!cols'] = [{ wch: 120 }]
  XLSX.utils.book_append_sheet(wb, help, 'Instructions')
  XLSX.writeFile(wb, 'prestige-results-template.xlsx')
}

type Column =
  | { kind: 'regNo' | 'name' | 'dob' | 'course' | 'batch' | 'fatherName' | 'phone' | 'examName' }
  | { kind: 'subject'; subject: string; maxMarks: number; passMarks: number | null }
  | { kind: 'ignore' }

const SUBJECT = /^(.*?)\s*\(\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?))?\s*\)\s*$/

function classify(header: string): Column {
  const h = header.trim().toLowerCase()
  if (!h) return { kind: 'ignore' }
  const subj = header.trim().match(SUBJECT)
  if (subj && subj[1]) return { kind: 'subject', subject: subj[1].trim(), maxMarks: Number(subj[2]), passMarks: subj[3] ? Number(subj[3]) : null }
  if (/reg/.test(h)) return { kind: 'regNo' }
  if (/birth|dob/.test(h)) return { kind: 'dob' }
  if (/father/.test(h)) return { kind: 'fatherName' }
  if (/student|^name/.test(h)) return { kind: 'name' }
  if (/course|programme|program/.test(h)) return { kind: 'course' }
  if (/batch|year/.test(h)) return { kind: 'batch' }
  if (/phone|mobile|contact/.test(h)) return { kind: 'phone' }
  if (/exam/.test(h)) return { kind: 'examName' }
  return { kind: 'ignore' }
}

/** Excel date cell → DD/MM/YYYY (works whatever time zone the date was stored with). */
const dateText = (d: Date) => {
  const n = new Date(d.getTime() + 12 * 3600 * 1000)
  return `${String(n.getDate()).padStart(2, '0')}/${String(n.getMonth() + 1).padStart(2, '0')}/${n.getFullYear()}`
}

const text = (v: unknown) => (v instanceof Date ? dateText(v) : v == null ? '' : String(v).trim())

export type ParsedSheet = { rows: ImportRow[]; warnings: string[]; subjects: string[] }

export async function parseResultsFile(file: File): Promise<ParsedSheet> {
  const wb = XLSX.read(await file.arrayBuffer(), { cellDates: true })
  const ws = wb.Sheets[wb.SheetNames[0]]
  if (!ws) throw new Error('The file has no sheets.')
  const grid = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, defval: '' })
  const headerIndex = grid.findIndex((r) => r.some((c) => /reg/i.test(text(c))))
  if (headerIndex < 0) throw new Error('Could not find the header row — the first row should contain a "Reg No" column.')

  const headers = grid[headerIndex].map((h) => text(h))
  const columns = headers.map(classify)
  const warnings: string[] = []

  headers.forEach((h, i) => {
    if (h && columns[i].kind === 'ignore') warnings.push(`Column "${h}" was ignored. Subject columns need marks in brackets, e.g. "${h} (100/35)".`)
  })
  if (!columns.some((c) => c.kind === 'examName')) warnings.push('No "Examination" column — every row needs the examination name.')
  const subjects = columns.filter((c): c is Extract<Column, { kind: 'subject' }> => c.kind === 'subject').map((c) => c.subject)
  if (!subjects.length) throw new Error('No subject columns found. Name them like "Food Production (100/35)" — maximum / pass marks in brackets.')

  const rows: ImportRow[] = []
  grid.slice(headerIndex + 1).forEach((cells, idx) => {
    if (!cells.some((c) => text(c))) return // blank line
    const row: ImportRow = { row: headerIndex + idx + 2, regNo: '', examName: '', subjects: [] }
    columns.forEach((col, i) => {
      const value = cells[i]
      if (col.kind === 'ignore') return
      if (col.kind === 'subject') {
        const raw = text(value).toUpperCase()
        if (!raw) return // subject not taken
        const marks = raw === 'AB' || raw === 'A' || raw === 'ABSENT' ? 0 : Number(raw)
        row.subjects.push({ subject: col.subject, maxMarks: col.maxMarks, passMarks: col.passMarks, marksObtained: Number.isFinite(marks) ? marks : NaN })
        return
      }
      ;(row as Record<string, unknown>)[col.kind] = text(value)
    })
    rows.push(row)
  })

  if (rows.some((r) => /ravi kumar/i.test(r.name || '') && r.regNo === 'DFISM111')) {
    warnings.push('The example row (Ravi Kumar, DFISM111) is still in the file — delete it unless it is a real student.')
  }
  return { rows, warnings, subjects }
}
