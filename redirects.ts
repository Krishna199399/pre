import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // Old sitemap addresses (WordPress / Yoast / Rank Math and the earlier template) → the single /sitemap.xml
  const oldSitemaps = [
    '/sitemap_index.xml',
    '/wp-sitemap.xml',
    '/page-sitemap.xml',
    '/post-sitemap.xml',
    '/pages-sitemap.xml',
    '/posts-sitemap.xml',
  ].map((source) => ({ source, destination: '/sitemap.xml', permanent: true }))

  return [internetExplorerRedirect, ...oldSitemaps]
}
