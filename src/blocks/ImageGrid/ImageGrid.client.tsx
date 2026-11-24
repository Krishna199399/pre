'use client'

import { ZoomIn } from 'lucide-react'
import NextImage from 'next/image'
import React, { useState } from 'react'

import { Lightbox } from '@/components/Lightbox'
import { cn } from '@/utilities/ui'

type Item = { src: string; thumb: string; alt: string; width?: number | null; height?: number | null }

const cols: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'grid-cols-2 lg:grid-cols-4',
}

export const ImageGridClient: React.FC<{ items: Item[]; columns: string }> = ({ items, columns }) => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <ul className={cn('grid gap-6', cols[columns])}>
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              aria-label={`View ${item.alt || 'image'} larger`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-card">
                <NextImage
                  src={item.thumb}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-contain"
                />
              </div>
              <span className="absolute top-5 right-5 rounded-full bg-white/90 p-2 text-primary opacity-0 shadow transition group-hover:opacity-100">
                <ZoomIn className="size-5" aria-hidden />
              </span>
              {item.alt && <p className="mt-3 text-sm font-medium text-navy">{item.alt}</p>}
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={items} index={open} onChange={setOpen} />
    </>
  )
}
