import type { MetadataRoute } from 'next'

import { SITE } from '@/seo/site'

/**
 * /robots.txt — everything public is open to search engines and AI assistants (GEO: being quoted by
 * ChatGPT, Gemini, Perplexity, Claude… needs their crawlers allowed). Admin, API and search results are closed.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/', '/next/', '/search']
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'Google-Extended', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Applebot-Extended', 'Bingbot'],
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${SITE.url()}/sitemap.xml`,
    host: SITE.url(),
  }
}
