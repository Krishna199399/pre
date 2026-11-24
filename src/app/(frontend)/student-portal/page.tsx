import type { Metadata } from 'next'
import React from 'react'

import { PageBanner } from '@/heros/PageBanner'
import { metaFor } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { SITE_NAME } from '@/utilities/mergeOpenGraph'

import { StudentPortal } from './Portal.client'

export default async function StudentPortalPage() {
  const settings = await getCachedGlobal('site-settings', 1)()

  return (
    <>
      <div className="no-print">
        <PageBanner
          title="Student Portal"
          text="View your published examination results using your Registration Number and Date of Birth."
        />
      </div>
      <section className="section bg-card print:bg-white print:py-0">
        <div className="container">
          <StudentPortal siteName={settings.siteName || SITE_NAME} address={settings.address} />
        </div>
      </section>
    </>
  )
}

export const metadata: Metadata = metaFor('student-portal', '/student-portal/')
