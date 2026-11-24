'use client'
import { ArrowRight, ChevronDown, GraduationCap, Megaphone, Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, SiteSetting } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { linkHref, stripSlash, withSlash } from '@/utilities/docPath'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
  settings: SiteSetting
}

type NavItem = NonNullable<Header['navItems']>[number]

const isActive = (pathname: string, href: string | null) => {
  if (!href || href === '#') return false
  const p = stripSlash(pathname)
  const h = stripSlash(href)
  return h === '/' ? p === '/' : p === h || p.startsWith(`${h}/`)
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, settings }) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu after navigating.
  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  const navItems = data?.navItems || []
  const cta = data?.cta?.link
  const ctaHref = linkHref(cta)
  const announcement = settings?.announcement
  const phone = settings?.phones?.[0]?.number
  const topLinks = data?.topLinks || []

  return (
    <>
      {(announcement?.enabled || topLinks.length > 0) && (
        <div className="bg-navy text-white">
          <div className="container flex items-center justify-center gap-6 py-2 text-xs sm:text-sm lg:justify-between">
            {announcement?.enabled && announcement.text ? (
              <div className="flex min-w-0 items-center gap-3 text-center lg:text-left">
                <Megaphone className="hidden size-4 shrink-0 text-accent sm:block" aria-hidden />
                <p className="line-clamp-2 lg:line-clamp-1">{announcement.text}</p>
                {announcement.linkUrl && (
                  <Link
                    href={withSlash(announcement.linkUrl)}
                    className="hidden shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-0.5 font-semibold whitespace-nowrap hover:bg-accent/90 md:inline-flex"
                  >
                    {announcement.linkLabel || 'Apply Now'} <ArrowRight className="size-3.5" aria-hidden />
                  </Link>
                )}
              </div>
            ) : (
              <span />
            )}
            <div className="hidden shrink-0 items-center gap-5 lg:flex">
              {phone && (
                <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white">
                  <Phone className="size-3.5" aria-hidden /> {phone}
                </a>
              )}
              {topLinks.map((t, i) => {
                const href = linkHref(t.link)
                return href ? (
                  <Link key={i} href={href} className="inline-flex items-center gap-1.5 font-semibold whitespace-nowrap hover:text-accent">
                    <GraduationCap className="size-4" aria-hidden /> {t.link.label}
                  </Link>
                ) : null
              })}
            </div>
          </div>
        </div>
      )}

      <header
        className={cn(
          'sticky top-0 z-40 border-b bg-white/90 backdrop-blur-lg transition-shadow',
          scrolled ? 'border-border shadow-[0_8px_30px_-12px_rgba(8,18,55,0.25)]' : 'border-transparent',
        )}
      >
        <div className="container flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label={`${settings?.siteName || 'Home'} — home`}>
            <Logo logo={settings?.logo} siteName={settings?.siteName} priority />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item, i) => (
                <DesktopItem key={i} item={item} pathname={pathname} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {cta?.label && ctaHref && (
              <Link
                href={ctaHref}
                className="hidden h-11 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold whitespace-nowrap text-white shadow-lg shadow-accent/25 transition hover:bg-accent/90 sm:inline-flex"
              >
                {cta.label} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-navy hover:bg-secondary xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={cn('fixed inset-0 z-50 xl:hidden', mobileOpen ? 'visible' : 'invisible')}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn('absolute inset-0 bg-navy/60 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-border px-5">
            <Logo logo={settings?.logo} siteName={settings?.siteName} className="[&_img]:h-10" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="inline-flex size-11 items-center justify-center rounded-full hover:bg-secondary"
              aria-label="Close menu"
            >
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navItems.map((item, i) => (
                <MobileItem key={i} item={item} pathname={pathname} />
              ))}
              {topLinks.map((t, i) => (
                <MobileItem key={`top-${i}`} item={{ link: t.link }} pathname={pathname} />
              ))}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-border p-5">
            {cta?.label && ctaHref && (
              <Link
                href={ctaHref}
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-accent font-semibold text-white"
              >
                {cta.label} <ArrowRight className="size-4" aria-hidden />
              </Link>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-border font-semibold text-navy"
              >
                <Phone className="size-4" aria-hidden /> Call {phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const DesktopItem: React.FC<{ item: NavItem; pathname: string }> = ({ item, pathname }) => {
  const href = linkHref(item.link)
  const subs = item.subItems || []
  const active = isActive(pathname, href) || subs.some((s) => isActive(pathname, linkHref(s.link)))
  const base = cn(
    'inline-flex h-10 items-center gap-1 rounded-full px-3 text-[15px] font-medium whitespace-nowrap transition-colors',
    active ? 'bg-secondary text-primary' : 'text-navy hover:text-primary',
  )

  if (!subs.length) {
    return (
      <li>
        <Link href={href || '#'} className={base} aria-current={active ? 'page' : undefined} {...(item.link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {item.link.label}
        </Link>
      </li>
    )
  }

  return (
    <li className="group relative">
      <button type="button" className={base} aria-haspopup="true">
        {item.link.label}
        <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
      </button>
      <div className="invisible absolute top-full left-0 pt-3 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="w-64 rounded-2xl border border-border bg-white p-2 shadow-2xl">
          {subs.map((s, i) => {
            const sHref = linkHref(s.link)
            const sActive = isActive(pathname, sHref)
            return (
              <li key={i}>
                <Link
                  href={sHref || '#'}
                  className={cn(
                    'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                    sActive ? 'bg-secondary text-primary' : 'text-navy hover:bg-card hover:text-primary',
                  )}
                  aria-current={sActive ? 'page' : undefined}
                >
                  {s.link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

const MobileItem: React.FC<{ item: NavItem; pathname: string }> = ({ item, pathname }) => {
  const href = linkHref(item.link)
  const subs = item.subItems || []
  const [open, setOpen] = useState(subs.some((s) => isActive(pathname, linkHref(s.link))))
  const rowClass = (active: boolean) =>
    cn(
      'flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium',
      active ? 'bg-secondary text-primary' : 'text-navy hover:bg-card',
    )

  if (!subs.length) {
    return (
      <li>
        <Link href={href || '#'} className={rowClass(isActive(pathname, href))}>
          {item.link.label}
        </Link>
      </li>
    )
  }

  return (
    <li>
      <button type="button" className={rowClass(false)} onClick={() => setOpen(!open)} aria-expanded={open}>
        {item.link.label}
        <ChevronDown className={cn('size-5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <ul className="mt-1 ml-4 space-y-1 border-l-2 border-secondary pl-3">
          {subs.map((s, i) => {
            const sHref = linkHref(s.link)
            return (
              <li key={i}>
                <Link href={sHref || '#'} className={rowClass(isActive(pathname, sHref))}>
                  {s.link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}
