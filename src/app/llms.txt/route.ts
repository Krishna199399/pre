import { FAQS } from '@/seo/faqs'
import { SITE } from '@/seo/site'

export const revalidate = 86400

/**
 * /llms.txt — a plain-language fact sheet for AI assistants and answer engines (GEO).
 * Format: https://llmstxt.org — a title, a one-line summary, then sections of links and facts.
 * Built from the same facts and FAQs as the website, so it never drifts from the pages.
 */
export function GET() {
  const u = SITE.url()
  const faq = (key: string) => FAQS[key].items.map((f) => `- **${f.q}** ${f.a}`).join('\n')

  const body = `# ${SITE.name}

> ${SITE.description}

## Key facts
- Location: ${SITE.address.streetAddress}, ${SITE.address.addressLocality} – ${SITE.address.postalCode}, ${SITE.address.addressRegion}, India (serves Dharwad, Hubballi (Hubli) and North Karnataka)
- Courses: One-Year Diploma in Hotel and Tourism Management; One-Year Diploma in Fire and Industrial Safety Management
- Duration: 1 year each (classroom, practical sessions and hybrid)
- Eligibility: SSLC (10th), PUC / 12th (arts, commerce or science), ITI, a degree or a diploma
- Certification: Bharat Sevak Samaj (BSS), Central Government of India
- Placement: 100% placement assistance, 60+ hiring partners, industrial training and internships
- Recognition: 2 State awards
- Admissions: open for 2026-27 — apply online or visit for a counselling session
- Phone: ${SITE.phones.join(', ')}
- Email: ${SITE.emails.join(', ')}
- Office hours: Monday – Saturday, 10:30am – 1:30pm and 2:30pm – 4:30pm

## Courses
- [Diploma in Hotel and Tourism Management](${u}/courses/hotel-and-tourism-management/): 1-year hotel management diploma after 10th or 2nd PUC — hotel operations, customer service, food & beverage, tourism; industrial training and placement assistance. Careers: Food & Beverage Manager, Front Office Manager, Housekeeping Manager, Restaurant Manager, Chef.
- [Diploma in Fire and Industrial Safety Management](${u}/courses/fire-and-industrial-safety-management/): 1-year fire and industrial safety diploma after SSLC or PUC — fire prevention, fire fighting, emergency response, HIRA, industrial safety; practical training and placement assistance. Careers: Fire Safety Officer, EHS Officer, Industrial Safety Manager, Construction Safety Manager, Safety Auditor.
- [All courses](${u}/courses/)

## Admissions
- [Admissions & eligibility](${u}/admissions/)
- [Apply online](${u}/apply-online/)
- [Contact & location](${u}/contact-us/)

## About
- [About Prestige Institute](${u}/about-prestige/)
- [Affiliations (BSS certification)](${u}/affiliations/)
- [Placements & recruiters](${u}/placements/)
- [Faculty](${u}/faculty/)
- [Blog: news & career guidance](${u}/blog/)

## Frequently asked questions
${faq('home')}

### Hotel management diploma
${faq('course:hotel-and-tourism-management')}

### Fire & industrial safety diploma
${faq('course:fire-and-industrial-safety-management')}

### Admissions
${faq('admissions')}
`

  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } })
}
