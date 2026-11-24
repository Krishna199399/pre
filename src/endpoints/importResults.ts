import type { Endpoint, PayloadRequest } from 'payload'

import { normalizeRegNo, parseDob } from '@/utilities/studentLogin'

/** One spreadsheet row, as sent by the import screen (already read from the Excel file in the browser). */
export type ImportRow = {
  row: number // spreadsheet row number, for messages
  regNo: string
  name?: string
  dob?: string // DD/MM/YYYY
  course?: string // free text: "Hotel…" / "Fire…"
  batch?: string
  fatherName?: string
  phone?: string
  examName: string
  subjects: { subject: string; maxMarks: number; passMarks: number | null; marksObtained: number }[]
}

export type ImportOutcome = {
  row: number
  regNo: string
  status: 'created' | 'updated' | 'error'
  message: string
}

const MAX_ROWS = 1000

/** "Hotel & Tourism" / "fire safety" / course title → course id */
async function courseMatcher(req: PayloadRequest) {
  const { docs } = await req.payload.find({ collection: 'courses', limit: 20, depth: 0, overrideAccess: true, req })
  return (text?: string) => {
    const t = (text || '').toLowerCase()
    if (!t) return undefined
    const byTitle = docs.find((c) => c.title.toLowerCase() === t || c.shortTitle?.toLowerCase() === t)
    if (byTitle) return byTitle.id
    if (/hotel|tourism|hospitality/.test(t)) return docs.find((c) => c.category === 'hotel-tourism')?.id
    if (/fire|safety|industrial/.test(t)) return docs.find((c) => c.category === 'fire-safety')?.id
    return undefined
  }
}

/**
 * POST /api/results/import
 * Body: { rows: ImportRow[], publish: boolean, declaredOn?: "yyyy-mm-dd", dryRun?: boolean }
 * Creates students that don't exist yet, updates the details of those that do, and creates or replaces
 * the result for that student + examination. With dryRun, only checks the rows and reports.
 */
export const importResultsEndpoint: Endpoint = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'Please log in again.' }, { status: 401 })

    const body = (await req.json?.()) as { rows?: ImportRow[]; publish?: boolean; declaredOn?: string; dryRun?: boolean }
    const rows = Array.isArray(body?.rows) ? body.rows : []
    if (!rows.length) return Response.json({ error: 'The file has no student rows.' }, { status: 400 })
    if (rows.length > MAX_ROWS) return Response.json({ error: `Please import at most ${MAX_ROWS} rows at a time.` }, { status: 400 })

    const findCourse = await courseMatcher(req)
    const outcomes: ImportOutcome[] = []
    const seen = new Map<string, number>()

    for (const r of rows) {
      const regNo = normalizeRegNo(String(r.regNo || ''))
      const fail = (message: string) => outcomes.push({ row: r.row, regNo: regNo || String(r.regNo || ''), status: 'error', message })

      // ── Check the row ──
      if (!regNo) {
        fail('Registration number is missing.')
        continue
      }
      const examName = String(r.examName || '').trim()
      if (!examName) {
        fail('Examination name is missing.')
        continue
      }
      const key = `${regNo}|${examName.toLowerCase()}`
      if (seen.has(key)) {
        fail(`Same student and examination as row ${seen.get(key)} — remove one of them.`)
        continue
      }
      seen.set(key, r.row)

      const subjects = (r.subjects || []).filter((s) => s.subject)
      if (!subjects.length) {
        fail('No marks found for any subject.')
        continue
      }
      const badMark = subjects.find(
        (s) => typeof s.marksObtained !== 'number' || !Number.isFinite(s.marksObtained) || s.marksObtained < 0 || s.marksObtained > s.maxMarks,
      )
      if (badMark) {
        fail(`Marks for "${badMark.subject}" must be between 0 and ${badMark.maxMarks}.`)
        continue
      }

      const dob = r.dob ? parseDob(String(r.dob)) : null
      if (r.dob && !dob) {
        fail(`Date of birth "${r.dob}" is not a valid date — use DD/MM/YYYY.`)
        continue
      }
      const course = r.course ? findCourse(r.course) : undefined
      if (r.course && !course) {
        fail(`Course "${r.course}" not recognised — write "Hotel & Tourism" or "Fire & Industrial Safety".`)
        continue
      }

      try {
        const existing = (
          await req.payload.find({ collection: 'students', where: { regNo: { equals: regNo } }, limit: 1, depth: 0, overrideAccess: true, req })
        ).docs[0]

        if (!existing && (!r.name || !dob)) {
          fail('New student — Student Name and Date of Birth are required.')
          continue
        }

        const studentData = {
          ...(r.name ? { name: String(r.name).trim() } : {}),
          ...(dob ? { dob: `${dob}T12:00:00.000Z` } : {}), // noon UTC → same calendar day in India
          ...(course ? { course } : {}),
          ...(r.batch ? { batch: String(r.batch).trim() } : {}),
          ...(r.fatherName ? { fatherName: String(r.fatherName).trim() } : {}),
          ...(r.phone ? { phone: String(r.phone).trim() } : {}),
        }

        const prevResult = existing
          ? (
              await req.payload.find({
                collection: 'results',
                where: { and: [{ student: { equals: existing.id } }, { examName: { equals: examName } }] },
                limit: 1,
                depth: 0,
                overrideAccess: true,
                req,
              })
            ).docs[0]
          : undefined

        if (body.dryRun) {
          outcomes.push({
            row: r.row,
            regNo,
            status: prevResult ? 'updated' : 'created',
            message: `${existing ? 'Existing student' : 'New student'} · ${prevResult ? 'replaces the saved result' : 'new result'} · ${subjects.length} subjects`,
          })
          continue
        }

        const student = existing
          ? await req.payload.update({ collection: 'students', id: existing.id, data: studentData, overrideAccess: true, req })
          : await req.payload.create({
              collection: 'students',
              data: { regNo, ...studentData } as { regNo: string; name: string; dob: string },
              overrideAccess: true,
              req,
            })

        const resultData = {
          student: student.id,
          examName,
          subjects,
          published: !!body.publish,
          ...(body.declaredOn ? { declaredOn: `${body.declaredOn}T12:00:00.000Z` } : {}),
        }
        if (prevResult) {
          await req.payload.update({ collection: 'results', id: prevResult.id, data: resultData, overrideAccess: true, req })
        } else {
          await req.payload.create({ collection: 'results', data: resultData, overrideAccess: true, req })
        }

        outcomes.push({
          row: r.row,
          regNo,
          status: prevResult ? 'updated' : 'created',
          message: `${student.name} · ${examName}${body.publish ? ' · published' : ' · saved as not published'}`,
        })
      } catch (err) {
        fail(err instanceof Error ? err.message : 'Could not save this row.')
      }
    }

    return Response.json({
      outcomes,
      summary: {
        created: outcomes.filter((o) => o.status === 'created').length,
        updated: outcomes.filter((o) => o.status === 'updated').length,
        errors: outcomes.filter((o) => o.status === 'error').length,
      },
    })
  },
}
