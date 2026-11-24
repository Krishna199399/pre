import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { Award, BookOpenCheck, Briefcase, CheckCircle2, Clock, GraduationCap, MonitorPlay, Users } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import { CourseCard, categoryMeta } from '@/components/CourseCard'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { PageBanner } from '@/heros/PageBanner'
import { generateMeta } from '@/utilities/generateMeta'
import { docPath } from '@/utilities/docPath'
import { JsonLd } from '@/components/JsonLd'
import { FAQSection } from '@/components/FAQSection'
import { FAQS } from '@/seo/faqs'
import { courseSchema } from '@/seo/schema'
import { PAGE_SEO } from '@/seo/site'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'courses', limit: 100, pagination: false, select: { slug: true } })
  return docs.filter((d) => d.slug).map((d) => ({ slug: d.slug as string }))
}

type Args = { params: Promise<{ slug: string }> }

const getCourse = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] || null
})

export default async function CoursePage({ params }: Args) {
  const { slug } = await params
  const course = await getCourse(decodeURIComponent(slug))
  if (!course) notFound()

  const payload = await getPayload({ config: configPromise })
  const others = await payload.find({
    collection: 'courses',
    where: { id: { not_equals: course.id } },
    limit: 2,
    depth: 1,
  })

  const meta = categoryMeta[course.category] ?? categoryMeta['hotel-tourism']
  const facts = [
    { Icon: Clock, label: 'Duration', value: course.duration },
    { Icon: GraduationCap, label: 'Eligibility', value: course.eligibility },
    { Icon: MonitorPlay, label: 'Mode of study', value: course.mode },
    { Icon: Award, label: 'Certification', value: course.certification },
  ].filter((f) => f.value)

  // Course + FAQ structured data (src/seo) so search and AI answer engines understand the programme
  const seoKey = `course:${course.slug}`
  const faq = FAQS[seoKey]

  return (
    <article>
      <JsonLd data={courseSchema(course, PAGE_SEO[seoKey]?.keywords)} />
      <PageBanner
        title={course.title}
        eyebrow={meta.label}
        text={course.summary}
        media={course.image}
        breadcrumbs={[{ label: 'Courses', href: '/courses/' }]}
        path={docPath('courses', course.slug)}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/apply-online/"
            className="inline-flex h-12 items-center rounded-full bg-accent px-7 font-semibold text-white shadow-lg shadow-accent/30 hover:bg-accent/90"
          >
            Apply Now
          </Link>
          <Link
            href="/contact-us/"
            className="inline-flex h-12 items-center rounded-full border border-white/40 px-7 font-semibold text-white hover:bg-white/10"
          >
            Talk to a Counsellor
          </Link>
        </div>
      </PageBanner>

      {/* Key facts */}
      <section className="relative z-10 mt-6 md:mt-8">
        <div className="container">
          <dl className="grid gap-4 rounded-3xl border border-border bg-white p-6 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{label}</dt>
                  <dd className="mt-0.5 font-medium text-navy">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {course.description && (
              <Reveal>
                <h2 className="section-title">About the course</h2>
                <RichText
                  data={course.description}
                  enableGutter={false}
                  className="mt-6 max-w-none text-lg text-muted-foreground prose-headings:text-navy"
                />
              </Reveal>
            )}

            {course.whyChoose && course.whyChoose.length > 0 && (
              <Reveal className="mt-14">
                <h2 className="section-title">Why choose this course?</h2>
                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                  {course.whyChoose.map((w, i) => (
                    <li key={i} className="rounded-2xl border border-border bg-card p-5">
                      <h3 className="flex items-start gap-2.5 font-heading font-semibold text-navy">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                        {w.title}
                      </h3>
                      {w.description && <p className="mt-2 pl-7.5 text-sm leading-relaxed text-muted-foreground">{w.description}</p>}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {course.conclusion && (
              <Reveal className="mt-12 rounded-3xl border-l-4 border-primary bg-secondary p-6 md:p-8">
                <p className="text-lg leading-relaxed text-navy">{course.conclusion}</p>
              </Reveal>
            )}
          </div>

          <aside className="space-y-6">
            {course.whoShouldEnroll && (
              <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy">
                  <Users className="size-5 text-primary" aria-hidden /> Who should enroll?
                </h2>
                <p className="mt-3 text-muted-foreground">{course.whoShouldEnroll}</p>
              </div>
            )}
            {course.careerOpportunities && course.careerOpportunities.length > 0 && (
              <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy">
                  <Briefcase className="size-5 text-primary" aria-hidden /> Career opportunities
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {course.careerOpportunities.map((c, i) => (
                    <li key={i} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                      {c.role}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-brand-gradient rounded-3xl p-6 text-white">
              <BookOpenCheck className="size-8 text-accent" aria-hidden />
              <h2 className="mt-3 font-heading text-xl font-semibold">Admissions open for 2026-27</h2>
              <p className="mt-2 text-white/80">Limited seats. Visit the campus or apply online today.</p>
              <Link
                href="/apply-online/"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-6 font-semibold text-primary hover:bg-white/90"
              >
                Apply Online
              </Link>
            </div>
            {course.image && typeof course.image === 'object' && (
              <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
                <Media resource={course.image} fill imgClassName="object-cover" size="33vw" />
              </div>
            )}
          </aside>
        </div>
      </section>

      {faq && <FAQSection heading={faq.heading} items={faq.items} />}

      {others.docs.length > 0 && (
        <section className="section bg-card">
          <div className="container">
            <h2 className="section-title mb-10 text-center">Explore our other programme</h2>
            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
              {others.docs.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(decodeURIComponent(slug))
  return generateMeta({ doc: course, collection: 'courses' })
}
