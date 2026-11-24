'use client'

import React, { useEffect, useRef, useState } from 'react'

/**
 * Counts up the number inside a value like "1000+", "100%" or "1 Year" when it scrolls into view.
 * Values without a number (e.g. "BSS") are shown as-is.
 */
export const CountUp: React.FC<{ value: string; className?: string }> = ({ value, className }) => {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const target = match ? Number(match[2]) : 0
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState<number | null>(null)

  useEffect(() => {
    if (!match || !ref.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setCurrent(0)
    const el = ref.current
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1600
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setCurrent(Math.round(target * eased))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!match) return <span className={className}>{value}</span>
  return (
    <span ref={ref} className={className} aria-label={value}>
      {match[1]}
      {current === null ? match[2] : current}
      {match[3]}
    </span>
  )
}
