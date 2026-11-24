import type { Payload, TypedUser } from 'payload'

import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  FilePlus2,
  FileSpreadsheet,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import React from 'react'

import type { Student } from '@/payload-types'

import './index.scss'

const c = 'pd' // "prestige dashboard"

const greeting = () => {
  const hour = Number(new Intl.DateTimeFormat('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date()))
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
}
const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

/**
 * Home screen of the results-only admin. Payload passes `payload` and `user` to server components,
 * so numbers are read straight from the database.
 */
const BeforeDashboard: React.FC<{ payload?: Payload; user?: TypedUser | null }> = async ({ payload, user }) => {
  if (!payload) return null
  const count = async (collection: 'students' | 'results', where?: Record<string, unknown>) =>
    (await payload.count({ collection, where: where as never, overrideAccess: true })).totalDocs

  const [students, published, waiting, passed] = await Promise.all([
    count('students'),
    count('results', { published: { equals: true } }),
    count('results', { published: { not_equals: true } }),
    count('results', { and: [{ published: { equals: true } }, { result: { equals: 'pass' } }] }),
  ])
  const passRate = published ? Math.round((passed / published) * 100) : null

  const { docs: latest } = await payload.find({
    collection: 'results',
    sort: '-updatedAt',
    limit: 6,
    depth: 1,
    overrideAccess: true,
  })

  const name = (user && 'name' in user && user.name) || (user?.email ? String(user.email).split('@')[0] : '')

  const actions = [
    {
      href: '/admin/import-results/',
      Icon: FileSpreadsheet,
      title: 'Import from Excel',
      text: 'Upload a whole batch — students and marks in one go.',
      primary: true,
    },
    { href: '/admin/collections/results/create/', Icon: FilePlus2, title: 'Enter one result', text: 'Type marks for a single student.' },
    { href: '/admin/collections/students/create/', Icon: UserPlus, title: 'Add a student', text: 'Registration no., name and date of birth.' },
  ]

  const stats = [
    { href: '/admin/collections/students/', Icon: Users, value: students, label: 'Students', tone: 'blue' },
    { href: '/admin/collections/results/?where[published][equals]=true', Icon: BadgeCheck, value: published, label: 'Results published', tone: 'green' },
    { href: '/admin/collections/results/?where[published][not_equals]=true', Icon: Clock3, value: waiting, label: 'Waiting to publish', tone: 'amber' },
    { href: '/admin/collections/results/', Icon: TrendingUp, value: passRate === null ? '—' : `${passRate}%`, label: 'Pass rate (published)', tone: 'violet' },
  ]

  return (
    <div className={c}>
      {/* Greeting */}
      <div className={`${c}__top`}>
        <div>
          <p className={`${c}__eyebrow`}>{fmtDate(new Date())}</p>
          <h1 className={`${c}__title`}>
            {greeting()}
            {name ? `, ${name}` : ''}
          </h1>
          <p className={`${c}__lead`}>Manage students and publish examination results for the Student Portal.</p>
        </div>
        <a className={`${c}__ghost`} href="/student-portal/" target="_blank" rel="noopener noreferrer">
          Open Student Portal <ArrowUpRight size={16} aria-hidden />
        </a>
      </div>

      {/* Quick actions */}
      <div className={`${c}__actions`}>
        {actions.map(({ href, Icon, title, text, primary }) => (
          <a key={href} href={href} className={`${c}__action${primary ? ` ${c}__action--primary` : ''}`}>
            <span className={`${c}__action-icon`}>
              <Icon size={22} aria-hidden />
            </span>
            <span className={`${c}__action-body`}>
              <b>{title}</b>
              <span>{text}</span>
            </span>
            <ArrowUpRight className={`${c}__action-arrow`} size={18} aria-hidden />
          </a>
        ))}
      </div>

      {/* Numbers */}
      <div className={`${c}__stats`}>
        {stats.map(({ href, Icon, value, label, tone }) => (
          <a key={label} href={href} className={`${c}__stat`}>
            <span className={`${c}__stat-icon ${c}__tone--${tone}`}>
              <Icon size={20} aria-hidden />
            </span>
            <span>
              <b>{value}</b>
              <span>{label}</span>
            </span>
          </a>
        ))}
      </div>

      <div className={`${c}__grid`}>
        {/* Recent results */}
        <section className={`${c}__panel`}>
          <header className={`${c}__panel-head`}>
            <h2>Recent results</h2>
            <a href="/admin/collections/results/">View all</a>
          </header>
          {latest.length ? (
            <div className={`${c}__table-wrap`}>
              <table className={`${c}__table`}>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Examination</th>
                    <th className="num">Score</th>
                    <th>Result</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latest.map((r) => {
                    const s = typeof r.student === 'object' ? (r.student as Student) : null
                    return (
                      <tr key={r.id}>
                        <td>
                          <a href={`/admin/collections/results/${r.id}/`}>
                            <b>{s?.name || '—'}</b>
                            <span>{s?.regNo}</span>
                          </a>
                        </td>
                        <td>{r.examName}</td>
                        <td className="num">
                          <b>{(r.percentage ?? 0).toFixed(1)}%</b>
                          <span>{r.grade && r.grade !== '—' ? r.grade : ''}</span>
                        </td>
                        <td>
                          <span className={`${c}__badge ${r.result === 'fail' ? `${c}__badge--red` : `${c}__badge--green`}`}>
                            {r.result === 'fail' ? 'Fail' : 'Pass'}
                          </span>
                        </td>
                        <td>
                          <span className={`${c}__badge ${r.published ? `${c}__badge--blue` : `${c}__badge--amber`}`}>
                            {r.published ? 'Published' : 'Not published'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`${c}__empty`}>No results yet. Start with “Import from Excel”.</p>
          )}
        </section>

        {/* How it works */}
        <aside className={`${c}__panel ${c}__guide`}>
          <h2>How it works</h2>
          <ol>
            <li>
              <b>Add results</b>
              <span>Import the batch from Excel, or enter one result at a time.</span>
            </li>
            <li>
              <b>Check &amp; publish</b>
              <span>Results stay hidden until “Published” is ticked.</span>
            </li>
            <li>
              <b>Students log in</b>
              <span>
                On the website’s Student Portal with their Registration No. (e.g. <code>DFISM111</code>) and date of birth
                (DD/MM/YYYY).
              </span>
            </li>
          </ol>
        </aside>
      </div>
    </div>
  )
}

export default BeforeDashboard
