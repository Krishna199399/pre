import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Recruiter, RecruitersBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { Section, SectionHeader } from '@/components/Section'
import { cn } from '@/utilities/ui'

const Marquee: React.FC<{ items: Recruiter[]; reverse?: boolean; label?: string }> = ({
  items,
  reverse,
  label,
}) => {
  if (!items.length) return null
  // Duplicate the list so the CSS animation loops seamlessly.
  const loop = [...items, ...items]
  return (
    <div className="mt-8 first:mt-0">
      {label && (
        <p className="mb-4 text-center text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </p>
      )}
      <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul
          className={cn(
            'flex w-max gap-5 group-hover:[animation-play-state:paused]',
            reverse ? 'animate-[marquee_60s_linear_infinite_reverse]' : 'animate-[marquee_60s_linear_infinite]',
          )}
        >
          {loop.map((r, i) => (
            <li
              key={`${r.id}-${i}`}
              aria-hidden={i >= items.length}
              className="flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-border bg-white p-3 shadow-sm md:h-28 md:w-48"
            >
              <Media
                resource={r.logo}
                alt={r.name}
                className="relative size-full"
                imgClassName="size-full object-contain"
                size="200px"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export const RecruitersBlockComponent: React.FC<Props> = async ({
  eyebrow,
  heading,
  intro,
  rows,
  background,
}) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'recruiters', depth: 1, limit: 300, sort: 'order' })

  return (
    <Section background={background} containerClassName="max-w-none px-0 md:px-0">
      <div className="container">
        <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={background === 'navy'} />
      </div>
      {rows === 'single' ? (
        <Marquee items={docs} />
      ) : (
        <>
          <Marquee items={docs.filter((d) => d.category === 'hotel-tourism')} label="Hotel & Tourism" />
          <Marquee
            items={docs.filter((d) => d.category === 'fire-safety')}
            label="Fire & Industrial Safety"
            reverse
          />
        </>
      )}
    </Section>
  )
}
