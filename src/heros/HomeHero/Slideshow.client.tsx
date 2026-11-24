'use client'

import React, { useCallback, useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

const INTERVAL = 6000

/**
 * Crossfading background slideshow. Slides are rendered on the server (as children)
 * so images are optimised; this component only decides which one is visible.
 */
export const HeroSlideshow: React.FC<{ slides: React.ReactNode[]; labels: string[] }> = ({ slides, labels }) => {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const next = useCallback(() => setActive((i) => (i + 1) % count), [count])

  useEffect(() => {
    if (count < 2 || paused) return
    const t = setTimeout(next, INTERVAL)
    return () => clearTimeout(t)
  }, [active, count, paused, next])

  // Stop auto-play while the tab is hidden.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <>
      <div className="absolute inset-0 -z-20" aria-hidden>
        {slides.map((slide, i) => (
          <div
            key={i}
            className={cn(
              'absolute inset-0 transition-opacity duration-[1400ms] ease-in-out',
              i === active ? 'opacity-100' : 'opacity-0',
            )}
          >
            <div
              className={cn(
                'absolute inset-0 motion-safe:transition-transform motion-safe:duration-[7000ms] motion-safe:ease-out',
                i === active ? 'scale-100' : 'scale-110',
              )}
            >
              {slide}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="flex items-center gap-2" role="group" aria-label="Choose background photo">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}: ${labels[i] || ''}`}
              aria-current={i === active}
              className="group relative h-1.5 w-10 overflow-hidden rounded-full bg-white/25 transition hover:bg-white/40"
            >
              <span
                key={`${i}-${active}`}
                className={cn(
                  'absolute inset-y-0 left-0 rounded-full bg-white',
                  i === active ? (paused ? 'w-full' : 'animate-[slide-progress_6s_linear_forwards]') : 'w-0',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}
