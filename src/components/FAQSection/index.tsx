import { ChevronDown } from 'lucide-react'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { Section, SectionHeader } from '@/components/Section'
import type { Faq } from '@/seo/faqs'
import { faqSchema } from '@/seo/schema'

/**
 * Visible FAQ accordion + matching FAQPage schema. Uses native <details> so every answer is in the HTML
 * (readable by search engines, AI crawlers and screen readers) without JavaScript.
 */
export const FAQSection: React.FC<{ heading: string; items: Faq[]; background?: 'white' | 'muted' }> = ({
  heading,
  items,
  background = 'white',
}) => (
  <Section background={background}>
    <JsonLd data={faqSchema(items)} />
    <SectionHeader eyebrow="FAQ" heading={heading} />
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((f, i) => (
        <details
          key={f.q}
          open={i === 0}
          className="group rounded-2xl border border-border bg-white shadow-[0_8px_24px_-20px_rgba(8,18,55,0.35)] open:border-primary/30 open:shadow-[0_16px_40px_-24px_rgba(38,57,174,0.4)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-base font-semibold text-navy md:px-6 md:text-lg [&::-webkit-details-marker]:hidden">
            <h3 className="m-0 text-[inherit] font-[inherit]">{f.q}</h3>
            <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="px-5 pb-5 leading-relaxed text-muted-foreground md:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  </Section>
)
