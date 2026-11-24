import type { Metadata, Viewport } from 'next'

import { cn } from '@/utilities/ui'
import { Inter, Poppins } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { FloatingContact } from '@/components/FloatingContact'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph, SITE_NAME } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { JsonLd } from '@/components/JsonLd'
import { organizationSchema, websiteSchema } from '@/seo/schema'
import { PAGE_SEO, SITE, SITE_KEYWORDS } from '@/seo/site'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getCachedGlobal('site-settings', 1)()

  // Favicons come from app/(frontend)/icon.png and apple-icon.png (Next.js file conventions)
  return (
    <html className={cn(inter.variable, poppins.variable)} lang="en-IN" data-theme="light" suppressHydrationWarning>
      <body>
        {/* Who we are — on every page, so search and AI answer engines see the institute as one entity */}
        <JsonLd
          data={[
            organizationSchema({
              phones: settings.phones?.map((p) => p.number).filter(Boolean) as string[],
              emails: settings.emails?.map((e) => e.email).filter(Boolean) as string[],
              socials: settings.socials?.map((s) => s.url).filter(Boolean) as string[],
            }),
            websiteSchema(),
          ]}
        />
        <Providers>
          <a
            href="#main"
            className="sr-only z-[60] rounded-md bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingContact />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: PAGE_SEO.home.title,
    template: `%s`,
  },
  description: PAGE_SEO.home.description,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  category: 'education',
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: true, address: true, email: true },
  // PREVIEW_MODE (Vercel client preview) is never indexed; the real site on Hostinger is.
  robots:
    process.env.PREVIEW_MODE === 'true'
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
        },
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
  // Google Search Console / Bing Webmaster verification codes — set in the server's .env at launch
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
  },
  // Local SEO hints (region / city / exact coordinates)
  other: {
    'geo.region': 'IN-KA',
    'geo.placename': `${SITE.address.addressLocality}, Karnataka`,
    'geo.position': `${SITE.geo.latitude};${SITE.geo.longitude}`,
    ICBM: `${SITE.geo.latitude}, ${SITE.geo.longitude}`,
  },
}

export const viewport: Viewport = {
  themeColor: '#2639ae',
}
