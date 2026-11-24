import React from 'react'

import { cn } from '@/utilities/ui'
import { Reveal } from '@/components/Reveal'

export type SectionBackground = 'white' | 'muted' | 'navy' | null | undefined

const bgClass: Record<string, string> = {
  white: 'bg-background',
  muted: 'bg-card',
  navy: 'bg-mesh text-white',
}

export const Section: React.FC<{
  background?: SectionBackground
  className?: string
  containerClassName?: string
  children: React.ReactNode
  id?: string
}> = ({ background, className, containerClassName, children, id }) => (
  <section id={id} className={cn('section relative isolate overflow-hidden', bgClass[background || 'white'], className)}>
    <div className={cn('container', containerClassName)}>{children}</div>
  </section>
)

/**
 * Heading with the last word in a gradient: "Why Choose *Us?*".
 * Wrap words in *asterisks* in the admin to choose which part is highlighted.
 */
export const HighlightedHeading: React.FC<{ text: string; dark?: boolean }> = ({ text, dark }) => {
  const cls = dark ? 'text-gradient-warm' : 'text-gradient'
  if (text.includes('*')) {
    return (
      <>
        {text.split(/(\*[^*]+\*)/g).map((part, i) =>
          part.startsWith('*') && part.endsWith('*') ? (
            <span key={i} className={cls}>
              {part.slice(1, -1)}
            </span>
          ) : (
            <React.Fragment key={i}>{part}</React.Fragment>
          ),
        )}
      </>
    )
  }
  const words = text.trim().split(' ')
  if (words.length < 2) return <>{text}</>
  return (
    <>
      {words.slice(0, -1).join(' ')} <span className={cls}>{words[words.length - 1]}</span>
    </>
  )
}

export const SectionHeader: React.FC<{
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  align?: 'center' | 'left'
  dark?: boolean
  className?: string
}> = ({ eyebrow, heading, intro, align = 'center', dark, className }) => {
  if (!eyebrow && !heading && !intro) return null
  return (
    <Reveal
      className={cn(
        'mb-10 max-w-3xl md:mb-12 short:mb-9',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase',
            dark ? 'text-[#ff8a6b]' : 'text-accent',
          )}
        >
          <span className={cn('h-px w-8', dark ? 'bg-[#ff8a6b]' : 'bg-accent')} aria-hidden />
          {eyebrow}
          {align === 'center' && <span className={cn('h-px w-8', dark ? 'bg-[#ff8a6b]' : 'bg-accent')} aria-hidden />}
        </span>
      )}
      {heading && (
        <h2
          className={cn(
            'heading-lg font-heading font-bold tracking-tight',
            eyebrow && 'mt-4',
            dark ? 'text-white' : 'text-navy',
          )}
        >
          <HighlightedHeading text={heading} dark={dark} />
        </h2>
      )}
      {intro && <p className={cn('mt-4 text-base leading-relaxed md:text-lg short:text-base', dark ? 'text-white/70' : 'text-muted-foreground')}>{intro}</p>}
    </Reveal>
  )
}
