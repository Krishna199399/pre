'use client'

import React, { useState } from 'react'

import type { ImportOutcome, ImportRow } from '@/endpoints/importResults'

import { downloadTemplate, parseResultsFile, type ParsedSheet } from './parseSheet'
import './index.scss'

type Response = { outcomes: ImportOutcome[]; summary: { created: number; updated: number; errors: number }; error?: string }

const today = () => new Date().toISOString().slice(0, 10)

export const ImportResultsClient: React.FC = () => {
  const [fileName, setFileName] = useState('')
  const [sheet, setSheet] = useState<ParsedSheet | null>(null)
  const [check, setCheck] = useState<Response | null>(null)
  const [done, setDone] = useState<Response | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [publish, setPublish] = useState(false)
  const [declaredOn, setDeclaredOn] = useState(today())

  const send = async (rows: ImportRow[], dryRun: boolean): Promise<Response> => {
    const res = await fetch('/api/results/import/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, publish, declaredOn, dryRun }),
    })
    const json = (await res.json().catch(() => ({}))) as Response
    if (!res.ok) throw new Error(json.error || 'The server could not read this file.')
    return json
  }

  const onFile = async (file?: File) => {
    setError('')
    setSheet(null)
    setCheck(null)
    setDone(null)
    if (!file) return
    setFileName(file.name)
    setBusy(true)
    try {
      const parsed = await parseResultsFile(file)
      setSheet(parsed)
      setCheck(await send(parsed.rows, true)) // check every row before anything is saved
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this file.')
    } finally {
      setBusy(false)
    }
  }

  const onImport = async () => {
    if (!sheet) return
    setBusy(true)
    setError('')
    try {
      setDone(await send(sheet.rows, false))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed.')
    } finally {
      setBusy(false)
    }
  }

  const reset = () => {
    setSheet(null)
    setCheck(null)
    setDone(null)
    setFileName('')
    setError('')
  }

  const outcomeFor = (row: number) => (done || check)?.outcomes.find((o) => o.row === row)
  const okRows = check ? check.summary.created + check.summary.updated : 0

  return (
    <div className="import-results">
      <header className="import-results__head">
        <h1>Import results from Excel</h1>
        <p>Add a whole batch at once: students are created or updated, and their marks are saved as results.</p>
      </header>

      {/* Step 1 */}
      <section className="import-results__card">
        <span className="import-results__step">1</span>
        <div>
          <h2>Download the template</h2>
          <p>
            One row per student. Rename the <b>Subject</b> columns to your real subjects, with maximum / pass marks in brackets —
            e.g. <code>Food Production (100/35)</code>. The second sheet in the file explains every column.
          </p>
          <button type="button" className="import-results__btn import-results__btn--ghost" onClick={downloadTemplate}>
            ⬇ Download Excel template
          </button>
        </div>
      </section>

      {/* Step 2 */}
      <section className="import-results__card">
        <span className="import-results__step">2</span>
        <div className="import-results__grow">
          <h2>Upload the filled file</h2>
          <label className="import-results__drop">
            <input type="file" accept=".xlsx,.xls,.csv" onChange={(e) => onFile(e.target.files?.[0])} disabled={busy} />
            <span>{fileName ? `📄 ${fileName} — choose another file` : 'Choose an .xlsx, .xls or .csv file'}</span>
          </label>

          {busy && <p className="import-results__muted">Working…</p>}
          {error && <p className="import-results__error">{error}</p>}
          {sheet?.warnings.map((w) => (
            <p key={w} className="import-results__warn">
              ⚠ {w}
            </p>
          ))}
        </div>
      </section>

      {/* Step 3: preview */}
      {sheet && check && (
        <section className="import-results__card import-results__card--wide">
          <span className="import-results__step">3</span>
          <div className="import-results__grow">
            <h2>{done ? 'Import finished' : 'Check and import'}</h2>
            <p className="import-results__summary">
              {(done || check).summary.created > 0 && <span className="ok">{(done || check).summary.created} new</span>}
              {(done || check).summary.updated > 0 && <span className="ok">{(done || check).summary.updated} replace an existing result</span>}
              {(done || check).summary.errors > 0 && <span className="bad">{(done || check).summary.errors} with problems (skipped)</span>}
              <span>Subjects: {sheet.subjects.join(', ')}</span>
            </p>

            <div className="import-results__table-wrap">
              <table className="import-results__table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Reg No</th>
                    <th>Name</th>
                    <th>Examination</th>
                    <th>Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sheet.rows.map((r) => {
                    const o = outcomeFor(r.row)
                    const total = r.subjects.reduce((s, x) => s + (Number.isFinite(x.marksObtained) ? x.marksObtained : 0), 0)
                    const max = r.subjects.reduce((s, x) => s + x.maxMarks, 0)
                    return (
                      <tr key={r.row} className={o?.status === 'error' ? 'is-error' : ''}>
                        <td>{r.row}</td>
                        <td>{o?.regNo || r.regNo}</td>
                        <td>{r.name || '—'}</td>
                        <td>{r.examName || '—'}</td>
                        <td>
                          {total} / {max}
                        </td>
                        <td>{o ? (o.status === 'error' ? `✖ ${o.message}` : `✔ ${o.message}`) : ''}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {!done ? (
              <div className="import-results__actions">
                <label className="import-results__check">
                  <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
                  Publish now — students can see these results immediately
                </label>
                <label className="import-results__date">
                  Result date
                  <input type="date" value={declaredOn} onChange={(e) => setDeclaredOn(e.target.value)} />
                </label>
                <button type="button" className="import-results__btn" disabled={busy || okRows === 0} onClick={onImport}>
                  {busy ? 'Importing…' : `Import ${okRows} result${okRows === 1 ? '' : 's'}`}
                </button>
                {check.summary.errors > 0 && (
                  <p className="import-results__muted">Rows with problems are skipped. Fix them in Excel and upload again — that is safe.</p>
                )}
              </div>
            ) : (
              <div className="import-results__actions">
                <a className="import-results__btn" href="/admin/collections/results/">
                  View results
                </a>
                <button type="button" className="import-results__btn import-results__btn--ghost" onClick={reset}>
                  Import another file
                </button>
                {!publish && (
                  <p className="import-results__muted">
                    Saved as <b>not published</b>. To publish later, open Results, select them and use “Edit” → Published.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
