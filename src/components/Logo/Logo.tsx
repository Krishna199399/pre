import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

interface Props {
  className?: string
  logo?: MediaType | number | null
  siteName?: string | null
  light?: boolean
  priority?: boolean
  showText?: boolean
}

/**
 * Logo mark from Site Settings (or a "P" fallback) + the institute name as a wordmark,
 * matching the live site's "logo + PRESTIGE INSTITUTE DHARWAD" header.
 */
export const Logo: React.FC<Props> = ({ className, logo, siteName, light, priority, showText = true }) => {
  const name = siteName || 'Prestige Institute Dharwad'
  const words = name.split(' ')
  const line1 = words.slice(0, 2).join(' ')
  const line2 = words.slice(2).join(' ')

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      {logo && typeof logo === 'object' && logo.url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={getMediaUrl(logo.url, logo.updatedAt)}
          alt={showText ? '' : name}
          width={logo.width || 120}
          height={logo.height || 120}
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
          className="h-12 w-auto object-contain"
        />
      ) : (
        <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary font-heading text-xl font-bold text-white">
          {name[0]}
        </span>
      )}
      {showText && (
        <span className="leading-tight">
          <span
            className={cn(
              'block font-heading text-[15px] font-bold tracking-wide uppercase sm:text-base',
              light ? 'text-white' : 'text-navy',
            )}
          >
            {line1}
          </span>
          {line2 && (
            <span
              className={cn(
                'block text-[11px] font-semibold tracking-[0.3em] uppercase',
                light ? 'text-white/70' : 'text-primary',
              )}
            >
              {line2}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
