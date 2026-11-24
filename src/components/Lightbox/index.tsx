'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import NextImage from 'next/image'
import React, { useCallback, useEffect } from 'react'

export type LightboxImage = { src: string; alt: string; width?: number | null; height?: number | null }

/** Full-screen image viewer with keyboard (←, →, Esc) and swipe-free button navigation. */
export const Lightbox: React.FC<{
  images: LightboxImage[]
  index: number | null
  onChange: (index: number | null) => void
}> = ({ images, index, onChange }) => {
  const open = index !== null && images[index]
  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      onChange((index + dir + images.length) % images.length)
    },
    [index, images.length, onChange],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, go, onChange])

  if (!open) return null
  const img = images[index!]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={img.alt || 'Image viewer'}
      onClick={() => onChange(null)}
    >
      <button
        type="button"
        className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        onClick={() => onChange(null)}
        aria-label="Close"
      >
        <X className="size-6" />
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:left-6"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className="absolute right-2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 md:right-6"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            aria-label="Next image"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}
      <figure className="relative max-h-[85vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
        <NextImage
          src={img.src}
          alt={img.alt}
          width={img.width || 1600}
          height={img.height || 1066}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          sizes="100vw"
        />
        <figcaption className="mt-3 text-center text-sm text-white/80">
          {img.alt && <span>{img.alt} · </span>}
          {index! + 1} / {images.length}
        </figcaption>
      </figure>
    </div>
  )
}
