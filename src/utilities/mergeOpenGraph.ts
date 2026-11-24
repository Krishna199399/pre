import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

export const SITE_NAME = 'Prestige Institute Dharwad'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'en_IN',
  description:
    '1-year diplomas in Hotel & Tourism Management and Fire & Industrial Safety in Hubballi-Dharwad, Karnataka. Join after 10th or PUC — practical training & placement.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.jpg`,
      width: 1200,
      height: 630,
      alt: 'Prestige Institute Dharwad — Hotel Management & Fire Safety diplomas',
    },
  ],
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  } as Metadata['openGraph']
}
