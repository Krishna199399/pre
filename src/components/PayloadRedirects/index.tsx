import type React from 'react'

import { getCachedRedirects } from '@/utilities/getRedirects'
import { docPath, withSlash } from '@/utilities/docPath'
import { notFound, permanentRedirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

/**
 * Redirects managed in the admin (Settings → Redirects), e.g. old WordPress URLs.
 * Uses permanent (308) redirects so search engines move rankings to the new address.
 */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()
  const normalised = url.length > 1 ? url.replace(/\/+$/, '') : url

  const redirectItem = redirects.find((r) => r.from.replace(/\/+$/, '') === normalised)

  if (redirectItem) {
    if (redirectItem.to?.type !== 'reference' && redirectItem.to?.url) {
      permanentRedirect(withSlash(redirectItem.to.url))
    }

    const ref = redirectItem.to?.reference
    if (ref && typeof ref.value === 'object' && ref.value?.slug) {
      permanentRedirect(docPath(ref.relationTo, ref.value.slug))
    }
  }

  if (disableNotFound) return null

  notFound()
}
