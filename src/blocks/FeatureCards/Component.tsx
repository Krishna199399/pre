import { ArrowUpRight } from 'lucide-react'
import React from 'react'

import type { FeatureCardsBlock as Props } from '@/payload-types'

import { Icon } from '@/components/Icon'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeader } from '@/components/Section'
import { cn } from '@/utilities/ui'

const gridCols: Record<string, string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export const FeatureCardsBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  intro,
  items,
  style = 'cards',
  columns = '3',
  background,
  imageFit,
}) => {
  const dark = background === 'navy'

  return (
    <Section background={background}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={dark} />
      <div className={cn('grid gap-6', gridCols[columns || '3'])}>
        {items?.map((item, i) => {
          const hasImage = item.image && typeof item.image === 'object'
          const link = item.enableLink && item.link ? item.link : null

          /* ── Large cards with image ── */
          if (style === 'cards') {
            return (
              <Reveal key={i} delay={i * 90} as="article" className="glow-card group rounded-[1.75rem]">
                <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white text-foreground shadow-[0_10px_40px_-20px_rgba(8,18,55,0.25)] transition duration-300 group-hover:-translate-y-1.5 group-hover:border-transparent group-hover:shadow-[0_30px_60px_-25px_rgba(38,57,174,0.45)]">
                  {hasImage && (
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        imageFit === 'contain'
                          ? 'mx-5 mt-5 h-36 rounded-2xl bg-gradient-to-br from-secondary via-card to-white short:h-28'
                          : 'aspect-[16/10] bg-secondary',
                      )}
                    >
                      <Media
                        resource={item.image}
                        fill
                        imgClassName={cn(
                          'transition duration-700 group-hover:scale-110',
                          imageFit === 'contain' ? 'object-contain p-5 drop-shadow-xl' : 'object-cover',
                        )}
                        size="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6 xl:p-7 short:p-5">
                    {!hasImage && (
                      <span className="bg-gradient-primary mb-5 inline-flex size-12 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/30">
                        <Icon name={item.icon} className="size-6" />
                      </span>
                    )}
                    <h3 className="font-heading text-xl font-bold text-navy xl:text-2xl short:text-xl">{item.title}</h3>
                    {item.text && <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground xl:text-base short:text-[15px]">{item.text}</p>}
                    {link && (
                      <CMSLink
                        {...link}
                        appearance="inline"
                        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white"
                      >
                        <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden />
                      </CMSLink>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          }

          /* ── Compact cards with icon + number ── */
          if (style === 'icon') {
            return (
              <Reveal key={i} delay={i * 70} as="article" className="glow-card group rounded-3xl">
                <div
                  className={cn(
                    'relative flex h-full gap-5 overflow-hidden rounded-3xl border p-6 transition duration-300 group-hover:-translate-y-1 short:p-5',
                    dark
                      ? 'border-white/10 bg-[#0b1544]/80 group-hover:border-transparent'
                      : 'border-border bg-white shadow-[0_10px_30px_-20px_rgba(8,18,55,0.3)] group-hover:border-transparent group-hover:shadow-[0_25px_50px_-25px_rgba(38,57,174,0.45)]',
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none absolute -top-3 right-4 font-heading text-7xl font-bold select-none',
                      dark ? 'text-white/5' : 'text-primary/[0.06]',
                    )}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative shrink-0">
                    {hasImage ? (
                      <Media
                        resource={item.image}
                        className="relative size-16 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                        imgClassName="size-16 object-contain drop-shadow-lg"
                        size="64px"
                      />
                    ) : (
                      <span className="bg-gradient-primary inline-flex size-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon name={item.icon} className="size-7" />
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <h3 className={cn('font-heading text-lg font-bold', dark ? 'text-white' : 'text-navy')}>
                      {item.title}
                    </h3>
                    {item.text && (
                      <p className={cn('mt-2 text-sm leading-relaxed md:text-[15px]', dark ? 'text-white/70' : 'text-muted-foreground')}>
                        {item.text}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          }

          /* ── Simple list ── */
          return (
            <Reveal key={i} delay={i * 60} className="border-l-4 border-primary/70 pl-5">
              <h3 className={cn('font-heading text-lg font-semibold', dark ? 'text-white' : 'text-navy')}>
                {item.title}
              </h3>
              {item.text && (
                <p className={cn('mt-2 leading-relaxed', dark ? 'text-white/75' : 'text-muted-foreground')}>
                  {item.text}
                </p>
              )}
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
