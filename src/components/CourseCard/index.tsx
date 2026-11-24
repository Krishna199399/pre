import { ArrowRight, Check, Flame, Hotel } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Course } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { docPath } from '@/utilities/docPath'

export const categoryMeta = {
  'hotel-tourism': { label: 'Hotel & Tourism', Icon: Hotel, tone: 'bg-primary' },
  'fire-safety': { label: 'Fire & Industrial Safety', Icon: Flame, tone: 'bg-accent' },
} as const

export const CourseCard: React.FC<{ course: Course; detailed?: boolean }> = ({ course, detailed }) => {
  const meta = categoryMeta[course.category] ?? categoryMeta['hotel-tourism']
  const href = docPath('courses', course.slug)

  return (
    <article className="glow-card group relative h-full rounded-[2rem]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-white shadow-[0_10px_40px_-20px_rgba(8,18,55,0.25)] transition duration-300 group-hover:-translate-y-1.5 group-hover:border-transparent group-hover:shadow-[0_35px_70px_-30px_rgba(38,57,174,0.5)]">
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary short:aspect-[2/1]">
        {course.image && typeof course.image === 'object' ? (
          <Media
            resource={course.image}
            fill
            /* Photos have faces + printed titles at the top: crop from the bottom only */
            imgClassName="object-cover object-top transition duration-700 group-hover:scale-105"
            size="(min-width: 1024px) 50vw, 100vw"
          />
        ) : (
          <div className="bg-brand-gradient absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
        <span
          className={cn(
            'absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white',
            meta.tone,
          )}
        >
          <meta.Icon className="size-3.5" aria-hidden /> {meta.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-8 short:p-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">{course.shortTitle}</p>
        <h3 className="mt-2 font-heading text-xl font-bold text-navy md:text-2xl">
          <Link href={href} className="after:absolute after:inset-0">
            {course.title}
          </Link>
        </h3>
        {(detailed || !course.highlights?.length) && course.summary && (
          <p className="mt-3 text-muted-foreground">{course.summary}</p>
        )}
        {course.highlights && course.highlights.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {course.highlights.map((h, i) => (
              <li key={i} className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                <Check className="size-3.5 text-primary" aria-hidden />
                {h.text}
              </li>
            ))}
          </ul>
        )}
        {detailed && course.eligibility && (
          <p className="mt-5 rounded-xl bg-card px-4 py-3 text-sm">
            <span className="font-semibold text-navy">Eligibility: </span>
            {course.eligibility}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 short:pt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            Explore Course <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </span>
          {course.duration && <span className="text-sm text-muted-foreground">{course.duration} diploma</span>}
        </div>
      </div>
      </div>
    </article>
  )
}
