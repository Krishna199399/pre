import { ArrowLeft, ArrowRight, CalendarDays, Clock, Facebook, GraduationCap, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { PostCard, formatDate } from '@/components/PostCard'
import RichText from '@/components/RichText'
import { groupConsecutiveMedia } from '@/components/RichText/MediaGallery'
import { PageBanner } from '@/heros/PageBanner'
import { JsonLd } from '@/components/JsonLd'
import { articleSchema } from '@/seo/schema'
import { docPath } from '@/utilities/docPath'
import { getServerSideURL } from '@/utilities/getURL'

/** Rough reading time from the post's text (≈200 words a minute). */
const readingMinutes = (content: Post['content']) => {
  const words = JSON.stringify(content)
    .match(/"text":"([^"]*)"/g)
    ?.join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.round((words || 0) / 200))
}

export const PostView: React.FC<{ post: Post; morePosts: Post[] }> = ({ post, morePosts }) => {
  const url = `${getServerSideURL()}${docPath('posts', post.slug)}`
  const share = [
    { label: 'WhatsApp', Icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}` },
    { label: 'Facebook', Icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: 'LinkedIn', Icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ]
  const categories = (post.categories || []).filter((c) => typeof c === 'object')
  const content = groupConsecutiveMedia(post.content)

  return (
    <article>
      <JsonLd data={articleSchema(post)} />
      <PageBanner
        title={post.title}
        highlight={false}
        breadcrumbs={[{ label: 'Blog', href: '/blog/' }]}
        path={docPath('posts', post.slug)}
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80">
          {post.publishedAt && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden /> {readingMinutes(post.content)} min read
          </span>
          {categories.map((c) =>
            typeof c === 'object' ? (
              <span key={c.id} className="glass rounded-full px-3 py-0.5 text-white">
                {c.title}
              </span>
            ) : null,
          )}
        </div>
      </PageBanner>

      <div className="container grid gap-10 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_19rem] xl:gap-14">
        {/* Article */}
        <div className="min-w-0">
          {post.heroImage && typeof post.heroImage === 'object' && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-secondary shadow-[0_25px_60px_-30px_rgba(8,18,55,0.45)]">
              <Media resource={post.heroImage} fill priority imgClassName="object-cover" size="(min-width: 1024px) 52rem, 100vw" />
            </div>
          )}

          <RichText
            data={content}
            enableGutter={false}
            className="mx-0 max-w-[48rem] text-[17px] leading-relaxed prose-headings:font-heading prose-headings:text-navy prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-p:text-foreground/85 prose-a:text-primary prose-strong:text-navy"
          />

          <div className="mt-12 flex max-w-[48rem] flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <Link href="/blog/" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              <ArrowLeft className="size-4" aria-hidden /> All posts
            </Link>
            <div className="flex items-center gap-2 lg:hidden">
              <span className="text-sm font-semibold text-navy">Share:</span>
              <ShareButtons share={share} />
            </div>
          </div>
        </div>

        {/* Sidebar — sticks while reading on desktop */}
        <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <div className="hidden rounded-3xl border border-border bg-white p-6 shadow-[0_10px_30px_-20px_rgba(8,18,55,0.3)] lg:block">
            <p className="font-heading font-bold text-navy">Share this story</p>
            <div className="mt-4 flex gap-2">
              <ShareButtons share={share} />
            </div>
          </div>

          <div className="bg-mesh relative overflow-hidden rounded-3xl p-6 text-white">
            <span className="glass inline-flex size-11 items-center justify-center rounded-2xl">
              <GraduationCap className="size-5" aria-hidden />
            </span>
            <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">Admissions open 2026-27</p>
            <p className="mt-1 font-heading text-xl font-bold">Start your career with Prestige</p>
            <p className="mt-2 text-sm text-white/75">One-year diplomas in Hotel &amp; Tourism and Fire &amp; Industrial Safety.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/apply-online/"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-semibold text-white shadow-lg shadow-accent/30 hover:bg-accent/90"
              >
                Apply Online <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/courses/"
                className="inline-flex h-10 items-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold hover:bg-white/20"
              >
                Courses
              </Link>
            </div>
          </div>

          {morePosts.length > 0 && (
            <div className="hidden rounded-3xl border border-border bg-white p-6 lg:block">
              <p className="font-heading font-bold text-navy">Latest news</p>
              <ul className="mt-4 space-y-4">
                {morePosts.slice(0, 3).map((p) => (
                  <li key={p.id}>
                    <Link href={docPath('posts', p.slug)} className="group flex gap-3">
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                        {p.heroImage && typeof p.heroImage === 'object' && (
                          <Media resource={p.heroImage} fill imgClassName="object-cover" size="64px" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-sm font-semibold text-navy group-hover:text-primary">{p.title}</span>
                        {p.publishedAt && <span className="mt-1 block text-xs text-muted-foreground">{formatDate(p.publishedAt)}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* On small screens the sidebar list is hidden, so show related posts as cards */}
      {morePosts.length > 0 && (
        <section className="section bg-card lg:hidden">
          <div className="container">
            <h2 className="section-title mb-8 text-center">More from our blog</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {morePosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}

const ShareButtons = ({ share }: { share: { label: string; Icon: React.ElementType; href: string }[] }) => (
  <>
    {share.map(({ label, Icon, href }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share on ${label}`}
        className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-primary transition hover:bg-primary hover:text-white"
      >
        <Icon className="size-[18px]" aria-hidden />
      </a>
    ))}
  </>
)
