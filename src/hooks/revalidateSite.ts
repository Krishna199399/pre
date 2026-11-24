import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * For small supporting collections (faculty, gallery, recruiters, courses) that appear
 * inside many pages: refresh the whole site's static cache after a change.
 * The site is small, so this is cheap and keeps editing simple for the admin.
 */
export const revalidateSiteAfterChange: CollectionAfterChangeHook = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating site after content change')
    revalidatePath('/', 'layout')
  }
  return doc
}

export const revalidateSiteAfterDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidatePath('/', 'layout')
  return doc
}
