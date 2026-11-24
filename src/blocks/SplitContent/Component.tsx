import { CheckCircle2 } from 'lucide-react'
import React from 'react'

import type { SplitContentBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import RichText from '@/components/RichText'
import { HighlightedHeading, Section } from '@/components/Section'
import { cn } from '@/utilities/ui'

export const SplitContentBlock: React.FC<Props> = ({
  eyebrow,
  heading,
  content,
  checklist,
  image,
  imagePosition = 'left',
  imageStyle = 'landscape',
  background,
  signature,
  links,
}) => {
  const dark = background === 'navy'
  const hasImage = image && typeof image === 'object'

  return (
    <Section background={background}>
      <div
        className={cn(
          'grid items-center gap-10 lg:gap-16',
          hasImage && 'lg:grid-cols-2',
        )}
      >
        {hasImage && (
          <Reveal className={cn('relative', imagePosition === 'right' && 'lg:order-2')}>
            {imageStyle !== 'contain' && (
              <div
                className={cn(
                  'bg-gradient-primary absolute -z-10 rounded-[2.25rem] opacity-90',
                  imageStyle === 'portrait' ? 'inset-x-6 -inset-y-4 mx-auto max-w-md rotate-3' : '-inset-3 rotate-2',
                )}
                aria-hidden
              />
            )}
            <div
              className={cn(
                'relative mx-auto overflow-hidden',
                imageStyle === 'contain'
                  ? 'aspect-[4/3]'
                  : 'rounded-[2rem] border-4 border-white shadow-[0_30px_60px_-30px_rgba(8,18,55,0.45)]',
                imageStyle === 'portrait' ? 'aspect-[4/5] max-w-md short:max-w-sm' : 'aspect-[4/3]',
              )}
            >
              <Media
                resource={image}
                fill
                imgClassName={imageStyle === 'contain' ? 'object-contain' : 'object-cover'}
                size="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={100} className={cn(!hasImage && 'mx-auto max-w-3xl')}>
          {eyebrow && (
            <span className={cn('inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase', dark ? 'text-[#ff8a6b]' : 'text-accent')}>
              <span className={cn('h-px w-8', dark ? 'bg-[#ff8a6b]' : 'bg-accent')} aria-hidden />
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className={cn('heading-lg font-heading font-bold tracking-tight', eyebrow && 'mt-4', dark ? 'text-white' : 'text-navy')}>
              <HighlightedHeading text={heading} dark={dark} />
            </h2>
          )}
          {content && (
            <RichText
              data={content}
              enableGutter={false}
              className={cn(
                'mt-5 max-w-none text-base md:text-lg short:text-base',
                dark ? 'prose-invert text-white/80' : 'text-muted-foreground prose-headings:text-navy prose-strong:text-navy',
              )}
            />
          )}
          {checklist && checklist.length > 0 && (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {checklist.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className={cn('mt-0.5 size-5 shrink-0', dark ? 'text-white' : 'text-primary')} aria-hidden />
                  <span className={dark ? 'text-white/85' : 'text-foreground'}>{c.text}</span>
                </li>
              ))}
            </ul>
          )}
          {signature && (
            <p className={cn('mt-8 border-l-4 border-accent pl-4 font-heading font-semibold', dark ? 'text-white' : 'text-navy')}>
              {signature}
            </p>
          )}
          {links && links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {links.map(({ link }, i) => (
                <CMSLink
                  key={i}
                  size="lg"
                  {...link}
                  className={
                    link.appearance === 'outline'
                      ? 'h-12 rounded-full border-primary/20 px-7 hover:border-primary hover:bg-secondary'
                      : 'btn-shine bg-gradient-primary h-12 rounded-full px-7 shadow-lg shadow-primary/30'
                  }
                />
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
