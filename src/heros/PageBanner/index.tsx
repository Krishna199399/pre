import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Media as MediaType, Page } from '@/payload-types'

import { Media } from '@/components/Media'
import { HighlightedHeading } from '@/components/Section'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbSchema } from '@/seo/schema'
import { linkHref } from '@/utilities/docPath'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { cn } from '@/utilities/ui'

export type Crumb = { label: string; href?: string }

type Props = Partial<Page['hero']> & {
  title?: string
  breadcrumbs?: Crumb[]
  children?: React.ReactNode
  /** Gradient on the last word of the title (off for long titles like blog posts). */
  highlight?: boolean
  /** Current URL path — used to show the "in this section" quick links. */
  path?: string
}

const isMedia = (m: unknown): m is MediaType => !!m && typeof m === 'object' && 'url' in (m as object)

/** Sibling pages from the header dropdown that contains the current page, e.g. the five "About Us" pages. */
async function sectionLinks(path?: string) {
  if (!path) return []
  const header = await getCachedGlobal('header', 1)()
  const group = header?.navItems?.find((n) => n.subItems?.some((s) => linkHref(s.link) === path))
  return (group?.subItems || [])
    .map((s) => ({ label: s.link.label, href: linkHref(s.link) }))
    .filter((l): l is { label: string; href: string } => !!l.href && !!l.label)
}

/**
 * Inner-page banner: a rounded, inset card (not a full-width strip).
 * - Wide photo  → fills the right side and fades into the card colour.
 * - Tall photo  → shown in a tilted frame with a name tag (e.g. the director).
 * - Collage     → 2–4 pictures in a fanned stack, never cropped (certificates, faculty, posts).
 * - Nothing     → gradient card with soft decorations.
 * Pages that belong to a menu group get quick links to their sibling pages along the bottom.
 */
export async function PageBanner({
  eyebrow,
  heading,
  text,
  media,
  collage,
  title,
  breadcrumbs = [],
  children,
  highlight = true,
  path,
}: Props) {
  const crumbs: Crumb[] = [...breadcrumbs, { label: heading || title || '' }]
  const photo = isMedia(media) ? media : null
  const isPortrait = !!photo?.width && !!photo?.height && photo.height > photo.width * 1.05
  const stack = !photo ? (collage || []).filter(isMedia).slice(0, 4) : []
  const mode: 'photo' | 'portrait' | 'collage' | 'plain' = photo
    ? isPortrait
      ? 'portrait'
      : 'photo'
    : stack.length > 1
      ? 'collage'
      : 'plain'
  const links = await sectionLinks(path)

  return (
    <section className="px-2 pt-2 sm:px-4 sm:pt-4 lg:px-5">
      {/* Breadcrumb trail for search results (Home › Courses › …) */}
      <JsonLd data={breadcrumbSchema(crumbs.map((c, i) => (i === crumbs.length - 1 && path ? { ...c, href: path } : c)))} />
      <div className="bg-mesh relative isolate mx-auto flex max-w-[1680px] flex-col overflow-hidden rounded-[1.5rem] text-white sm:rounded-[2rem] lg:rounded-[2.25rem]">
        {/* Wide photo: right side on desktop, behind the text (darkened) on small screens */}
        {mode === 'photo' && photo && (
          <div
            className="absolute inset-0 -z-10 lg:left-[38%] lg:[mask-image:linear-gradient(90deg,transparent_0%,black_42%)]"
            aria-hidden
          >
            <Media resource={photo} fill priority imgClassName="object-cover object-top" size="(min-width: 1024px) 62vw, 100vw" />
            <div className="absolute inset-0 bg-navy/75 lg:hidden" />
            {links.length > 0 && (
              <div className="absolute inset-x-0 bottom-0 hidden h-1/3 bg-gradient-to-t from-navy/70 to-transparent lg:block" />
            )}
          </div>
        )}

        {/* Soft decorations */}
        <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 size-80 rounded-full bg-accent/25 blur-3xl" aria-hidden />
        {mode !== 'photo' && (
          <div
            className="pointer-events-none absolute -top-24 -right-24 -z-10 size-96 rounded-full border-[64px] border-white/[0.04]"
            aria-hidden
          />
        )}

        <div
          className={cn(
            'container grid flex-1 items-center gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_auto]',
            mode !== 'plain' && 'lg:min-h-[23rem] xl:min-h-[25rem] short:min-h-[20rem]',
            mode === 'plain' && 'lg:py-16',
          )}
        >
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
                <li>
                  <Link href="/" className="inline-flex items-center gap-1 hover:text-white">
                    <Home className="size-4" aria-hidden />
                    <span className="sr-only">Home</span>
                  </Link>
                </li>
                {crumbs.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3.5" aria-hidden />
                    {c.href ? (
                      <Link href={c.href} className="hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="line-clamp-1 text-white">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            {eyebrow && (
              <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
                <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                {eyebrow}
              </span>
            )}
            <h1 className="heading-lg font-heading font-bold tracking-tight lg:text-[clamp(2.25rem,min(4.5vw,7.5vh),3.75rem)]">
              {highlight ? <HighlightedHeading text={heading || title || ''} dark /> : heading || title}
            </h1>
            {text && <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg short:text-base">{text}</p>}
            {children}
          </div>

          {mode === 'portrait' && photo && <PortraitFrame photo={photo} />}
          {mode === 'collage' && <Collage items={stack} />}
        </div>

        {links.length > 0 && (
          <nav aria-label="In this section" className="container pb-5 sm:pb-6">
            <ul className="glass flex w-full gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none] max-sm:[mask-image:linear-gradient(90deg,black_80%,transparent)] sm:w-fit">
              {links.map((l) => {
                const active = l.href === path
                return (
                  <li key={l.href} className="shrink-0">
                    <Link
                      href={l.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-flex h-9 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors',
                        active ? 'bg-white text-navy shadow' : 'text-white/80 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </div>
    </section>
  )
}

/** A person's photo in a tilted frame with a glass name tag built from the alt text ("Name, Role"). */
function PortraitFrame({ photo }: { photo: MediaType }) {
  const [name, ...rest] = (photo.alt || '').split(',')
  const role = rest.join(',').trim()
  return (
    <figure className="relative mr-6 hidden lg:block">
      <div className="bg-gradient-accent absolute inset-0 translate-x-4 translate-y-4 rotate-6 rounded-[2rem] opacity-90" aria-hidden />
      <div className="relative aspect-[4/5] h-[19rem] overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl xl:h-[20rem] short:h-[16rem]">
        <Media resource={photo} fill priority imgClassName="object-cover object-top" size="20rem" />
      </div>
      {name && (
        <figcaption className="glass absolute -bottom-4 -left-10 rounded-2xl px-4 py-2.5 shadow-xl">
          <span className="block font-heading text-sm font-bold">{name.trim()}</span>
          {role && <span className="block text-xs text-white/75">{role}</span>}
        </figcaption>
      )}
    </figure>
  )
}

const tilts = ['-rotate-6 translate-y-3', 'rotate-3 -translate-y-2 z-10', '-rotate-2 translate-y-4', 'rotate-6 -translate-y-1']

/** 2–4 pictures in an overlapping, fanned stack; each keeps its own shape so nothing is cropped. */
function Collage({ items }: { items: MediaType[] }) {
  return (
    <div className="mr-4 hidden items-center lg:flex" aria-hidden>
      {items.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            'relative h-56 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-2xl transition-transform duration-500 hover:z-20 hover:scale-105 xl:h-60 short:h-48',
            i > 0 && '-ml-12',
            tilts[i % tilts.length],
          )}
          style={{ aspectRatio: m.width && m.height ? `${m.width} / ${m.height}` : '3 / 4' }}
        >
          <Media resource={m} fill imgClassName="object-cover" size="16rem" />
        </div>
      ))}
    </div>
  )
}
