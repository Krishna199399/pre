import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Courses } from './collections/Courses'
import { Faculty } from './collections/Faculty'
import { Gallery } from './collections/Gallery'
import { Recruiters } from './collections/Recruiters'
import { Students } from './collections/Students'
import { Results } from './collections/Results'
import { SiteSettings } from './globals/SiteSettings'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * PREVIEW_MODE=true → client preview on Vercel (frontend only).
 * Vercel's app folder is read-only, so the cleaned demo database (demo/preview.db: content + demo student,
 * no admin accounts or enquiries) is copied to /tmp and used from there. Anything written (e.g. a test
 * enquiry) is temporary and disappears — the real site runs on Hostinger with its own database.
 */
const previewDatabaseUrl = (): string | undefined => {
  if (process.env.PREVIEW_MODE !== 'true') return undefined
  const source = path.resolve(process.cwd(), 'demo/preview.db')
  const target = path.join(os.tmpdir(), 'prestige-preview.db')
  if (!fs.existsSync(target)) fs.copyFileSync(source, target)
  return `file:${target}`
}

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      graphics: {
        Logo: '@/components/AdminLogo#AdminLogo',
        Icon: '@/components/AdminLogo#AdminIcon',
      },
      // Results-only admin: quick actions + counts on the home screen, and an extra menu link
      beforeDashboard: ['@/components/BeforeDashboard'],
      afterNavLinks: ['@/components/admin/NavImportLink#NavImportLink'],
      views: {
        importResults: {
          Component: '@/components/admin/ImportResults#ImportResultsView',
          path: '/import-results',
          meta: { title: 'Import results from Excel' },
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    meta: {
      titleSuffix: ' · Prestige Results Admin',
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  // Enquiry emails go out through the institute's own mailbox (Hostinger SMTP).
  // Without SMTP settings, emails are printed to the server console instead (fine for local development).
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM || 'admin@prestigeinstitutedharwad.in',
        defaultFromName: 'Prestige Institute Website',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  db: sqliteAdapter({
    client: {
      // Local development falls back to ./prestige.db. In production DATABASE_URL must point to a database
      // OUTSIDE the app folder (Hostinger replaces the app folder on every deploy), e.g.
      // file:/home/<user>/prestige-data/prestige.db
      url:
        previewDatabaseUrl() ||
        process.env.DATABASE_URL ||
        (process.env.NODE_ENV === 'production' ? '' : 'file:./prestige.db'),
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  collections: [Pages, Posts, Courses, Faculty, Recruiters, Gallery, Media, Categories, Students, Results, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Header, Footer],
  plugins,
  // Never hard-code this: it signs admin logins. Set PAYLOAD_SECRET in .env / the hosting panel.
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
