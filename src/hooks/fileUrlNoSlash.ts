import type { CollectionAfterReadHook } from 'payload'

/**
 * Fixes uploaded-file URLs on read:
 * 1. With `trailingSlash: true` (page URLs end in "/"), Payload also appends "/" to file URLs
 *    ("/api/media/file/photo.jpg/"). Files must not end in a slash, so it is removed.
 * 2. PREVIEW_MODE=true (client preview on Vercel): the server functions there can't read the image files,
 *    so URLs point straight at the static copies in public/ ("/media/photo.jpg", "/gallery/photo.jpg"),
 *    which Vercel serves from its CDN.
 */
const fix = (url?: string | null) => {
  if (typeof url !== 'string') return url
  let out = url.replace(/(\.[a-z0-9]+)\/(?=$|\?)/i, '$1')
  if (process.env.PREVIEW_MODE === 'true') {
    out = out.replace(/^\/api\/media\/file\//, '/media/').replace(/^\/api\/gallery\/file\//, '/gallery/')
  }
  return out
}

export const fileUrlNoSlash: CollectionAfterReadHook = ({ doc }) => {
  if (!doc || typeof doc !== 'object') return doc
  if ('url' in doc) doc.url = fix(doc.url)
  if ('thumbnailURL' in doc) doc.thumbnailURL = fix(doc.thumbnailURL)
  if (doc.sizes && typeof doc.sizes === 'object') {
    for (const size of Object.values(doc.sizes as Record<string, { url?: string | null }>)) {
      if (size && typeof size === 'object' && 'url' in size) size.url = fix(size.url)
    }
  }
  return doc
}
