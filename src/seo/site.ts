/**
 * Single source of truth for SEO / AEO / GEO.
 * The admin is results-only, so page titles, descriptions, keywords and FAQs are maintained here in code.
 * Keep every statement factual — answer engines (Google AI Overviews, ChatGPT, Perplexity…) quote it.
 */
import { getServerSideURL } from '@/utilities/getURL'

export const SITE = {
  name: 'Prestige Institute Dharwad',
  alternateName: ['Prestige Institute of Hotel & Fire Safety Management', 'Prestige Institute Hubballi-Dharwad'],
  url: () => getServerSideURL().replace(/\/$/, ''),
  description:
    'Prestige Institute Dharwad is a career-focused institute in Hubballi-Dharwad, Karnataka offering one-year diplomas in Hotel & Tourism Management and Fire & Industrial Safety Management, open to students after SSLC (10th), PUC (12th), ITI, a degree or a diploma, with practical training, BSS (Central Government of India) certification and 100% placement assistance.',
  phones: ['+91 90364 42221', '+91 73491 59198'],
  emails: ['admin@prestigeinstitutedharwad.in', 'prestigeinstitutedharwad@gmail.com'],
  address: {
    streetAddress: '2nd Floor, Akalwadi Complex, Near Toll Naka, Opp. Modern Hall, P.B. Road',
    addressLocality: 'Dharwad',
    addressRegion: 'Karnataka',
    postalCode: '580004',
    addressCountry: 'IN',
  },
  geo: {
    latitude: 15.4497,
    longitude: 75.0069,
  },
  areaServed: ['Dharwad', 'Hubballi (Hubli)', 'North Karnataka', 'Karnataka'],
  // Monday – Saturday · 10:30am – 1:30pm, 2:30pm – 4:30pm
  openingHours: [
    { opens: '10:30', closes: '13:30' },
    { opens: '14:30', closes: '16:30' },
  ],
  socials: [
    'https://www.facebook.com/prestigeinstitutedharwad/',
    'https://www.instagram.com/prestige_institute_/',
    'https://www.linkedin.com/in/prestige-institute-hotel-management-411361307',
  ],
  logo: '/brand/logo-mark.png',
}

/** Keywords that apply site-wide (also used for the home page). */
export const SITE_KEYWORDS = [
  'Prestige Institute Dharwad',
  'best hotel management institute in Dharwad',
  'hotel management college in Hubballi-Dharwad',
  'hotel management colleges in Hubli',
  'hotel management institute in North Karnataka',
  'fire and industrial safety institute in Dharwad',
  'fire safety training center in Hubli Dharwad',
  'vocational training institute in Dharwad',
  'top diploma colleges in Hubballi Dharwad',
  'job oriented courses after 10th or PUC in Karnataka',
  '100% placement courses in Karnataka',
  'best practical courses in Karnataka',
  'diploma courses after 10th',
  'diploma courses after PUC',
]

export type PageSeo = { title: string; description: string; keywords: string[] }

/**
 * Per-page search snippets. Titles ≈ 60 characters and descriptions ≈ 155 so Google shows them in full.
 * Keys: page slug, or "course:<slug>" for course pages, or a route name.
 */
export const PAGE_SEO: Record<string, PageSeo> = {
  home: {
    title: 'Hotel Management & Fire Safety Institute, Dharwad | Prestige',
    description:
      '1-year Hotel & Tourism and Fire & Industrial Safety diplomas in Hubballi-Dharwad, Karnataka. Join after 10th or PUC — practical training and placement.',
    keywords: SITE_KEYWORDS,
  },
  courses: {
    title: 'Diploma Courses After 10th & PUC in Karnataka | Prestige',
    description:
      'Job-oriented 1-year diplomas after SSLC, PUC or 12th (arts, commerce, science): Hotel & Tourism Management and Fire & Industrial Safety in Dharwad, Karnataka.',
    keywords: [
      'after 10th course',
      'after 10th diploma courses',
      'after 10 diploma courses',
      'after PUC course',
      'after PUC diploma course',
      'short term job oriented courses after 10th or PUC in Karnataka',
      'job courses in Karnataka',
      'hotel management courses after 12th commerce arts science',
      'fire and industrial safety course after PUC SSLC',
      'best practical courses in Karnataka',
    ],
  },
  'course:hotel-and-tourism-management': {
    title: '1 Year Hotel Management Diploma in Karnataka | Prestige',
    description:
      'Diploma in Hotel & Tourism Management after 10th or 2nd PUC in Hubballi-Dharwad — one year with industrial training, practicals and placement assistance.',
    keywords: [
      'hotel management diploma after 10th / 2nd PUC',
      'hotel management diploma after 10th',
      'hotel management diploma after 2nd PUC',
      'hotel management course in Karnataka',
      'diploma in hotel management Karnataka',
      'hotel management and tourism course',
      '1 year hotel management diploma with training',
      'hotel management course with placement',
      'hotel management course with EMI',
      'tourism management diploma Karnataka',
      'industrial training hotel management course Dharwad Hubli',
      'hotel management colleges in Hubli',
      'hotel management diploma admission eligibility',
      'hotel management course fees in Dharwad Hubli',
      'food and beverage service diploma in Karnataka',
      'career in hotel management after 12th arts commerce',
      'hotel management courses with 100% job placement',
      'less fee hotel management college Karnataka',
      'HM course with training',
      'best HM college in Karnataka',
      'best tourism courses in Karnataka',
      'best teaching institution of hotel management',
      'hotel management courses after 12th commerce arts science',
    ],
  },
  'course:fire-and-industrial-safety-management': {
    title: 'Fire & Industrial Safety Course Karnataka | 1 Year Diploma',
    description:
      '1-year Fire & Industrial Safety diploma after SSLC or PUC in Hubballi-Dharwad — fire training, risk assessment, practical sessions and placement assistance.',
    keywords: [
      'fire and industrial safety course in Karnataka',
      'fire and industrial safety management course after 10th PUC',
      '1 year fire and industrial safety diploma in Karnataka',
      'fire and industrial safety course with practical training in Hubli Dharwad',
      'fire safety training center in Hubli Dharwad',
      'fire safety officer course Karnataka',
      'fire and industrial safety institute in Dharwad',
      'fire and safety diploma course after 10th pass',
      'industrial fire fighter training Karnataka',
      'fire safety officer jobs in Karnataka',
      'industrial safety diploma with placement assistance',
      'industrial safety and fire fighting course',
      'fire and industrial safety course with placement',
      'fire training',
      'EHS training',
      'industrial safety college in Karnataka',
      'best fire and industrial safety college in Karnataka',
      'fire and industrial safety with practical college',
      'best safety institute',
      'Diploma in construction safety in Karnataka',
      'PDIS College in Karnataka',
      'ADIS College in Karnataka',
      'ADIS- advance diploma in industrial safety course in Karnataka',
      'PDIS- Post diploma in industrial safety Karnataka',
    ],
  },
  admissions: {
    title: 'Admissions 2026-27 | Hotel Management & Fire Safety Diploma',
    description:
      'Admissions open for 2026-27 at Prestige Institute Dharwad. Eligibility: SSLC, PUC, ITI, degree or diploma. See the 5-step admission process and enquire today.',
    keywords: [
      'hotel management admission 2026 Karnataka',
      'fire and industrial safety admission 2026',
      'hotel management diploma admission eligibility',
      'fire and safety diploma course after 10th pass',
      'hotel management course fees in Dharwad Hubli',
      'after 10th course admission',
      'after PUC diploma course admission',
      'fire and industrial safety course fees in Karnataka',
    ],
  },
  placements: {
    title: 'Placements & Recruiters | Prestige Institute Dharwad',
    description:
      '100% placement assistance with 60+ hiring partners — hotels, resorts, cruise lines and industrial companies — after our hotel management & safety diplomas.',
    keywords: [
      'hotel management course with placement',
      'fire and industrial safety course with placement',
      '100% placement courses in Karnataka',
      'job courses in Karnataka',
    ],
  },
  'about-prestige': {
    title: 'About Us | Hotel & Fire Safety College in Dharwad | Prestige',
    description:
      'Prestige Institute Dharwad trains career-ready professionals in Hotel & Tourism and Fire & Industrial Safety, with BSS (Central Govt. of India) certification.',
    keywords: ['best teaching institution of hotel management', 'best safety institute', 'hotel management college in Hubballi-Dharwad'],
  },
  'vision-mission': {
    title: 'Vision & Mission | Prestige Institute Dharwad',
    description:
      'The vision and mission of Prestige Institute Dharwad — excellence in hotel management and fire & industrial safety education in Karnataka.',
    keywords: ['Prestige Institute Dharwad vision', 'hotel management institute Karnataka'],
  },
  'directors-message': {
    title: "Director's Message | Prestige Institute Dharwad",
    description:
      'A message to students and aspirants from the Managing Director of Prestige Institute Dharwad, a career-focused hotel management and fire safety institute.',
    keywords: ['Prestige Institute Dharwad director'],
  },
  affiliations: {
    title: 'Affiliations & BSS Certification | Prestige Institute',
    description:
      'Our diploma programmes carry recognised certification from Bharat Sevak Samaj (BSS), Central Government of India. View the affiliation certificates.',
    keywords: ['BSS certified diploma Karnataka', 'recognised hotel management diploma', 'recognised fire safety diploma'],
  },
  faculty: {
    title: 'Faculty | Prestige Institute Dharwad',
    description:
      'Meet the experienced faculty guiding hotel management and fire & industrial safety students at Prestige Institute Dharwad.',
    keywords: ['hotel management faculty Dharwad', 'fire safety trainers Dharwad'],
  },
  gallery: {
    title: 'Gallery — Campus, Kitchens & Fire Drills | Prestige Dharwad',
    description:
      'Photos of practical training at Prestige Institute Dharwad — hotel kitchens, classrooms, fire drills, industrial visits and campus events.',
    keywords: ['hotel management practical training photos', 'fire drill training Dharwad'],
  },
  'apply-online': {
    title: 'Apply Online — Admissions 2026-27 | Prestige Institute',
    description:
      'Apply online for the Hotel & Tourism Management or Fire & Industrial Safety diploma at Prestige Institute Dharwad. Takes about 5 minutes.',
    keywords: ['apply hotel management course online Karnataka', 'fire safety course admission online'],
  },
  'contact-us': {
    title: 'Contact Prestige Institute | Hubballi-Dharwad Campus',
    description:
      'Visit Prestige Institute Dharwad at Akalwadi Complex, P.B. Road, Dharwad 580004, or call +91 90364 42221. Open Monday – Saturday.',
    keywords: ['Prestige Institute Dharwad address', 'hotel management college Dharwad contact'],
  },
  blog: {
    title: 'Blog — Campus News & Career Guidance | Prestige Institute',
    description:
      'News, awards, industry visits and career guidance for hotel management and fire & industrial safety students at Prestige Institute Dharwad.',
    keywords: ['hotel management career guidance', 'fire safety career guidance', 'Prestige Institute Dharwad news'],
  },
  'student-portal': {
    title: 'Student Portal — Check Exam Results | Prestige Institute',
    description:
      'Prestige Institute Dharwad students: log in with your Registration Number and date of birth to view and print your examination result.',
    keywords: ['Prestige Institute Dharwad result', 'Prestige Institute student portal'],
  },
}
