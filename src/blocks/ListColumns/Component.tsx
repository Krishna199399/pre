import { Check, Clock } from 'lucide-react'
import React from 'react'

import type { ListColumnsBlock as Props, Media as MediaType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Reveal } from '@/components/Reveal'
import { Section, SectionHeader } from '@/components/Section'
import { cn } from '@/utilities/ui'

type Column = NonNullable<Props['columns']>[number]

const asMedia = (m: unknown) => (m && typeof m === 'object' ? (m as MediaType) : null)
/** Show a picture in its own shape so posters / photos are never cropped. */
const ratio = (m: MediaType) => (m.width && m.height ? `${m.width} / ${m.height}` : '3 / 2')

export const ListColumnsBlock: React.FC<Props> = ({ eyebrow, heading, intro, columns, style, background }) => {
  const dark = background === 'navy'
  const count = columns?.length || 1
  const single = count === 1 && columns?.[0]

  return (
    <Section background={background}>
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} dark={dark} />

      {/* One column with a picture → split layout (e.g. admission steps as a timeline next to a photo) */}
      {single && asMedia(single.image) ? (
        <SplitColumn col={single} style={style} dark={dark} />
      ) : (
        <div
          className={cn(
            'grid gap-8',
            count === 2 && 'lg:grid-cols-2',
            count === 3 && 'md:grid-cols-2 lg:grid-cols-3',
            count === 1 && 'mx-auto max-w-4xl',
          )}
        >
          {columns?.map((col, ci) => {
            const img = asMedia(col.image)
            return (
              <Reveal
                key={ci}
                delay={ci * 100}
                className={cn(
                  'group flex flex-col overflow-hidden rounded-3xl border transition duration-300',
                  dark
                    ? 'border-white/10 bg-white/5'
                    : 'border-border bg-white shadow-[0_10px_40px_-25px_rgba(8,18,55,0.35)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(38,57,174,0.45)]',
                )}
              >
                {img && (
                  <div className="relative overflow-hidden bg-secondary" style={{ aspectRatio: ratio(img) }}>
                    <Media
                      resource={img}
                      fill
                      imgClassName="object-cover transition duration-700 group-hover:scale-105"
                      size="(min-width: 1024px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  {col.title && (
                    <h3 className={cn('mb-5 font-heading text-xl font-bold md:text-2xl', dark ? 'text-white' : 'text-navy')}>
                      {col.title}
                    </h3>
                  )}
                  <Items col={col} style={style} dark={dark} />
                  <Note note={col.note} dark={dark} />
                  {col.enableLink && col.link && (
                    <div className="mt-auto pt-6">
                      <CMSLink
                        {...col.link}
                        appearance="inline"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90"
                      />
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </Section>
  )
}

const SplitColumn: React.FC<{ col: Column; style: Props['style']; dark: boolean }> = ({ col, style, dark }) => {
  const img = asMedia(col.image)!
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
      <Reveal className="relative lg:sticky lg:top-28">
        <div className="bg-gradient-primary absolute inset-0 translate-x-3 translate-y-3 -rotate-2 rounded-[2rem] opacity-90" aria-hidden />
        <div className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-secondary shadow-2xl" style={{ aspectRatio: ratio(img) }}>
          <Media resource={img} fill imgClassName="object-cover" size="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </Reveal>
      <div>
        {col.title && (
          <h3 className={cn('mb-6 font-heading text-2xl font-bold', dark ? 'text-white' : 'text-navy')}>{col.title}</h3>
        )}
        <Items col={col} style={style} dark={dark} timeline />
        <Note note={col.note} dark={dark} />
        {col.enableLink && col.link && (
          <CMSLink
            {...col.link}
            appearance="inline"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
          />
        )}
      </div>
    </div>
  )
}

const Items: React.FC<{ col: Column; style: Props['style']; dark: boolean; timeline?: boolean }> = ({
  col,
  style,
  dark,
  timeline,
}) => {
  if (style === 'pills') {
    return (
      <ul className="flex flex-wrap gap-2.5">
        {col.items?.map((it, i) => (
          <li
            key={i}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium',
              dark ? 'bg-white/10 text-white' : 'bg-secondary text-secondary-foreground',
            )}
          >
            {it.text}
          </li>
        ))}
      </ul>
    )
  }

  // Numbered steps next to a picture → connected timeline of step cards
  if (style === 'numbered' && timeline) {
    return (
      <ol className="relative space-y-4">
        {col.items?.map((it, i) => (
          <Reveal as="li" key={i} delay={i * 80} className="relative flex gap-5">
            {i < (col.items?.length || 0) - 1 && (
              <span className="absolute top-12 bottom-[-1rem] left-[1.375rem] w-0.5 bg-gradient-to-b from-primary/40 to-primary/10" aria-hidden />
            )}
            <span className="bg-gradient-primary relative inline-flex size-11 shrink-0 items-center justify-center rounded-2xl font-heading text-base font-bold text-white shadow-lg shadow-primary/30">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div
              className={cn(
                'flex-1 rounded-2xl border px-5 py-4',
                dark ? 'border-white/10 bg-white/5' : 'border-border bg-white shadow-[0_8px_24px_-18px_rgba(8,18,55,0.35)]',
              )}
            >
              <p className={cn('text-xs font-semibold tracking-[0.15em] uppercase', dark ? 'text-white/60' : 'text-accent')}>
                Step {i + 1}
              </p>
              <ListText text={it.text} dark={dark} />
            </div>
          </Reveal>
        ))}
      </ol>
    )
  }

  return (
    <ol className="space-y-4">
      {col.items?.map((it, i) => (
        <li key={i} className="flex gap-4">
          {style === 'numbered' ? (
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white">
              {i + 1}
            </span>
          ) : (
            <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <Check className="size-4" aria-hidden />
            </span>
          )}
          <ListText text={it.text} dark={dark} />
        </li>
      ))}
    </ol>
  )
}

const Note: React.FC<{ note?: string | null; dark: boolean }> = ({ note, dark }) =>
  note ? (
    <p
      className={cn(
        'mt-6 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium',
        dark ? 'bg-white/10 text-white' : 'bg-secondary text-navy',
      )}
    >
      <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      {note}
    </p>
  ) : null

/** "Growing Industry: The tourism..." → bold lead-in before the first colon. */
const ListText: React.FC<{ text: string; dark: boolean }> = ({ text, dark }) => {
  const m = text.match(/^([^:]{3,60}):\s*(.+)$/s)
  return (
    <p className={cn('leading-relaxed', dark ? 'text-white/85' : 'text-foreground')}>
      {m ? (
        <>
          <strong className={dark ? 'text-white' : 'text-navy'}>{m[1]}:</strong> {m[2]}
        </>
      ) : (
        text
      )}
    </p>
  )
}
