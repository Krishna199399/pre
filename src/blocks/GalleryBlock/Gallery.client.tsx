'use client'

import { Expand } from 'lucide-react'
import NextImage from 'next/image'
import React, { useMemo, useState } from 'react'

import { Lightbox } from '@/components/Lightbox'
import { cn } from '@/utilities/ui'

export type GalleryPhoto = {
  id: string
  category: string
  alt: string
  thumb: string
  full: string
  width?: number | null
  height?: number | null
}

const filters = [
  { value: 'all', label: 'All' },
  { value: 'hotel-tourism', label: 'Hotel & Tourism' },
  { value: 'fire-safety', label: 'Fire & Industrial Safety' },
  { value: 'campus', label: 'Campus & Events' },
]

export const GalleryClient: React.FC<{ photos: GalleryPhoto[]; showFilters: boolean }> = ({
  photos,
  showFilters,
}) => {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState<number | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? photos : photos.filter((p) => p.category === filter)),
    [filter, photos],
  )
  const available = filters.filter(
    (f) => f.value === 'all' || photos.some((p) => p.category === f.value),
  )

  if (!photos.length) {
    return <p className="text-center text-muted-foreground">Photos will appear here soon.</p>
  }

  return (
    <>
      {showFilters && available.length > 2 && (
        <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filter photos">
          {available.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full border px-5 py-2 text-sm font-semibold transition',
                filter === f.value
                  ? 'border-primary bg-primary text-white shadow-md'
                  : 'border-border bg-white text-navy hover:border-primary hover:text-primary',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
        {visible.map((p, i) => (
          <li key={p.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-2xl bg-secondary focus-visible:ring-4 focus-visible:ring-primary/40"
              aria-label={`Open photo${p.alt ? `: ${p.alt}` : ''}`}
            >
              <NextImage
                src={p.thumb}
                alt={p.alt}
                width={p.width || 800}
                height={p.height || 600}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition group-hover:bg-navy/40 group-hover:opacity-100">
                <Expand className="size-8 text-white" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        images={visible.map((p) => ({ src: p.full, alt: p.alt, width: p.width, height: p.height }))}
        index={open}
        onChange={setOpen}
      />
    </>
  )
}
