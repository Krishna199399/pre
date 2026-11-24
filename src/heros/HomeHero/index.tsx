import { ArrowRight, CheckCircle2 } from 'lucide-react'
import React from 'react'

import type { Media as MediaType, Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { HeroSlideshow } from './Slideshow.client'

/** Splits the heading so the last word can be highlighted with a gradient. */
const splitLastWord = (text: string) => {
  const words = text.trim().split(' ')
  if (words.length < 2) return [text, '']
  return [words.slice(0, -1).join(' '), words[words.length - 1]]
}

/**
 * Full-width home hero with a background photo slideshow (like the original site),
 * text on the left and slide indicators along the bottom.
 */
export const HomeHero: React.FC<Page['hero'] & { title?: string }> = ({
  eyebrow,
  heading,
  text,
  links,
  highlights,
  slides,
  media,
  title,
}) => {
  const [lead, last] = splitLastWord(heading || title || '')
  const photos = ((slides && slides.length ? slides : [media]) || []).filter(
    (m): m is MediaType => !!m && typeof m === 'object',
  )

  return (
    <section className="relative isolate flex min-h-[calc(100svh-7.5rem)] flex-col overflow-hidden bg-navy text-white">
      {/* Readability overlays: dark on the left (text side), soft at the bottom (slide indicators) */}
      <div
        className="absolute inset-0 -z-10 max-lg:bg-navy/75 lg:bg-[linear-gradient(90deg,rgba(8,18,55,0.88)_0%,rgba(8,18,55,0.6)_32%,rgba(8,18,55,0.08)_58%,rgba(8,18,55,0)_100%)]"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-t from-navy/70 to-transparent" aria-hidden />

      <div className="container flex flex-1 items-center py-14 md:py-20 lg:py-12 short:py-8">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          {eyebrow && (
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {eyebrow}
            </span>
          )}

          <h1 className="heading-xl mt-6 font-heading font-bold tracking-tight short:mt-5">
            {lead} {last && <span className="text-gradient-warm">{last}</span>}
          </h1>

          {text && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg short:mt-4 short:text-base">
              {text}
            </p>
          )}

          {links && links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 short:mt-7">
              {links.map(({ link }, i) =>
                link.appearance === 'outline' ? (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className="h-12 rounded-full border-white/25 bg-white/10 px-7 text-base text-white backdrop-blur-xl hover:bg-white/20 hover:text-white"
                  />
                ) : (
                  <CMSLink
                    key={i}
                    size="lg"
                    {...link}
                    className="btn-shine bg-gradient-accent h-12 rounded-full px-7 text-base text-white shadow-xl shadow-accent/30 hover:opacity-95"
                  >
                    <ArrowRight className="size-5" aria-hidden />
                  </CMSLink>
                ),
              )}
            </div>
          )}

          {highlights && highlights.length > 0 && (
            <ul className="mt-9 grid max-w-xl gap-x-6 gap-y-3 sm:grid-cols-2 short:hidden">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-white/90 xl:text-base short:text-sm">
                  <CheckCircle2 className="size-5 shrink-0 text-[#ff8a6b]" aria-hidden />
                  {h.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom strip. The slideshow's photo layer fills the whole hero (nothing in between is positioned);
          its indicators render here, bottom-left. */}
      <div className="container flex items-end pb-8 short:pb-6">
        {photos.length > 0 && (
          <HeroSlideshow
            labels={photos.map((p) => p.alt || '')}
            slides={photos.map((p, i) => (
              <Media
                key={p.id}
                resource={p}
                fill
                priority={i === 0}
                loading={i === 0 ? 'eager' : 'lazy'}
                imgClassName="object-cover object-[70%_center]"
                size="100vw"
              />
            ))}
          />
        )}
      </div>
    </section>
  )
}
