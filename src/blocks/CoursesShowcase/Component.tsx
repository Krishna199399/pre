import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Course, CoursesShowcaseBlock as Props } from '@/payload-types'

import { CourseCard } from '@/components/CourseCard'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeader } from '@/components/Section'

export const CoursesShowcaseBlock: React.FC<Props> = async ({
  eyebrow,
  heading,
  intro,
  courses: selected,
  style,
  background,
}) => {
  let courses: Course[] = (selected || []).filter((c): c is Course => typeof c === 'object')

  if (courses.length === 0) {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({ collection: 'courses', depth: 1, limit: 12, sort: 'order' })
    courses = res.docs
  }

  return (
    <Section background={background}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={background === 'navy'} />
      <div className="grid gap-8 md:grid-cols-2">
        {courses.map((course, i) => (
          <Reveal key={course.id} delay={i * 100}>
            <CourseCard course={course} detailed={style === 'detailed'} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
