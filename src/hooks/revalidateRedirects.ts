import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  // Scripts (e.g. the migration) run outside Next.js and pass disableRevalidate.
  if (context.disableRevalidate) return doc

  payload.logger.info(`Revalidating redirects`)
  revalidateTag('redirects', 'max')

  return doc
}
