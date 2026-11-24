import type { CollectionAfterReadHook } from 'payload'

/**
 * With `trailingSlash: true` (page URLs end in "/"), Payload also appends "/" to uploaded-file URLs:
 * "/api/media/file/photo.jpg/". Files must not end in a slash — the image optimiser and browsers then
 * fail to load them. This strips it from the main URL and every resized version.
 */
const strip = (url?: string | null) => (typeof url === 'string' ? url.replace(/(\.[a-z0-9]+)\/(?=$|\?)/i, '$1') : url)

export const fileUrlNoSlash: CollectionAfterReadHook = ({ doc }) => {
  if (!doc || typeof doc !== 'object') return doc
  if ('url' in doc) doc.url = strip(doc.url)
  if ('thumbnailURL' in doc) doc.thumbnailURL = strip(doc.thumbnailURL)
  if (doc.sizes && typeof doc.sizes === 'object') {
    for (const size of Object.values(doc.sizes as Record<string, { url?: string | null }>)) {
      if (size && typeof size === 'object' && 'url' in size) size.url = strip(size.url)
    }
  }
  return doc
}
