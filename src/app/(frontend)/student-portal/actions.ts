'use server'

import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { normalizeRegNo, parseDob } from '@/utilities/studentLogin'

export type PortalResult = {
  id: string
  examName: string
  declaredOn?: string | null
  subjects: { subject: string; maxMarks: number; passMarks?: number | null; marksObtained: number }[]
  total: number
  maxTotal: number
  percentage: number
  grade?: string | null
  result?: 'pass' | 'fail' | null
  remarks?: string | null
}

export type PortalState =
  | { status: 'idle' }
  | { status: 'error'; message: string; values?: { regNo: string; dob: string } }
  | {
      status: 'found'
      student: { name: string; regNo: string; course?: string | null; batch?: string | null; fatherName?: string | null }
      results: PortalResult[]
    }

// Simple in-memory rate limit: 8 attempts per 15 minutes per IP (single-server hosting).
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8
const attempts = new Map<string, { count: number; first: number }>()

const tooManyAttempts = (ip: string) => {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now - entry.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now })
    return false
  }
  entry.count += 1
  return entry.count > MAX_ATTEMPTS
}

/** Calendar date of a stored date, as seen in India. */
const toISTDate = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(iso),
  )

const NOT_FOUND =
  'No published result matches these details. Please check your Registration Number and password (date of birth), or contact the office.'

export async function lookupResult(_prev: PortalState, formData: FormData): Promise<PortalState> {
  // Keep exactly what was typed so the form can be refilled after an error
  const values = { regNo: String(formData.get('regNo') || '').trim(), dob: String(formData.get('dob') || '').trim() }
  const regNo = normalizeRegNo(values.regNo) // PRE/DWD/DFISM/25-26/111 or DFISM111 → DFISM111
  const dob = parseDob(values.dob) // DD/MM/YYYY → yyyy-mm-dd

  if (!regNo) return { status: 'error', message: 'Please enter your Registration Number.', values }
  if (!dob) return { status: 'error', message: 'Please enter your password — your date of birth as DD/MM/YYYY.', values }

  const h = await headers()
  const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
  if (tooManyAttempts(ip)) {
    return { status: 'error', message: 'Too many attempts. Please wait 15 minutes and try again.', values }
  }

  const payload = await getPayload({ config: configPromise })

  const { docs: students } = await payload.find({
    collection: 'students',
    where: { regNo: { equals: regNo } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })
  const student = students[0]

  // Same message whether the number or the date is wrong, so details can't be guessed one at a time.
  if (!student || !student.dob || toISTDate(student.dob) !== dob) {
    return { status: 'error', message: NOT_FOUND, values }
  }

  const { docs: results } = await payload.find({
    collection: 'results',
    where: { and: [{ student: { equals: student.id } }, { published: { equals: true } }] },
    sort: '-declaredOn',
    limit: 20,
    depth: 0,
    overrideAccess: true,
  })

  if (!results.length) {
    return { status: 'error', message: 'Your results have not been published yet. Please check again later.', values }
  }

  attempts.delete(ip)

  return {
    status: 'found',
    student: {
      name: student.name,
      regNo: student.regNo,
      course: typeof student.course === 'object' ? student.course?.title : null,
      batch: student.batch,
      fatherName: student.fatherName,
    },
    results: results.map((r) => ({
      id: String(r.id),
      examName: r.examName,
      declaredOn: r.declaredOn,
      subjects: (r.subjects || []).map((s) => ({
        subject: s.subject,
        maxMarks: s.maxMarks,
        passMarks: s.passMarks,
        marksObtained: s.marksObtained,
      })),
      total: r.total ?? 0,
      maxTotal: r.maxTotal ?? 0,
      percentage: r.percentage ?? 0,
      grade: r.grade,
      result: r.result,
      remarks: r.remarks,
    })),
  }
}
