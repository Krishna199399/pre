'use client'

import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, LogIn, Printer, ShieldCheck } from 'lucide-react'
import React, { useActionState, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDobInput } from '@/utilities/studentLogin'
import { cn } from '@/utilities/ui'

import { lookupResult, type PortalState } from './actions'

const fmt = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : ''

export const StudentPortal: React.FC<{ siteName: string; address?: string | null }> = ({ siteName, address }) => {
  const [state, formAction, pending] = useActionState<PortalState, FormData>(lookupResult, { status: 'idle' })

  if (state.status === 'found') {
    const { student, results } = state
    return (
      <div className="mx-auto max-w-4xl">
        <div className="no-print mb-6 flex flex-wrap justify-between gap-3">
          <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
            <ArrowLeft /> Check another result
          </Button>
          <Button className="rounded-full" onClick={() => window.print()}>
            <Printer /> Print / Save as PDF
          </Button>
        </div>

        {results.map((r) => (
          <article
            key={r.id}
            className="mb-8 overflow-hidden rounded-3xl border border-border bg-white shadow-xl print:mb-0 print:break-after-page print:rounded-none print:border-0 print:shadow-none"
          >
            <header className="bg-brand-gradient px-6 py-6 text-center text-white print:bg-none print:text-navy md:px-10">
              <p className="font-heading text-2xl font-bold tracking-wide uppercase">{siteName}</p>
              {address && <p className="mt-1 text-xs text-white/75 print:text-muted-foreground">{address.replace(/\n/g, ', ')}</p>}
              <p className="mt-4 inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-semibold print:border print:border-navy">
                Statement of Marks · {r.examName}
              </p>
            </header>

            <div className="p-6 md:p-10">
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {[
                  ['Student name', student.name],
                  ['Registration No.', student.regNo],
                  ['Course', student.course],
                  ['Batch', student.batch],
                  ["Father's name", student.fatherName],
                  ['Result date', fmt(r.declaredOn)],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-dashed border-border pb-2">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-right font-semibold text-navy">{v}</dd>
                    </div>
                  ))}
              </dl>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[32rem] border-collapse text-sm">
                  <thead>
                    <tr className="bg-secondary text-left text-navy">
                      <th className="rounded-l-lg px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Subject</th>
                      <th className="px-4 py-3 text-right font-semibold">Max</th>
                      <th className="px-4 py-3 text-right font-semibold">Min</th>
                      <th className="rounded-r-lg px-4 py-3 text-right font-semibold">Obtained</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.subjects.map((s, i) => {
                      const failed = s.passMarks != null && s.marksObtained < s.passMarks
                      return (
                        <tr key={i} className="border-b border-border">
                          <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-3 font-medium">{s.subject}</td>
                          <td className="px-4 py-3 text-right">{s.maxMarks}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{s.passMarks ?? '—'}</td>
                          <td className={cn('px-4 py-3 text-right font-semibold', failed ? 'text-destructive' : 'text-navy')}>
                            {s.marksObtained}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold text-navy">
                      <td colSpan={2} className="px-4 py-3">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right">{r.maxTotal}</td>
                      <td />
                      <td className="px-4 py-3 text-right">{r.total}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-card p-4 text-center">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Percentage</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-navy">{r.percentage.toFixed(2)}%</p>
                </div>
                <div className="rounded-2xl bg-card p-4 text-center">
                  <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Grade</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-navy">{r.grade || '—'}</p>
                </div>
                <div
                  className={cn(
                    'rounded-2xl p-4 text-center',
                    r.result === 'fail' ? 'bg-error text-destructive' : 'bg-success text-green-800',
                  )}
                >
                  <p className="text-xs font-semibold tracking-wider uppercase opacity-75">Result</p>
                  <p className="mt-1 font-heading text-2xl font-bold">{r.result === 'fail' ? 'FAIL' : 'PASS'}</p>
                </div>
              </div>

              {r.remarks && <p className="mt-6 rounded-xl border border-border p-4 text-sm">{r.remarks}</p>}

              <p className="mt-8 text-center text-xs text-muted-foreground">
                This is a computer-generated statement for information. The original marks card issued by the institute is
                the official document.
              </p>
            </div>
          </article>
        ))}
      </div>
    )
  }

  // React clears forms after a server action; keep what the student typed when there's an error.
  const values = state.status === 'error' ? state.values : undefined

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
      <div>
        <span className="eyebrow">
          <ShieldCheck className="size-4" aria-hidden /> Secure result lookup
        </span>
        <h2 className="section-title mt-4">Check your examination result</h2>
        <p className="section-lead">
          Log in with your Registration Number and your date of birth as the password. Your marks statement will appear
          on this page and can be printed or saved as a PDF.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>• Registration No. is printed on your ID card and fee receipt.</li>
          <li>• Results appear here only after the institute publishes them.</li>
          <li>• Problems? Contact the office with your Registration No.</li>
        </ul>
      </div>

      <form
        key={values ? `${values.regNo}|${values.dob}|${state.status === 'error' ? state.message : ''}` : 'blank'}
        action={formAction}
        autoComplete="off"
        className="rounded-3xl border border-border bg-white p-6 shadow-[0_20px_60px_-30px_rgba(38,57,174,0.35)] md:p-10"
      >
        <p className="font-heading text-2xl font-bold text-navy md:text-3xl">Welcome back</p>
        <p className="mt-1 text-muted-foreground">Log in to view your examination result</p>

        <div className="mt-7">
          <Label htmlFor="regNo" className="text-base font-semibold text-navy">
            Registration Number <span className="text-destructive">*</span>
          </Label>
          <Hint id="regNo-hint">
            <span>
              Example: PRE/DWD/<b className="text-primary">DFISM</b>/25-26/<b className="text-primary">111</b>
            </span>
            <span>
              Enter only: <b className="text-primary">DFISM111</b>
            </span>
          </Hint>
          <Input
            id="regNo"
            name="regNo"
            required
            autoComplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-form-type="other"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="Enter Registration Number"
            aria-describedby="regNo-hint"
            defaultValue={values?.regNo}
            className="h-12 rounded-2xl px-4 text-base uppercase placeholder:normal-case"
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="dob" className="text-base font-semibold text-navy">
            Password <span className="text-destructive">*</span>
          </Label>
          <Hint id="dob-hint">
            <span>Format: DD/MM/YYYY (date of birth)</span>
            <span>
              Example: <b className="text-primary">10/10/2000</b>
            </span>
          </Hint>
          <PasswordDob defaultValue={values?.dob} />
        </div>

        {state.status === 'error' && (
          <p className="mt-5 flex gap-2 rounded-xl bg-error px-4 py-3 text-sm text-destructive" role="alert">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {state.message}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="bg-gradient-primary mt-7 h-12 w-full rounded-2xl text-base shadow-lg shadow-primary/30 hover:opacity-95"
        >
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <LogIn aria-hidden />}
          {pending ? 'Checking…' : 'Login to Portal'}
        </Button>
      </form>
    </div>
  )
}

/** Small example strip shown between a label and its input. */
const Hint: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <p
    id={id}
    className="mt-2 mb-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border-l-4 border-primary bg-secondary px-4 py-2.5 text-xs text-muted-foreground sm:text-[13px]"
  >
    {children}
  </p>
)

/**
 * Date-of-birth password: slashes are added while typing (10102000 → 10/10/2000), with a show/hide toggle.
 * It is a masked text field (not type="password") so browsers don't autofill saved logins — e.g. the admin login — into it.
 */
const PasswordDob: React.FC<{ defaultValue?: string }> = ({ defaultValue }) => {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        id="dob"
        name="dob"
        type="text"
        required
        inputMode="numeric"
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        data-form-type="other"
        maxLength={10}
        placeholder="Enter Password (DD/MM/YYYY)"
        aria-describedby="dob-hint"
        defaultValue={defaultValue}
        onInput={(e) => {
          const el = e.currentTarget
          el.value = formatDobInput(el.value)
        }}
        className={cn('h-12 rounded-2xl px-4 pr-12 text-base', !show && '[-webkit-text-security:disc]')}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
        className="absolute inset-y-0 right-1.5 my-auto inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary hover:text-navy"
      >
        {show ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
      </button>
    </div>
  )
}
