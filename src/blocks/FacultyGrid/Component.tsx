import configPromise from '@payload-config'
import { UserRound } from 'lucide-react'
import { getPayload } from 'payload'
import React from 'react'

import type { FacultyGridBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeader } from '@/components/Section'

export const FacultyGridBlock: React.FC<Props> = async ({ eyebrow, heading, intro, background }) => {
  const payload = await getPayload({ config: configPromise })
  const { docs: faculty } = await payload.find({
    collection: 'faculty',
    depth: 1,
    limit: 100,
    sort: 'order',
    where: { visible: { not_equals: false } },
  })

  return (
    <Section background={background}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={background === 'navy'} />
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {faculty.map((f, i) => (
          <Reveal
            key={f.id}
            delay={(i % 4) * 80}
            as="article"
            className="group overflow-hidden rounded-2xl border border-border bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
              {f.photo && typeof f.photo === 'object' ? (
                <Media
                  resource={f.photo}
                  fill
                  imgClassName="object-cover object-top transition duration-500 group-hover:scale-105"
                  size="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-primary/40">
                  <UserRound className="size-20" aria-hidden />
                </div>
              )}
            </div>
            <div className="p-4 md:p-5">
              <h3 className="font-heading text-base font-semibold text-navy md:text-lg">{f.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{f.role}</p>
              {f.qualification && <p className="mt-1 text-xs text-muted-foreground">{f.qualification}</p>}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
