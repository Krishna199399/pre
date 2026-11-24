import React from 'react'

import type { Page } from '@/payload-types'

import { HomeHero } from '@/heros/HomeHero'
import { PageBanner } from '@/heros/PageBanner'

export const RenderHero: React.FC<Page['hero'] & { title?: string; path?: string }> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null
  if (type === 'home') return <HomeHero {...props} />
  return <PageBanner {...props} />
}
