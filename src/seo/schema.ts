/**
 * schema.org JSON-LD builders. One organisation entity (@id) is referenced everywhere so search and
 * answer engines connect courses, articles and pages to the same institute.
 */
import type { Course, Media, Post } from '@/payload-types'

import { docPath, withSlash } from '@/utilities/docPath'

import type { Faq } from './faqs'
import { SITE } from './site'

// Absolute URL; page paths get the trailing slash (files like /og-default.jpg don't)
const abs = (path: string) => (/^https?:/.test(path) ? path : `${SITE.url()}${withSlash(path.startsWith('/') ? path : `/${path}`)}`)
export const ORG_ID = () => `${SITE.url()}/#organization`
const WEBSITE_ID = () => `${SITE.url()}/#website`

const imageUrl = (m?: number | Media | null) => (m && typeof m === 'object' && m.url ? abs(m.url) : undefined)

/** The institute: an educational organisation that is also a local business (for Google Maps / local search). */
export function organizationSchema(opts: { phones?: string[]; emails?: string[]; socials?: string[] } = {}) {
  const phones = opts.phones?.length ? opts.phones : SITE.phones
  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': ORG_ID(),
    name: SITE.name,
    alternateName: SITE.alternateName,
    description: SITE.description,
    url: `${SITE.url()}/`,
    logo: abs(SITE.logo),
    image: abs('/og-default.jpg'),
    telephone: phones[0],
    email: (opts.emails?.length ? opts.emails : SITE.emails)[0],
    address: { '@type': 'PostalAddress', ...SITE.address },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    hasMap: 'https://www.google.com/maps?q=Akalwadi+Complex,+P.B.+Road,+Dharwad+580004',
    areaServed: SITE.areaServed.map((name) => ({ '@type': 'Place', name })),
    openingHoursSpecification: SITE.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      ...h,
    })),
    contactPoint: phones.map((telephone) => ({
      '@type': 'ContactPoint',
      telephone,
      contactType: 'admissions',
      areaServed: 'IN',
      availableLanguage: ['English', 'Kannada', 'Hindi'],
    })),
    sameAs: opts.socials?.length ? opts.socials : SITE.socials,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'certificate',
      recognizedBy: { '@type': 'Organization', name: 'Bharat Sevak Samaj (BSS), Central Government of India' },
    },
    knowsAbout: [
      'Hotel Management',
      'Tourism Management',
      'Hospitality',
      'Fire Safety',
      'Industrial Safety',
      'Fire Fighting',
      'Hazard Identification and Risk Assessment (HIRA)',
      'Environment, Health and Safety (EHS)',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Diploma programmes',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'One-Year Diploma in Hotel and Tourism Management', url: abs('/courses/hotel-and-tourism-management') } },
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'One-Year Diploma in Fire and Industrial Safety Management', url: abs('/courses/fire-and-industrial-safety-management') } },
      ],
    },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID(),
    url: `${SITE.url()}/`,
    name: SITE.name,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID() },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url()}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function courseSchema(course: Course, keywords: string[] = []) {
  const url = abs(docPath('courses', course.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    name: course.title,
    description: course.summary,
    url,
    image: imageUrl(course.image),
    provider: { '@id': ORG_ID(), '@type': 'EducationalOrganization', name: SITE.name, sameAs: `${SITE.url()}/` },
    inLanguage: 'en',
    educationalLevel: 'Diploma',
    coursePrerequisites: course.eligibility ? `Passed ${course.eligibility}` : 'SSLC (10th) or PUC (12th)',
    timeRequired: course.duration === '1 Year' ? 'P1Y' : undefined,
    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      name: course.title,
      credentialCategory: 'Diploma',
      recognizedBy: { '@type': 'Organization', name: 'Bharat Sevak Samaj (BSS), Central Government of India' },
    },
    occupationalCategory: (course.careerOpportunities || []).map((c) => c.role).filter(Boolean),
    keywords: keywords.join(', ') || undefined,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: ['Onsite', 'Blended'],
      courseWorkload: course.duration === '1 Year' ? 'P1Y' : undefined,
      location: {
        '@type': 'Place',
        name: SITE.name,
        address: { '@type': 'PostalAddress', ...SITE.address },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: SITE.geo.latitude,
          longitude: SITE.geo.longitude,
        },
        hasMap: 'https://www.google.com/maps?q=Akalwadi+Complex,+P.B.+Road,+Dharwad+580004',
      },
    },
    offers: {
      '@type': 'Offer',
      category: 'Diploma Admission & Counselling',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free course counselling and fee structure details available at campus or online',
      url,
      availability: 'https://schema.org/InStock',
    },
  }
}

export function faqSchema(items: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

export function breadcrumbSchema(crumbs: { label: string; href?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Home', href: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: abs(c.href) } : {}),
    })),
  }
}

export function articleSchema(post: Post) {
  const url = abs(docPath('posts', post.slug))
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title.slice(0, 110),
    description: post.meta?.description || undefined,
    image: imageUrl(post.heroImage) || imageUrl(post.meta?.image) || abs('/og-default.jpg'),
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: SITE.name, url: `${SITE.url()}/` },
    publisher: { '@id': ORG_ID(), '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: abs(SITE.logo) } },
    inLanguage: 'en-IN',
  }
}
