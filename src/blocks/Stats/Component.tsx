import React from 'react'

import type { StatsBlock as Props } from '@/payload-types'

import { CountUp } from '@/components/CountUp'
import { Reveal } from '@/components/Reveal'
import { cn } from '@/utilities/ui'

export const StatsBlockComponent: React.FC<Props> = ({ items, background }) => {
  const dark = background !== 'white' && background !== 'muted'
  return (
    <section className={cn('relative py-12 md:py-16 short:py-10', dark ? 'bg-mesh isolate overflow-hidden text-white' : background === 'muted' ? 'bg-card' : 'bg-background')}>
      <div className="container">
        <dl
          className={cn(
            'grid grid-cols-2 gap-px overflow-hidden rounded-3xl lg:grid-cols-4',
            dark ? 'border border-white/15 bg-white/10 backdrop-blur-xl' : 'border border-border bg-border shadow-sm',
          )}
        >
          {items?.map((s, i) => (
            <Reveal
              key={i}
              delay={i * 100}
              className={cn('flex flex-col-reverse gap-2 px-4 py-7 text-center md:py-9 short:py-6', dark ? 'bg-[#0b1544]/70' : 'bg-white')}
            >
              <dt className={cn('text-sm font-medium md:text-base', dark ? 'text-white/70' : 'text-muted-foreground')}>
                {s.label}
              </dt>
              <dd className={cn('font-heading text-[clamp(2.1rem,min(4.5vw,7vh),3.75rem)] leading-none font-bold tracking-tight', dark ? 'text-white' : 'text-gradient')}>
                <CountUp value={s.value} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
