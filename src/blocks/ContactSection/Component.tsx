import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

import type { ContactSectionBlock as Props } from '@/payload-types'

import { PayloadForm } from '@/blocks/Form/Component'
import { Section, SectionHeader } from '@/components/Section'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const ContactSectionBlock: React.FC<Props> = async ({ eyebrow, heading, intro, form, showMap }) => {
  const settings = await getCachedGlobal('site-settings', 1)()
  const phones = settings.phones?.map((p) => p.number) || []
  const emails = settings.emails?.map((e) => e.email) || []

  const details = [
    phones.length > 0 && {
      Icon: Phone,
      title: 'Call us',
      body: phones.map((p) => (
        <a key={p} href={`tel:${p.replace(/[^\d+]/g, '')}`} className="block hover:text-primary">
          {p}
        </a>
      )),
    },
    emails.length > 0 && {
      Icon: Mail,
      title: 'Email us',
      body: emails.map((e) => (
        <a key={e} href={`mailto:${e}`} className="block break-all hover:text-primary">
          {e}
        </a>
      )),
    },
    settings.address && { Icon: MapPin, title: 'Visit us', body: <p className="whitespace-pre-line">{settings.address}</p> },
    settings.officeHours && { Icon: Clock, title: 'Office hours', body: <p>{settings.officeHours}</p> },
  ].filter(Boolean) as { Icon: typeof Phone; title: string; body: React.ReactNode }[]

  return (
    <Section background="muted">
      <SectionHeader eyebrow={eyebrow} heading={heading} intro={intro} />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1 short:gap-3">
          {details.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm short:p-4">
              <span className="bg-gradient-primary inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-lg shadow-primary/25">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="text-muted-foreground">
                <h3 className="mb-1 font-heading font-semibold text-navy">{title}</h3>
                {body}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 shadow-[0_20px_60px_-30px_rgba(38,57,174,0.35)] md:p-10 lg:col-span-3 short:p-7">
          {form && typeof form === 'object' && <PayloadForm form={form as unknown as FormType} />}
        </div>
      </div>

      {showMap && settings.mapEmbedUrl && (
        <div className="mt-10 overflow-hidden rounded-3xl border border-border shadow-sm">
          <iframe
            src={settings.mapEmbedUrl}
            title="Prestige Institute Dharwad on Google Maps"
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </Section>
  )
}
