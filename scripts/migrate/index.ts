/**
 * One-time import of prestigeinstitutedharwad.in (WordPress) into Payload.
 *
 *   pnpm migrate              → import everything (safe to re-run; pages/posts are replaced, images reused)
 *   MIGRATE_REFRESH=1 pnpm migrate → also re-download the WordPress API data (picks up new posts)
 */
import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { buildPages } from './content'
import {
  UPLOADS,
  decode,
  fetchFile,
  fetchJSON,
  h,
  log,
  root,
  rt,
  stripTags,
  fixPastedMarkdown,
  swapMediaMarkers,
  tokenizePost,

  upload,
  WP,
} from './lib'

type WPPost = {
  id: number
  slug: string
  date: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
  categories: number[]
  yoast_head_json?: { description?: string; og_description?: string }
}
type WPMedia = { id: number; source_url: string; alt_text: string }
type WPCategory = { id: number; name: string; slug: string }

const ENQUIRY_EMAIL = process.env.ENQUIRY_EMAIL || 'admin@prestigeinstitutedharwad.in'
const ctx = { disableRevalidate: true }

async function clear(payload: Payload, collection: Parameters<Payload['delete']>[0]['collection']) {
  await payload.delete({ collection, where: { id: { exists: true } }, context: ctx })
}

/* ───────────── Brand assets (favicon, social image) ───────────── */
async function brandAssets(payload: Payload) {
  const logoFile = await fetchFile('2025/01/IMG-20240814-WA0029-removebg-preview-1.png')
  const trimmed = path.resolve('.migration-cache/logo-mark.png')
  await sharp(logoFile).trim().toFile(trimmed)

  const appDir = path.resolve('src/app/(frontend)')
  await sharp(trimmed).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(appDir, 'icon.png'))
  await sharp(trimmed)
    .resize(150, 150, { fit: 'contain', background: '#ffffff' })
    .extend({ top: 15, bottom: 15, left: 15, right: 15, background: '#ffffff' })
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'))

  // 1200×630 social sharing image
  const mark = await sharp(trimmed).resize(260, 260, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#081237"/><stop offset=".5" stop-color="#121b55"/><stop offset="1" stop-color="#2639ae"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <circle cx="1120" cy="80" r="220" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="60"/>
    <rect x="80" y="170" width="300" height="300" rx="40" fill="#fff"/>
    <text x="440" y="270" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#fff">PRESTIGE INSTITUTE</text>
    <text x="440" y="340" font-family="Arial, Helvetica, sans-serif" font-size="40" letter-spacing="12" fill="#cfd6ff">DHARWAD</text>
    <text x="440" y="420" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#fff">Hotel &amp; Tourism · Fire &amp; Industrial Safety</text>
    <text x="440" y="465" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#ff8a93">100% Placement Assistance · Admissions Open</text>
  </svg>`
  await sharp(Buffer.from(svg))
    .composite([{ input: mark, left: 100, top: 190 }])
    .jpeg({ quality: 88 })
    .toFile(path.resolve('public/og-default.jpg'))

  for (const f of ['favicon.ico', 'favicon.svg', 'website-template-OG.webp']) {
    const p = path.resolve('public', f)
    if (fs.existsSync(p)) fs.rmSync(p)
  }

  const logo = await upload(payload, '2025/01/IMG-20240814-WA0029-removebg-preview-1.png', 'Prestige Institute Dharwad logo')
  log('brand assets written (icon.png, apple-icon.png, og-default.jpg)')
  return logo
}

/* ───────────── Courses ───────────── */
async function importCourses(payload: Payload) {
  await clear(payload, 'courses')
  const img = (p: string, alt: string) => upload(payload, p, alt)
  const split = (items: string[]) =>
    items.map((t) => {
      const [title, ...rest] = t.split(':')
      return { title: title.trim(), description: rest.join(':').trim() }
    })

  const hotel = await payload.create({
    collection: 'courses',
    context: ctx,
    data: {
      title: 'One-Year Diploma in Hotel and Tourism Management',
      shortTitle: 'Hotel and Tourism Management',
      slug: 'hotel-and-tourism-management',
      generateSlug: false,
      category: 'hotel-tourism',
      order: 1,
      summary:
        'Equips students with the skills and knowledge to thrive in the dynamic hospitality industry, with hands-on training in hotel operations, customer service and management.',
      image: await img('2025/04/WhatsApp-Image-2025-04-17-at-11.56.08-AM-300x200.jpeg', 'Hotel and Tourism Management students'),
      highlights: [{ text: 'Practical Learning' }, { text: 'Industry Exposure' }, { text: 'Career Opportunities' }],
      duration: '1 Year',
      eligibility: 'SSLC / PUC / ITI / Degree / Diploma etc.',
      mode: 'Classroom / Practical Sessions / Hybrid',
      certification: 'Recognized certification from BSS, Central Government of India',
      description: rt(
        'Our Hotel Management program equips students with the skills and knowledge to thrive in the dynamic hospitality industry. Emphasizing customer service, hotel operations, and management, the program offers hands-on training and real-world exposure. Students benefit from industry-relevant insights and guidance from experienced faculty. Graduates are well-prepared for diverse careers in hotel operations, event management, and food and beverage services, gaining a competitive edge in the global hospitality market.',
        'Ultimately, a course in Hotel and Tourism Management is suitable for those who have a passion for travel, customer service, and management, while also seeking a rewarding and dynamic career.',
      ) as never,
      whyChoose: split([
        'Growing Industry: The tourism and hospitality industry is one of the largest and fastest-growing sectors globally.',
        'Diverse Career Options: With a qualification in Hotel and Tourism Management, you can work in various roles, including hotel management, event planning, travel agencies, tour operators, tourism boards, and more.',
        'Global Perspective: This field allows you to work in different parts of the world, experiencing new cultures and markets.',
        'People-Centric Industry: If you enjoy working with people, this field is ideal. It allows you to engage with a variety of individuals, from guests to employees, and develop strong interpersonal skills.',
        'Creative and Strategic Thinking: Hotel and Tourism Management teaches you not only how to manage operations but also how to creatively enhance customer experiences.',
        'Impact on Local Economies: The tourism industry plays a significant role in boosting local economies, especially in areas that attract large numbers of visitors.',
        'Career Stability and Income Potential: The hospitality and tourism sectors tend to offer stable employment with opportunities for progression.',
      ]),
      whoShouldEnroll:
        'This program is ideal for individuals who are passionate about hospitality and looking to pursue a career in the dynamic world of hotel and tourism management.',
      careerOpportunities: [
        'Food & Beverage Manager', 'Executive Chef', 'Front Office Manager', 'Housekeeping Manager', 'Bar Manager',
        'Banquet Manager', 'Restaurant Manager', 'Sous Chef', 'Pastry Chef', 'Duty Manager',
      ].map((role) => ({ role })),
      meta: {
        title: 'Diploma in Hotel and Tourism Management in Dharwad | Prestige Institute',
        description:
          'One-year Diploma in Hotel and Tourism Management at Prestige Institute Dharwad — hands-on training, industry exposure and 100% placement assistance. Eligibility: SSLC/PUC/ITI/Degree.',
      },
    },
  })

  const fire = await payload.create({
    collection: 'courses',
    context: ctx,
    data: {
      title: 'One-Year Diploma in Fire and Industrial Safety Management',
      shortTitle: 'Fire and Industrial Safety Management',
      slug: 'fire-and-industrial-safety-management',
      generateSlug: false,
      category: 'fire-safety',
      order: 2,
      summary:
        'Specialized training in fire prevention, emergency response, risk assessment and industrial safety — for careers protecting lives, property and the environment.',
      image: await img('2025/04/WhatsApp-Image-2025-04-17-at-12.00.43-PM-300x200.jpeg', 'Fire and Industrial Safety students'),
      highlights: [{ text: 'Safety Training' }, { text: 'Risk Management' }, { text: 'Career Opportunities' }],
      duration: '1 Year',
      eligibility: 'SSLC / PUC / ITI / Degree / Diploma etc.',
      mode: 'Classroom / Practical Sessions / Hybrid',
      certification: 'Recognized certification from BSS, Central Government of India',
      description: rt(
        'Our Fire & Safety programme offers specialized training to ensure the safety and well-being of individuals in both public and private settings. With a focus on prevention, emergency response, and fire safety protocols, our courses are designed to create knowledgeable professionals who can handle fire-related emergencies effectively. Our training programs are tailored for both beginners and those looking to upgrade their skills in fire safety and Hazard Identification and Risk Assessment (HIRA) activities.',
        'Choosing Fire and Industrial Safety Management as a course can be an excellent decision for several key reasons, especially if you’re interested in risk management, protecting lives, and ensuring safe working environments.',
      ) as never,
      whyChoose: split([
        'Critical Role in Industrial Environments: Industries such as manufacturing, oil and gas, chemicals, and construction often deal with hazardous materials, machinery, and processes.',
        'High Demand for Skilled Professionals: As industries grow and develop, the need for professionals who can manage and mitigate safety risks also increases.',
        'Job Stability and Security: Safety management is a non-negotiable aspect of every workplace, especially in high-risk industries.',
        'Lucrative Career Opportunities: As industrial safety management is a critical function, experts in this field are well-compensated, especially those who have specialized knowledge or experience.',
        'Protecting Lives and Property: By managing safety and fire risks in industrial settings, professionals help prevent accidents that could lead to injuries or fatalities.',
        'Comprehensive Knowledge of Risk Management: The course provides in-depth knowledge of fire prevention, risk assessments, emergency response, and industrial safety protocols.',
        'Compliance with Legal and Regulatory Standards: Fire and industrial safety management professionals ensure that organizations comply with local, national, and international safety standards and regulations.',
        'Practical Skills in Crisis Management: The course prepares you to handle high-pressure situations during emergencies.',
        'Global Opportunities: As industries worldwide face similar safety challenges, your skills in fire and industrial safety management are transferable across borders.',
        'Environmental Impact and Sustainability: In addition to safety, the course often focuses on sustainability and environmental safety.',
        'Personal Fulfillment and Responsibility: This course offers the opportunity to have a direct and meaningful impact on people’s lives, the environment, and business operations.',
      ]),
      whoShouldEnroll:
        'Individuals who are passionate about safety, risk management, and making a positive impact in high-risk environments.',
      careerOpportunities: [
        'Fire Safety Officer', 'Industrial Safety Manager', 'Construction Safety Manager', 'EHS Officer',
        'Risk Assessment Specialist', 'Safety Auditor', 'Emergency Response Co-ordinator',
      ].map((role) => ({ role })),
      conclusion:
        'Fire and Industrial Safety Management is an ideal course for individuals who are passionate about safety, risk management, and making a positive impact in high-risk environments. It offers not only job security and financial stability but also the opportunity to protect lives, reduce accidents, and contribute to sustainable industrial practices. With growing job demand and career progression, this field provides an exciting and rewarding career path.',
      meta: {
        title: 'Diploma in Fire and Industrial Safety Management in Dharwad | Prestige Institute',
        description:
          'One-year Diploma in Fire and Industrial Safety Management at Prestige Institute Dharwad — fire prevention, HIRA, emergency response and 100% placement assistance.',
      },
    },
  })
  log('courses: 2')
  return { hotel: hotel.id as number, fire: fire.id as number }
}

/* ───────────── Faculty ───────────── */
async function importFaculty(payload: Payload) {
  await clear(payload, 'faculty')
  const people: [string, string, string, boolean][] = [
    ['Raghvendra M. Anegundi', 'Managing Director', '2025/05/WhatsApp-Image-2025-04-11-at-5.49.31-PM-e1747030035877.jpeg', true],
    ['Rubiya A. Makandar', 'HOD', '2025/05/slot-2-e1747030194309.jpg', true],
    ['Prajwal Gorakindi', 'Hotel Management Faculty', '2025/04/slot-5-e1747031246642.jpg', true],
    ['Anuraj R. Bagalkot', 'Hotel Management Faculty', '2025/05/20124509-84b4-4493-936f-de8d8b4e6806-scaled-e1746602691618.jpg', true],
    ['DavalMalik L. Kustagi', 'PRO', '2026/07/DSC02286.JPG-scaled-e1784881058950.jpeg', true],
    ['Sunil G. Rangapur', 'BDO', '2025/05/IMG-20250506-WA0007-e1746601352581.jpg', true],
    // Photos on the live Faculty page without a name — hidden until the institute adds names.
    ['Staff member (name needed)', 'Faculty', '2026/07/DSC02282.JPG-scaled-e1784881185438.jpeg', false],
    ['Staff member (name needed)', 'Faculty', '2026/07/DSC02279.JPG-scaled-e1784881234289.jpeg', false],
    ['Staff member (name needed)', 'Faculty', '2026/07/DSC02290.JPG-scaled-e1784880352593.jpeg', false],
    ['Staff member (name needed)', 'Faculty', '2026/07/DSC02292.JPG-scaled-e1784880426454.jpeg', false],
    ['Staff member (name needed)', 'Faculty', '2026/07/DSC02280.JPG-scaled-e1784880955614.jpeg', false],
    ['Staff member (name needed)', 'Faculty', '2026/07/DSC02285.JPG-scaled-e1784880999766.jpeg', false],
  ]
  for (const [i, [name, role, photo, visible]] of people.entries()) {
    await payload.create({
      collection: 'faculty',
      context: ctx,
      data: { name, role, order: i + 1, visible, photo: await upload(payload, photo, visible ? `${name}, ${role}` : 'Faculty member') },
    })
  }
  log(`faculty: ${people.length} (6 hidden until named)`)
}

/* ───────────── Recruiters ───────────── */
const hotelRecruiters: Record<number, string> = {
  17: 'Southern Star Hotels', 18: 'Shangri-La Hotels and Resorts', 19: 'Sarovar Hotels & Resorts', 20: 'Royal Sea Resort',
  21: 'Radisson Hotel Group', 22: 'Royal Orchid Resorts', 23: 'The Ocean Pearl', 24: 'Nicko Cruises', 25: 'Novotel',
  26: 'Mastiff Hotel', 27: 'Marriott Hotels & Resorts', 28: 'Lemon Tree Hotels', 29: 'Kyriad Hotel', 30: 'Le Méridien',
  31: 'Paul John Resorts & Hotels', 32: 'Fortune Hotels', 16: 'Sterling Holidays', 15: 'Taj Hotels', 14: 'The Great Indian Hotels',
  13: 'The Clarks Hotels & Resorts', 12: 'Wonderla Parks and Resorts', 11: 'Zuri Hotels & Resorts', 10: 'Accor', 9: 'CGH Earth',
  8: 'The Chancery Hotels', 7: 'Club Mahindra', 6: 'Costa Cruises', 5: 'Evolve Back Resorts', 4: 'Fern Hotels & Resorts',
  3: 'Goldfinch Hotels', 2: 'Hilton Hotels & Resorts', 1: 'Hyatt',
}
const safetyRecruiters: Record<number, string> = {
  17: 'Larsen & Toubro', 18: 'Jockey', 21: 'ITC Limited', 22: 'Infosys', 23: 'Industry Partner', 25: 'Honda',
  26: 'Gokaldas Exports Limited', 27: 'Harsh Constructions Pvt. Ltd.', 28: 'GAIL', 29: 'Cisco', 30: 'Cipla', 31: 'Amazon',
  32: 'Bosch', 19: 'Kalyani Developers', 20: 'Jindal Steel & Power', 16: 'Kumar Organic Products Limited', 15: 'Mercedes-Benz',
  14: 'MFAR Constructions', 13: 'Nirani Sugars', 12: 'ONGC MRPL', 11: 'Myntra', 10: 'Om Sai Intex Pvt. Ltd.',
  9: 'Reserve Bank of India', 8: 'Shahi Exports', 7: 'Tata Motors', 6: 'Sobha', 5: 'Tata Marcopolo', 4: 'Toyota',
  3: 'Vega Helmets', 2: 'West Coast Paper Mills Ltd.', 1: 'Wipro',
}

async function importRecruiters(payload: Payload) {
  await clear(payload, 'recruiters')
  let order = 0
  const add = async (map: Record<number, string>, suffix: string, category: 'hotel-tourism' | 'fire-safety') => {
    for (const [n, name] of Object.entries(map)) {
      await payload.create({
        collection: 'recruiters',
        context: ctx,
        data: { name, category, order: ++order, logo: await upload(payload, `2025/05/New-Project${n}${suffix}.png`, `${name} logo`) },
      })
    }
  }
  await add(hotelRecruiters, '', 'hotel-tourism')
  await add(safetyRecruiters, '-1', 'fire-safety')
  log(`recruiters: ${order}`)
}

/* ───────────── Gallery ───────────── */
async function importGallery(payload: Payload) {
  const items: [string, 'hotel-tourism' | 'fire-safety', string][] = [
    ['2025/02/fire-students-sitting-scaled.jpg', 'fire-safety', 'Fire & safety students in class'],
    ['2025/04/55A4173-scaled.jpg', 'fire-safety', 'Fire & industrial safety training'],
    ['2025/02/food-scaled.jpg', 'hotel-tourism', 'Plated dish prepared by students'],
    ['2025/02/chefs-2-1-scaled.jpg', 'hotel-tourism', 'Culinary students in the kitchen'],
    ['2025/02/table-scaled.jpg', 'hotel-tourism', 'Table setting practical'],
    ['2025/02/food-2-scaled.jpg', 'hotel-tourism', 'Food presentation practical'],
    ['2025/02/fire-scaled.jpg', 'fire-safety', 'Fire-fighting drill'],
    ['2025/02/fire-students-4-scaled.jpg', 'fire-safety', 'Fire safety students during practicals'],
    ['2025/02/fire-student-2-scaled.jpg', 'fire-safety', 'Student operating fire safety equipment'],
    ['2025/02/cooking-scaled.jpg', 'hotel-tourism', 'Cooking practical'],
    ['2025/02/chef-students-scaled.jpg', 'hotel-tourism', 'Chef students'],
    ['2025/02/chefs-3-scaled.jpg', 'hotel-tourism', 'Culinary training session'],
    ['2025/02/chefs-4-1-scaled.jpg', 'hotel-tourism', 'Culinary students at work'],
    ['2025/02/fire-students-5-scaled.jpg', 'fire-safety', 'Fire safety students outdoors'],
    ['2025/02/fire-sir-teaching-2-1-scaled.jpg', 'fire-safety', 'Faculty demonstrating fire safety'],
    ['2025/02/fire-students-6-scaled.jpg', 'fire-safety', 'Fire safety field training'],
  ]
  for (const [file, category, alt] of items.reverse()) {
    await upload(payload, file, alt, 'gallery', { category })
  }
  log(`gallery: ${items.length}`)
}

/* ───────────── Forms ───────────── */
const courseOptions = [
  { label: 'Diploma in Hotel and Tourism Management', value: 'Hotel and Tourism Management' },
  { label: 'Diploma in Fire and Industrial Safety Management', value: 'Fire and Industrial Safety Management' },
]

const notify = (subject: string) => [
  {
    emailTo: ENQUIRY_EMAIL,
    replyTo: '{{email}}',
    subject,
    message: root(h('h3', subject), rt('Details submitted on the website:').root.children[0] as never, rt('{{*:table}}').root.children[0] as never),
  },
]

async function importForms(payload: Payload) {
  await clear(payload, 'form-submissions')
  await clear(payload, 'forms')
  const thanks = (msg: string) => root(h('h3', 'Thank you!'), rt(msg).root.children[0] as never)

  const contact = await payload.create({
    collection: 'forms',
    context: ctx,
    data: {
      title: 'Contact form',
      submitButtonLabel: 'Send Message',
      confirmationType: 'message',
      confirmationMessage: thanks('We have received your message. Our team will contact you shortly.') as never,
      emails: notify('New website enquiry from {{full_name}}') as never,
      fields: [
        { blockType: 'text', name: 'full_name', label: 'Name', required: true, width: 50 },
        { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Phone number', required: true, width: 50 },
        { blockType: 'select', name: 'course', label: 'Interested in', options: courseOptions, required: false, width: 50 },
        { blockType: 'textarea', name: 'message', label: 'Comment or Message', required: false, width: 100 },
      ],
    } as never,
  })

  const enquiry = await payload.create({
    collection: 'forms',
    context: ctx,
    data: {
      title: 'Admission enquiry',
      submitButtonLabel: 'Request a Call Back',
      confirmationType: 'message',
      confirmationMessage: thanks('Our admissions team will call you back soon.') as never,
      emails: notify('Admission enquiry from {{first_name}} {{last_name}}') as never,
      fields: [
        { blockType: 'text', name: 'first_name', label: 'First name', required: true, width: 50 },
        { blockType: 'text', name: 'last_name', label: 'Last name', required: true, width: 50 },
        { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Phone number', required: true, width: 50 },
        { blockType: 'select', name: 'course', label: 'Course', options: courseOptions, required: true, width: 100 },
      ],
    } as never,
  })

  const edu = (cls: string) =>
    [
      ['year', 'Year of passing'],
      ['institution', 'Institution'],
      ['board', 'Board'],
      ['percentage', 'Percentage / Grade'],
    ].map(([k, l]) => ({ blockType: 'text', name: `${cls}_${k}`, label: `${cls === 'tenth' ? '10th' : '12th'} – ${l}`, required: cls === 'tenth', width: 25 }))

  const apply = await payload.create({
    collection: 'forms',
    context: ctx,
    data: {
      title: 'Apply Online — Admission form',
      submitButtonLabel: 'Submit Application',
      confirmationType: 'message',
      confirmationMessage: thanks('Your application has been submitted. Our admissions office will contact you with the next steps.') as never,
      emails: notify('New online application: {{first_name}} {{last_name}}') as never,
      fields: [
        { blockType: 'message', message: root(h('h3', 'Student details')) },
        { blockType: 'text', name: 'first_name', label: 'First name', required: true, width: 50 },
        { blockType: 'text', name: 'last_name', label: 'Last name', required: true, width: 50 },
        { blockType: 'date', name: 'date_of_birth', label: 'Date of birth', required: true, width: 50 },
        { blockType: 'email', name: 'email', label: 'Email', required: true, width: 50 },
        { blockType: 'select', name: 'course', label: 'Course', options: courseOptions, required: true, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Your contact no.', required: true, width: 50 },
        { blockType: 'text', name: 'location', label: 'Location', required: true, width: 50 },
        { blockType: 'text', name: 'pincode', label: 'Pincode', required: true, width: 50 },
        { blockType: 'textarea', name: 'permanent_address', label: 'Permanent address', required: true, width: 100 },
        { blockType: 'message', message: root(h('h3', 'Parent details')) },
        { blockType: 'text', name: 'father_name', label: "Father's name", required: true, width: 50 },
        { blockType: 'text', name: 'father_occupation', label: "Father's occupation", required: false, width: 50 },
        { blockType: 'text', name: 'mother_name', label: "Mother's name", required: true, width: 50 },
        { blockType: 'text', name: 'mother_occupation', label: "Mother's occupation", required: false, width: 50 },
        { blockType: 'text', name: 'father_phone', label: "Father's contact no.", required: false, width: 50 },
        { blockType: 'text', name: 'mother_phone', label: "Mother's contact no.", required: false, width: 50 },
        { blockType: 'message', message: root(h('h3', 'Education details')) },
        ...edu('tenth'),
        ...edu('twelfth'),
      ],
    } as never,
  })

  log('forms: 3')
  return { contact: contact.id as number, enquiry: enquiry.id as number, apply: apply.id as number }
}

/* ───────────── Blog ───────────── */
async function importBlog(payload: Payload) {
  await clear(payload, 'posts')
  await clear(payload, 'categories')

  const wpCats = await fetchJSON<WPCategory[]>(`${WP}/wp-json/wp/v2/categories?per_page=100`)
  const catMap = new Map<number, number>()
  for (const c of wpCats) {
    const title = decode(c.name) === 'Blog' ? 'News & Updates' : decode(c.name)
    const doc = await payload.create({ collection: 'categories', context: ctx, data: { title, slug: c.slug === 'blog' ? 'news' : c.slug } as never })
    catMap.set(c.id, doc.id as number)
  }

  const posts = await fetchJSON<WPPost[]>(
    `${WP}/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,date,title,content,excerpt,featured_media,categories,yoast_head_json`,
  )
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const redirects: { from: string; to: string }[] = []

  for (const post of posts) {
    let heroImage: number | undefined
    let heroFile = ''
    if (post.featured_media) {
      try {
        const m = await fetchJSON<WPMedia>(`${WP}/wp-json/wp/v2/media/${post.featured_media}?_fields=id,source_url,alt_text`)
        heroImage = await upload(payload, m.source_url, decode(m.alt_text || post.title.rendered))
        heroFile = path.basename(m.source_url).replace(/-\d+x\d+(?=\.)/, '')
      } catch (e) {
        log(`  ! featured image missing for ${post.slug}`, (e as Error).message)
      }
    }

    const htmlParts: string[] = []
    for (const t of tokenizePost(post.content.rendered)) {
      if (t.kind === 'html') htmlParts.push(t.html)
      else {
        const base = path.basename(t.src).replace(/-\d+x\d+(?=\.)/, '')
        if (base === heroFile) continue // already shown as the post's main image
        try {
          const id = await upload(payload, t.src, t.alt || decode(post.title.rendered))
          if (!heroImage) {
            heroImage = id
            heroFile = base
          } else htmlParts.push(`<p>@@MEDIA:${id}@@</p>`)
        } catch (e) {
          log(`  ! inline media skipped in ${post.slug}`, (e as Error).message)
        }
      }
    }

    const content = fixPastedMarkdown(swapMediaMarkers(
      convertHTMLToLexical({ editorConfig, html: htmlParts.join('\n') || '<p></p>', JSDOM }) as never,
    ))

    // Emoji in a few old slugs → clean slug + redirect from the old address.
    const oldSlug = decodeURIComponent(post.slug)
    const slug = oldSlug.replace(/[^\p{L}\p{N}-]+/gu, '').replace(/-{2,}/g, '-').replace(/^-|-$/g, '')
    if (slug !== oldSlug) redirects.push({ from: `/${oldSlug}`, to: `/${slug}` })

    const title = decode(post.title.rendered).replace(/\s+/g, ' ').trim()
    const description =
      post.yoast_head_json?.description ||
      post.yoast_head_json?.og_description ||
      stripTags(post.excerpt.rendered).replace(/\s*\[…\]$/, '')
    const firstText = stripTags(htmlParts.find((p) => p.startsWith('<p>') && !p.includes('@@MEDIA')) || '')

    await payload.create({
      collection: 'posts',
      context: ctx,
      draft: false,
      data: {
        title,
        slug,
        generateSlug: false,
        _status: 'published',
        publishedAt: new Date(`${post.date}+05:30`).toISOString(),
        heroImage,
        content: content as never,
        categories: post.categories.map((c) => catMap.get(c)).filter(Boolean) as number[],
        meta: {
          title: `${title} | Prestige Institute Dharwad`,
          description: (description || firstText).slice(0, 160),
          image: heroImage,
        },
      } as never,
    })
  }
  log(`posts: ${posts.length}`)
  return redirects
}

/* ───────────── Globals ───────────── */
async function importGlobals(payload: Payload, logo: number, courses: { hotel: number; fire: number }) {
  await payload.updateGlobal({
    slug: 'site-settings',
    context: ctx,
    data: {
      siteName: 'Prestige Institute Dharwad',
      tagline: 'Hotel & Tourism · Fire & Industrial Safety Management',
      logo,
      footerAbout:
        "North Karnataka's institute for specialized education in Hotel & Tourism and Fire & Industrial Safety Management — shaping career-ready professionals in Hubli-Dharwad.",
      announcement: {
        enabled: true,
        text: 'Admissions Are Open Now for 2026-27 | Hotel and Fire Safety Management, Hubli - Dharwad.',
        linkLabel: 'Apply Now',
        linkUrl: '/apply-online',
      },
      phones: [{ number: '+91 90364 42221' }, { number: '+91 73491 59198' }],
      emails: [{ email: 'prestigeinstitutedharwad@gmail.com' }, { email: 'admin@prestigeinstitutedharwad.in' }],
      address: '2nd Floor, Akalwadi Complex, Near Toll Naka,\nOpp. Modern Hall, P.B. Road,\nDharwad – 580004, Karnataka',
      officeHours: 'Monday – Saturday · 10:30am – 1:30pm, 2:30pm – 4:30pm',
      mapEmbedUrl: 'https://www.google.com/maps?q=Akalwadi+Complex,+P.B.+Road,+Dharwad+580004&output=embed',
      socials: [
        { platform: 'facebook', url: 'https://www.facebook.com/prestigeinstitutedharwad/' },
        { platform: 'instagram', url: 'https://www.instagram.com/prestige_institute_/' },
        { platform: 'linkedin', url: 'https://www.linkedin.com/in/prestige-institute-hotel-management-411361307' },
      ],
      copyrightName: 'Prestige Institute Dharwad. All Rights Reserved.',
      creditLabel: 'Dark Elite Creations',
      creditUrl: 'https://darkelitecreations.com/',
    } as never,
  })

  const c = (label: string, url: string) => ({ link: { type: 'custom', url, label, newTab: false } })
  const course = (label: string, id: number) => ({
    link: { type: 'reference', reference: { relationTo: 'courses', value: id }, label, newTab: false },
  })

  await payload.updateGlobal({
    slug: 'header',
    context: ctx,
    data: {
      navItems: [
        {
          ...c('About Us', '/about-prestige'),
          subItems: [
            c('About Prestige', '/about-prestige'),
            c('Vision & Mission', '/vision-mission'),
            c("Director's Message", '/directors-message'),
            c('Affiliations', '/affiliations'),
            c('Faculty', '/faculty'),
          ],
        },
        {
          ...c('Courses', '/courses'),
          subItems: [c('All Courses', '/courses'), course('Hotel & Tourism Management', courses.hotel), course('Fire & Industrial Safety', courses.fire)],
        },
        c('Admissions', '/admissions'),
        c('Gallery', '/gallery'),
        c('Placements', '/placements'),
        c('Blog', '/blog'),
        c('Contact Us', '/contact-us'),
      ],
      topLinks: [c('Student Portal', '/student-portal')],
      cta: { link: { type: 'custom', url: '/apply-online', label: 'Apply Online', newTab: false } },
    } as never,
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: ctx,
    data: {
      columns: [
        {
          title: 'Quick Links',
          navItems: [
            c('About Us', '/about-prestige'),
            c('Admissions', '/admissions'),
            c('Gallery', '/gallery'),
            c('Placements', '/placements'),
            c('Blog', '/blog'),
            c('Contact Us', '/contact-us'),
          ],
        },
        {
          title: 'Programmes',
          navItems: [
            course('Hotel & Tourism', courses.hotel),
            course('Fire & Industrial Safety', courses.fire),
            c('Apply Online', '/apply-online'),
            c('Student Portal', '/student-portal'),
          ],
        },
      ],
    } as never,
  })
  log('settings, header and footer updated')
}

/* ───────────── Redirects for old WordPress URLs ───────────── */
async function importRedirects(payload: Payload, extra: { from: string; to: string }[]) {
  await clear(payload, 'redirects')
  const list = [
    { from: '/home', to: '/' },
    { from: '/prestige-institute-hotel-fire-safety-management-in-dharwad', to: '/' },
    { from: '/demo', to: '/' },
    { from: '/old-about-prestige', to: '/about-prestige' },
    { from: '/old-vision-mission', to: '/vision-mission' },
    { from: '/old-courses', to: '/courses' },
    { from: '/old-admissions', to: '/admissions' },
    { from: '/old-placement', to: '/placements' },
    { from: '/posts', to: '/blog' },
    ...extra,
  ]
  for (const r of list) {
    await payload.create({
      collection: 'redirects',
      context: ctx,
      data: { from: r.from, to: { type: 'custom', url: r.to } } as never,
    })
  }
  log(`redirects: ${list.length}`)
}

/* ───────────── Demo student (so the portal can be tried out) ───────────── */
async function demoStudent(payload: Payload, hotelCourse: number) {
  await clear(payload, 'results')
  await clear(payload, 'students')
  const student = await payload.create({
    collection: 'students',
    data: { regNo: 'DEMO001', name: 'Demo Student (delete me)', dob: '2005-01-15T12:00:00.000Z', course: hotelCourse, batch: '2025-26', fatherName: 'Demo Parent' },
  })
  await payload.create({
    collection: 'results',
    data: {
      student: student.id,
      examName: 'Final Examination 2025-26',
      published: true,
      declaredOn: '2026-06-30T12:00:00.000Z',
      subjects: [
        { subject: 'Food Production', maxMarks: 100, passMarks: 35, marksObtained: 82 },
        { subject: 'Food & Beverage Service', maxMarks: 100, passMarks: 35, marksObtained: 76 },
        { subject: 'Front Office Operations', maxMarks: 100, passMarks: 35, marksObtained: 71 },
        { subject: 'Housekeeping', maxMarks: 100, passMarks: 35, marksObtained: 68 },
        { subject: 'Practical Examination', maxMarks: 100, passMarks: 35, marksObtained: 88 },
      ],
    } as never,
  })
  log('demo student DEMO001 / 15-01-2005 created')
}

/* ───────────── Run ───────────── */
async function run() {
  const payload = await getPayload({ config })
  const started = Date.now()

  const logo = await brandAssets(payload)
  const courses = await importCourses(payload)
  await importFaculty(payload)
  await importRecruiters(payload)
  await importGallery(payload)
  const forms = await importForms(payload)
  const postRedirects = await importBlog(payload)
  await importGlobals(payload, logo, courses)

  await clear(payload, 'pages')
  const pages = await buildPages({ img: (p, alt) => upload(payload, p, alt), forms, courses })
  for (const page of pages) {
    await payload.create({
      collection: 'pages',
      context: ctx,
      draft: false,
      data: { ...page, _status: 'published', generateSlug: false, publishedAt: new Date().toISOString() } as never,
    })
  }
  log(`pages: ${pages.length}`)

  await importRedirects(payload, postRedirects)
  await demoStudent(payload, courses.hotel)

  // The running site caches redirects/globals; drop that cache so the imported content shows immediately.
  for (const dir of ['.next/cache/fetch-cache', '.next/dev/cache/fetch-cache']) {
    fs.rmSync(path.resolve(dir), { recursive: true, force: true })
  }

  log(`done in ${Math.round((Date.now() - started) / 1000)}s — uploads base was ${UPLOADS}`)
  process.exit(0)
}

// `payload run` exits once this module finishes loading, so wait for the import here.
try {
  await run()
} catch (e) {
  console.error(e)
  process.exit(1)
}
