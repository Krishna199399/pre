import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Reveal } from '@/components/Reveal'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ links, richText }) => {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <Reveal className="bg-mesh relative isolate overflow-hidden rounded-[2rem] px-6 py-14 text-white shadow-[0_40px_80px_-40px_rgba(8,18,55,0.7)] md:px-16 md:py-20">
          {/* decorative rings */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full border-[40px] border-white/5" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 -left-16 size-80 rounded-full border-[48px] border-accent/15" aria-hidden />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              {richText && (
                <RichText
                  className="mb-0 prose-invert prose-headings:font-heading prose-headings:text-white prose-p:text-white/80"
                  data={richText}
                  enableGutter={false}
                />
              )}
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              {(links || []).map(({ link }, i) => (
                <CMSLink
                  key={i}
                  size="lg"
                  {...link}
                  className={
                    link.appearance === 'outline'
                      ? 'h-12 rounded-full border-white/25 bg-white/10 px-8 text-white backdrop-blur-xl hover:bg-white/20 hover:text-white'
                      : 'btn-shine bg-gradient-accent h-12 rounded-full px-8 text-white shadow-xl shadow-accent/30 hover:opacity-95'
                  }
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
