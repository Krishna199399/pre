import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { docPath } from '@/utilities/docPath'

export const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

export const PostCard: React.FC<{
  post: Pick<Post, 'slug' | 'title' | 'heroImage' | 'meta' | 'publishedAt' | 'categories'>
}> = ({ post }) => {
  const image = post.heroImage || post.meta?.image
  const category = post.categories?.find((c) => typeof c === 'object')

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {image && typeof image === 'object' ? (
          <Media
            resource={image}
            fill
            imgClassName="object-cover transition duration-500 group-hover:scale-105"
            size="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="bg-brand-gradient flex h-full items-center justify-center text-white/40">
            <Newspaper className="size-14" aria-hidden />
          </div>
        )}
        {category && typeof category === 'object' && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary">
            {category.title}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {post.publishedAt && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </p>
        )}
        <h3 className="mt-2 line-clamp-3 font-heading text-lg font-semibold text-navy">
          <Link href={docPath('posts', post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.meta?.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.meta.description}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
          Read More <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </article>
  )
}
