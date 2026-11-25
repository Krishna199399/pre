import { sqliteAdapter } from '@payloadcms/db-sqlite'
import sharp from 'sharp'
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./prestige.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  // GraphQL is disabled: Vercel Hobby plan allows max 12 serverless functions.
  // The Payload admin and all REST API routes work without it.
  graphQL: { disable: true },
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
