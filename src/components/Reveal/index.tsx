'use client'

import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

/**
 * Fades content up into view when it scrolls onto the screen.
 * Content stays visible without JavaScript (the hidden state is only applied after mount).
 */
export const Reveal: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'article'
}> = ({ children, className, delay = 0, as: Tag = 'div' }) => {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Already on screen at load → show immediately, no animation flash.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setState('shown')
      return
    }
    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('shown')
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cn(
        'transition-all duration-700 ease-out',
        state === 'hidden' && 'translate-y-6 opacity-0',
        state === 'shown' && 'translate-y-0 opacity-100',
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
