import { ArrowRight, Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { withSlash } from '@/utilities/docPath'
import { getCachedGlobal } from '@/utilities/getGlobals'

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  x: Twitter,
  whatsapp: MessageCircle,
}

export async function Footer() {
  const [footer, settings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('site-settings', 1)(),
  ])

  const year = new Date().getFullYear()
  const phones = settings.phones?.map((p) => p.number) || []
  const emails = settings.emails?.map((e) => e.email) || []

  return (
    <footer className="relative isolate mt-auto overflow-hidden bg-navy text-white/75">
      <div className="pointer-events-none absolute -top-40 right-0 -z-10 size-[30rem] rounded-full bg-primary/30 blur-3xl" aria-hidden />

      {/* Pre-footer call to action */}
      <div className="container pt-16">
        <div className="bg-gradient-primary relative overflow-hidden rounded-[2rem] px-6 py-10 text-white md:px-12 md:py-12">
          <div className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full border-[48px] border-white/10" aria-hidden />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-white/70 uppercase">Admissions open 2026-27</p>
              <p className="mt-2 font-heading text-2xl font-bold md:text-4xl">Ready to start your career?</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={withSlash(settings.announcement?.linkUrl || '/apply-online/')}
                className="btn-shine inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-semibold text-primary hover:bg-white/95"
              >
                Apply Online <ArrowRight className="size-4" aria-hidden />
              </Link>
              {phones[0] && (
                <a
                  href={`tel:${phones[0].replace(/[^\d+]/g, '')}`}
                  className="glass inline-flex h-12 items-center gap-2 rounded-full px-7 font-semibold text-white hover:bg-white/20"
                >
                  <Phone className="size-4" aria-hidden /> {phones[0]}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Home" className="inline-block">
            <Logo logo={settings.logoLight || settings.logo} siteName={settings.siteName} light />
          </Link>
          {settings.footerAbout && <p className="mt-6 leading-relaxed">{settings.footerAbout}</p>}
          {settings.socials && settings.socials.length > 0 && (
            <ul className="mt-6 flex gap-3">
              {settings.socials.map((s, i) => {
                const Icon = socialIcons[s.platform as keyof typeof socialIcons] || MessageCircle
                return (
                  <li key={i}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                      className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-accent"
                    >
                      <Icon className="size-[18px]" aria-hidden />
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {footer.columns?.map((col, i) => (
          <div key={i} className="lg:col-span-2">
            <h2 className="font-heading text-lg font-semibold text-white">{col.title}</h2>
            <ul className="mt-5 space-y-3">
              {col.navItems?.map(({ link }, j) => (
                <li key={j}>
                  <CMSLink {...link} className="transition hover:text-white hover:underline underline-offset-4" />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-4">
          <h2 className="font-heading text-lg font-semibold text-white">Contact Us</h2>
          <ul className="mt-5 space-y-4">
            {phones.length > 0 && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span>
                  {phones.map((p, k) => (
                    <React.Fragment key={p}>
                      {k > 0 && ', '}
                      <a href={`tel:${p.replace(/[^\d+]/g, '')}`} className="hover:text-white">
                        {p}
                      </a>
                    </React.Fragment>
                  ))}
                </span>
              </li>
            )}
            {settings.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span className="whitespace-pre-line">{settings.address}</span>
              </li>
            )}
            {emails.length > 0 && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span className="space-y-1">
                  {emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="block break-all hover:text-white">
                      {e}
                    </a>
                  ))}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-sm md:flex-row md:text-left">
          <p>
            © {year} {settings.copyrightName || settings.siteName}
          </p>
          {settings.creditLabel && (
            <p>
              Design &amp; Developed by{' '}
              {settings.creditUrl ? (
                <a href={settings.creditUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-white hover:underline">
                  {settings.creditLabel}
                </a>
              ) : (
                settings.creditLabel
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
