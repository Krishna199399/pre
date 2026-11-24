/**
 * Page content for the new site, mapped section by section from the live WordPress pages.
 * Wording is kept from the original; only spelling mistakes were fixed
 * ("practicol", "leaming", "acrocs", "Managerment", "Coreer", "Practicle").
 */
import { h, root, rt, ul } from './lib'

type Img = (path: string, alt: string) => Promise<number>
export type Ctx = {
  img: Img
  forms: { contact: number; enquiry: number; apply: number }
  courses: { hotel: number; fire: number }
}

const link = (label: string, url: string, appearance: 'default' | 'outline' = 'default') => ({
  link: { type: 'custom' as const, url, label, appearance, newTab: false },
})

const refCourse = (label: string, id: number) => ({
  type: 'reference' as const,
  reference: { relationTo: 'courses' as const, value: id },
  label,
  newTab: false,
})

const cta = (heading: string, text: string) => ({
  blockType: 'cta',
  richText: root(h('h2', heading), { ...rt(text).root.children[0] }),
  links: [link('Apply Online', '/apply-online'), link('Talk to us', '/contact-us', 'outline')],
})

/** Side panel on the Apply Online page. */
const applyIntro = () =>
  root(
    h('h3', 'Before you start'),
    ul([
      'Keep your **10th marks card** (and 12th, if you have it) handy.',
      'Write your name exactly as on your **10th standard certificate**.',
      'It takes about **5 minutes** — fields marked * are required.',
      'Our admissions team will call you to confirm the next steps.',
    ]),
    rt('Need help? Call **+91 90364 42221**, Monday – Saturday, 10:30am – 4:30pm.').root.children[0] as never,
  )

export async function buildPages({ img, forms, courses }: Ctx) {
  const pages: Record<string, unknown>[] = []

  /* ───────── Home ───────── */
  pages.push({
    title: 'Home',
    slug: 'home',
    hero: {
      type: 'home',
      eyebrow: 'Admissions Open 2026-27',
      heading: 'Prestige Institute Dharwad',
      text: "North Karnataka's leading institute for specialized education in Hotel & Tourism and Fire & Industrial Safety Management. Prestige Institute is committed to shaping career-ready professionals in Hubli-Dharwad — we offer expert mentorship, hands-on training, and a pathway to excellence.",
      links: [link('Apply Online', '/apply-online'), link('Contact Us', '/contact-us', 'outline')],
      highlights: [
        { text: 'Hotel & Tourism Management' },
        { text: 'Fire & Industrial Safety Management' },
        { text: '100% Placement Assistance' },
        { text: 'Certification from BSS, Govt. of India' },
      ],
      // Same background slideshow as the original site
      slides: [
        await img('2026/07/BBB.jpg.jpeg', 'Fire & industrial safety students checking equipment'),
        await img('2026/07/Untitled-design-4.jpg.jpeg', 'Hotel & tourism graduates at a hotel reception'),
      ],
      media: await img('2026/06/ChatGPTImageJun11202601_10_56P.jpeg', 'Students at Prestige Institute Dharwad'),
    },
    layout: [
      {
        blockType: 'featureCards',
        eyebrow: 'Programmes',
        heading: 'What We Offer',
        style: 'cards',
        imageFit: 'contain',
        columns: '3',
        background: 'white',
        items: [
          {
            title: 'Hotel and Tourism',
            text: 'A course in Hotel and Tourism Management at a recognized college and institute equips students with essential skills for a thriving career in the hospitality industry. It fosters personal growth, supports economic development, and prepares graduates for real-world challenges in a fast-evolving global sector.',
            image: await img('2026/06/Untitled-design-e1781090610441.png', 'Hotel and Tourism Management students'),
            enableLink: true,
            link: refCourse('Learn More', courses.hotel),
          },
          {
            title: '100% Job Assurance',
            text: 'At Prestige Institute Dharwad, a leading college for career-focused education, we believe learning should lead to success. That’s why we offer 100% Job Assurance, empowering students with industry-relevant skills and confidence. We’re committed to not just education, but building your future in the professional world.',
            image: await img('2026/06/Untitled-design-1-e1781091620659.png', '100% job assurance'),
            enableLink: true,
            link: { type: 'custom', url: '/placements', label: 'Learn More', newTab: false },
          },
          {
            title: 'Fire and Industrial Safety',
            text: 'Fire and Safety Management plays a key role in protecting lives, property, and the environment. Prestige Institute Dharwad provides expert training and recognized certification, preparing students for excellent job prospects, global recognition, and long-term career success in this vital and growing industry.',
            image: await img('2026/06/Untitled-design-2-e1781091802134.png', 'Fire and Industrial Safety students'),
            enableLink: true,
            link: refCourse('Learn More', courses.fire),
          },
        ],
      },
      {
        blockType: 'featureCards',
        eyebrow: 'Why Prestige',
        heading: 'Why Choose Us?',
        style: 'icon',
        columns: '3',
        background: 'muted',
        items: [
          { title: 'Hands-On Training', text: 'Real-world internships and projects to build practical skills and industry exposure.', image: await img('2026/06/Untitled-design-3.png', '') },
          { title: 'Industry-Relevant Curriculum', text: 'Practical learning aligned with modern industry needs.', image: await img('2026/06/Untitled-design-20.png', '') },
          { title: 'Expert Faculty', text: 'Learn from industry leaders and experienced professionals.', image: await img('2026/06/Untitled-design-21.png', '') },
          { title: '100% Placement Assistance', text: 'Kickstart your career with our dedicated placement support.', image: await img('2026/06/Untitled-design-22.png', '') },
          { title: 'Global Opportunities', text: 'Explore career possibilities across hotels, resorts, airlines, event management companies, and more.', image: await img('2026/06/Untitled-design-23.png', '') },
          { title: 'Career Growth', text: 'Build confidence, enhance skills, and achieve long-term success.', image: await img('2026/06/Untitled-design-24.png', '') },
        ],
      },
      {
        blockType: 'coursesShowcase',
        eyebrow: 'One-Year Diplomas',
        heading: 'Our Offered Courses',
        style: 'cards',
        background: 'white',
      },
      {
        blockType: 'recruiters',
        eyebrow: 'Placements',
        heading: 'Where our students work',
        intro: 'Our graduates are placed with leading hotel chains, resorts, cruise lines and industrial companies across India.',
        rows: 'split',
        background: 'white',
      },
      {
        blockType: 'contactSection',
        eyebrow: 'Get In Touch',
        heading: 'Ready to Build a Successful Career?',
        intro: "Whether you're interested in Hotel & Tourism Management or Fire & Industrial Safety, our expert team is here to guide you through admissions, training opportunities, and career pathways. Fill out the form and let's take the first step toward your future. ✨",
        form: forms.contact,
        showMap: false,
      },
    ],
    meta: {
      title: 'Prestige Institute Dharwad | Hotel Management & Fire Safety Institute in Hubli-Dharwad',
      description:
        "North Karnataka's leading institute for Hotel & Tourism and Fire & Industrial Safety Management diplomas in Hubli-Dharwad. Hands-on training, expert faculty and 100% placement assistance.",
    },
  })

  /* ───────── About Prestige ───────── */
  const aboutPhoto = await img('2026/07/DSC00365.JPG-1024x576.jpeg', 'Prestige Institute Dharwad campus')
  pages.push({
    title: 'About Prestige',
    slug: 'about-prestige',
    hero: {
      type: 'page',
      eyebrow: 'About Us',
      heading: 'About Prestige',
      text: 'Shaping career-ready professionals in Hotel & Tourism and Fire & Industrial Safety since day one — right here in Dharwad.',
      media: await img('2026/07/ChatGPT-Image-Jul-21-2026-03_40_19-PM.png', 'Hotel management students in chef whites at Prestige Institute'),
    },
    layout: [
      {
        blockType: 'splitContent',
        eyebrow: 'About Prestige',
        heading: 'Welcome to Prestige Institute Dharwad',
        content: rt(
          'Welcome to Prestige Institute Dharwad, a premier institution offering comprehensive education and training in Hotel and Tourism Management and Fire & Industrial Safety.',
          'Our institute is committed to providing high-quality programs that prepare individuals for successful careers in two critical sectors – hospitality and safety management.',
        ),
        image: aboutPhoto,
        imagePosition: 'left',
        imageStyle: 'landscape',
        background: 'white',
        links: [link('Explore Courses', '/courses'), link('Contact Us', '/contact-us', 'outline')],
      },
      {
        blockType: 'featureCards',
        style: 'icon',
        columns: '2',
        background: 'white',
        items: [
          { title: 'Industry-Oriented Curriculum', text: 'Designed to meet industry standards and evolving requirements.', image: await img('2026/07/build.png', '') },
          { title: 'Expert Faculty', text: 'Learn from experienced professionals and industry experts.', image: await img('2026/07/ChatGPT-Image-Jul-13-2026-04_10_12-PM.png', '') },
        ],
      },
      {
        blockType: 'featureCards',
        eyebrow: 'What guides us',
        heading: 'Our Values',
        intro: 'At Prestige Institute, we are guided by a set of core values that reflect our commitment to excellence, integrity, and the holistic development of our students. These values shape our educational approach and define the culture of our institution.',
        style: 'icon',
        columns: '2',
        background: 'muted',
        items: [
          { title: 'Excellence', icon: 'Award', text: 'We strive for the highest standards in everything we do. From our curriculum to our teaching methods and facilities, we are committed to providing a top-tier learning experience that ensures our students are well-prepared for success.' },
          { title: 'Collaboration', icon: 'Users', text: 'We believe in the power of teamwork and collaboration. Through strong partnerships with industry leaders, faculty, and peers, we create a learning environment that values diverse perspectives and collective success.' },
          { title: 'Integrity', icon: 'Scale', text: 'We uphold the highest ethical standards in all our actions, fostering a culture of trust, honesty, and respect. Our students and staff are encouraged to act with professionalism and moral responsibility at all times.' },
          { title: 'Respect for Diversity', icon: 'Globe', text: 'We celebrate diversity in all its forms and create an inclusive environment where individuals from different backgrounds can thrive. We believe that diverse perspectives enrich the learning experience and contribute to a global understanding of hospitality and safety.' },
          { title: 'Innovation', icon: 'Lightbulb', text: 'We embrace change and encourage creative thinking to address the challenges of the hospitality and safety industries. By fostering innovation, we ensure our students are adaptable, forward-thinking, and equipped to lead in a rapidly evolving world.' },
          { title: 'Continuous Learning', icon: 'BookOpen', text: 'We encourage lifelong learning, understanding that personal and professional growth doesn’t end with graduation. Our values of curiosity and self-improvement inspire both students and staff to pursue ongoing education and development.' },
          { title: 'Safety and Responsibility', icon: 'ShieldCheck', text: 'Our commitment to fire and safety education emphasizes the importance of protecting lives and property. We value responsibility in maintaining safe environments and preparing our students to be leaders in emergency management and safety practices.' },
          { title: 'Community Engagement', icon: 'HeartHandshake', text: 'We are committed to making a positive impact on the community, both locally and globally. Our institute actively participates in initiatives that promote social responsibility, sustainability, and the well-being of society.' },
        ],
      },
      {
        blockType: 'featureCards',
        eyebrow: 'Why Choose Us',
        heading: 'Our Facilities',
        intro: 'Experienced team of hospitality professionals with diverse expertise. Commitment to delivering measurable results and exceeding expectations.',
        style: 'icon',
        columns: '3',
        background: 'white',
        items: [
          { title: 'Qualified Teaching Faculties', icon: 'GraduationCap' },
          { title: 'Interview Techniques', icon: 'MessageSquare' },
          { title: 'Fees Installment Facilities', icon: 'Wallet' },
          { title: 'Individual Care', icon: 'HeartHandshake' },
          { title: 'Industrial Visits', icon: 'Bus' },
          { title: 'Free Wi-Fi', icon: 'Wifi' },
        ],
      },
      cta('Start your career with Prestige', 'Admissions are open for 2026-27. Apply online or visit the campus for a counselling session.'),
    ],
    meta: { description: 'Prestige Institute Dharwad offers comprehensive education and training in Hotel and Tourism Management and Fire & Industrial Safety in Hubli-Dharwad.' },
  })

  /* ───────── Vision & Mission ───────── */
  pages.push({
    title: 'Vision & Mission',
    slug: 'vision-mission',
    hero: {
      type: 'page',
      eyebrow: 'About Us',
      heading: 'Vision & Mission',
      text: 'What we stand for, and how we prepare every student for a successful career.',
      media: await img('2026/07/Untitled-design-2.jpg.jpeg', 'Hospitality professionals in a hotel lobby'),
    },
    layout: [
      {
        blockType: 'splitContent',
        eyebrow: 'Our Vision',
        heading: 'Vision',
        content: rt(
          'To be a premier institute committed to excellence in Hotel Management and Fire & Safety education, shaping future-ready professionals with global standards, ethical values, and a deep sense of responsibility. We strive to empower our students with the knowledge, skills, and leadership qualities necessary to thrive in the dynamic hospitality industry and critical safety sectors, contributing meaningfully to society and industry alike.',
        ),
        image: await img('2026/07/ChatGPT-Image-Jul-15-2026-12_20_46-PM-1024x661.png', 'Our vision'),
        imagePosition: 'right',
        imageStyle: 'landscape',
        background: 'white',
      },
      {
        blockType: 'splitContent',
        eyebrow: 'Our Mission',
        heading: 'Mission',
        content: rt(
          'Our mission is to provide exceptional education and training in the fields of Hotel Management and Fire & Safety, shaping the future of professionals who will lead these industries with expertise, integrity, and innovation.',
          'Our mission is to not only provide education but to inspire confidence, leadership, and a passion for service, safety, and hospitality in all those who walk through our doors.',
        ),
        image: await img('2026/07/ChatGPT-Image-Jul-15-2026-12_38_53-PM-1024x683.png', 'Our mission'),
        imagePosition: 'left',
        imageStyle: 'landscape',
        background: 'muted',
      },
    ],
    meta: { description: 'The vision and mission of Prestige Institute Dharwad — excellence in Hotel Management and Fire & Safety education.' },
  })

  /* ───────── Director's Message ───────── */
  pages.push({
    title: "Director's Message",
    slug: 'directors-message',
    hero: {
      type: 'page',
      eyebrow: 'About Us',
      heading: "Director's Message",
      text: 'A word to students and aspirants from the Managing Director of Prestige Institute.',
      // Tall photo → shown framed with a name tag built from the alt text ("Name, Role")
      media: await img('2025/05/WhatsApp-Image-2025-04-11-at-5.49.31-PM-e1747030035877.jpeg', 'Raghvendra M. Anegundi, Managing Director'),
    },
    layout: [
      {
        blockType: 'splitContent',
        eyebrow: "Director's Message",
        heading: 'Dear Students and Aspirants,',
        content: rt(
          'Welcome to Prestige Institute Dharwad — where your journey towards a successful and fulfilling career begins.',
          'At Prestige Institute, we are committed to delivering high-quality, career-focused education in the fields of Fire and Safety and Hotel Management. With proud affiliation to the Central Government of India, our diploma programs are designed to meet national standards and prepare students for real-world excellence.',
          'I am honored to share that we have already placed over **1000 students** in reputed companies, a reflection of our unwavering promise of **100% job placement**. Our dedication and impact in the field of education have also been recognized with two prestigious state awards — **Achievers of Karnataka** and **Suvarna Sadhakaru** — marking us as a leading institution in vocational training.',
          'Our expert faculty, practical training modules, and strong industry connections ensure that every student not only earns a diploma but also builds the confidence and skills needed to succeed in their career.',
          'Join Prestige Institute and take the first step toward a brighter, secure, and respected future.',
          'Warm regards,',
        ),
        signature: 'Raghavendra M Anegundi — Director, Prestige Institute',
        image: await img('2025/04/WhatsApp-Image-2025-04-11-at-5.49.31-PM-e1744889454498-682x1024.jpeg', 'Raghavendra M Anegundi, Director'),
        imagePosition: 'left',
        imageStyle: 'portrait',
        background: 'white',
      },
      {
        blockType: 'stats',
        background: 'navy',
        items: [
          { value: '1000+', label: 'Students placed' },
          { value: '100%', label: 'Job placement promise' },
          { value: '2', label: 'State awards' },
          { value: 'BSS', label: 'Central Govt. of India certification' },
        ],
      },
    ],
    meta: { description: 'A message from the Director of Prestige Institute Dharwad to students and aspirants.' },
  })

  /* ───────── Affiliations ───────── */
  pages.push({
    title: 'Affiliations',
    slug: 'affiliations',
    hero: {
      type: 'page',
      eyebrow: 'About Us',
      heading: 'Affiliations',
      text: 'Our diploma programmes are certified by Bharat Sevak Samaj (BSS), Central Government of India.',
      collage: [
        await img('2025/05/a4f08f69-3d06-4d98-8379-c558d270d27b-726x1024.jpg', 'Affiliation certificate'),
        await img('2025/05/495e6bfb-6694-4062-a207-1a938383a623-e1746518037493-1024x708.jpg', 'Affiliation certificate'),
        await img('2025/05/ba87fa35-a8b2-4b5e-b420-15bbc0099a0e-734x1024.jpg', 'Affiliation certificate'),
      ],
    },
    layout: [
      {
        blockType: 'imageGrid',
        eyebrow: 'Recognition',
        heading: 'Affiliations & Certifications',
        intro: 'Our diploma programmes carry recognised certification from BSS, Central Government of India. Select a certificate to view it larger.',
        columns: '3',
        background: 'white',
        images: [
          { image: await img('2025/05/a4f08f69-3d06-4d98-8379-c558d270d27b-726x1024.jpg', 'Affiliation certificate') },
          { image: await img('2025/05/495e6bfb-6694-4062-a207-1a938383a623-e1746518037493-1024x708.jpg', 'Affiliation certificate') },
          { image: await img('2025/05/ba87fa35-a8b2-4b5e-b420-15bbc0099a0e-734x1024.jpg', 'Affiliation certificate') },
          { image: await img('2025/05/f82e1884-64f9-4eed-a3b6-1cb66ece59b7-725x1024.jpg', 'Affiliation certificate') },
          { image: await img('2025/05/cf6a66ee-d20e-4602-91cf-bac84d0c6e3b-729x1024.jpg', 'Affiliation certificate') },
        ],
      },
    ],
    meta: { description: 'Affiliations and certifications of Prestige Institute Dharwad, including BSS, Central Government of India.' },
  })

  /* ───────── Faculty ───────── */
  pages.push({
    title: 'Faculty',
    slug: 'faculty',
    hero: {
      type: 'page',
      eyebrow: 'About Us',
      heading: 'Faculty',
      text: 'Meet the experienced team guiding our students in hospitality and safety.',
      collage: [
        await img('2025/05/slot-2-e1747030194309.jpg', ''),
        await img('2025/04/slot-5-e1747031246642.jpg', ''),
        await img('2025/05/20124509-84b4-4493-936f-de8d8b4e6806-scaled-e1746602691618.jpg', ''),
        await img('2025/05/IMG-20250506-WA0007-e1746601352581.jpg', ''),
      ],
    },
    layout: [
      {
        blockType: 'facultyGrid',
        eyebrow: 'Our Team',
        heading: 'Learn from experienced professionals',
        intro: 'Our faculty bring real hotel, hospitality and industrial safety experience into the classroom.',
        background: 'white',
      },
    ],
    meta: { description: 'Meet the faculty and staff of Prestige Institute Dharwad.' },
  })

  /* ───────── Courses ───────── */
  pages.push({
    title: 'Courses',
    slug: 'courses',
    hero: {
      type: 'page',
      heading: 'Courses',
      text: 'One-year diploma programmes in Hotel & Tourism Management and Fire & Industrial Safety Management.',
      media: await img('2026/07/new_coursesbg.png', 'Prestige Institute students in uniform'),
    },
    layout: [
      {
        blockType: 'featureCards',
        eyebrow: 'Why Prestige',
        heading: 'Why Choose This Program?',
        style: 'icon',
        columns: '4',
        background: 'white',
        items: [
          { title: 'Dual Expertise', icon: 'Sparkles', text: 'Gain specialized knowledge in both safety management and hospitality, increasing your career opportunities.' },
          { title: 'Industry-Relevant Training', icon: 'Wrench', text: 'Learn fire safety protocols, risk management, and hotel operations.' },
          { title: 'Career Versatility', icon: 'Briefcase', text: 'Work in industries ranging from hospitality and tourism to manufacturing and construction.' },
          { title: 'Placement Support', icon: 'TrendingUp', text: 'Benefit from strong industry connections and placement assistance.' },
        ],
      },
      {
        blockType: 'coursesShowcase',
        eyebrow: 'Programmes',
        heading: 'Our Offered Courses',
        style: 'detailed',
        background: 'muted',
      },
      cta(
        'Enroll Today and Start Your Journey!',
        'Don’t miss the chance to take the first step toward achieving your goals. Whether you’re looking to learn new skills, advance your career, or simply explore something new, our programmes offer everything you need to succeed.',
      ),
    ],
    meta: { description: 'One-year diploma courses in Hotel & Tourism Management and Fire & Industrial Safety Management at Prestige Institute Dharwad.' },
  })

  /* ───────── Admissions ───────── */
  pages.push({
    title: 'Admissions',
    slug: 'admissions',
    hero: {
      type: 'page',
      eyebrow: 'Admissions 2026-27',
      heading: 'Admissions',
      text: 'Admissions for 2026-27 are open — here is how to join, step by step.',
      media: await img('2026/07/ChatGPT-Image-Jul-18-2026-12_26_06-PM.png', 'Students in a Prestige Institute classroom'),
    },
    layout: [
      {
        blockType: 'listColumns',
        eyebrow: 'Eligibility',
        heading: 'Programmes & Eligibility',
        intro: 'Two one-year diploma programmes, open to students after SSLC, PUC, ITI, a degree or a diploma.',
        style: 'check',
        background: 'white',
        columns: [
          {
            title: 'Diploma in Hotel and Tourism Management',
            image: await img('2025/04/ChatGPT-Image-Apr-17-2025-12_34_31-PM-1024x683.png', 'Diploma in Hotel and Tourism Management'),
            items: [
              { text: 'Eligibility: SSLC / PUC / ITI / Degree / Diploma etc.' },
              { text: 'Duration: 1 Year' },
              { text: 'Certification: BSS, Central Government of India' },
            ],
            enableLink: true,
            link: refCourse('View course details', courses.hotel),
          },
          {
            title: 'Diploma in Fire and Industrial Safety',
            image: await img('2025/04/ChatGPT-Image-Apr-25-2025-01_13_36-PM-1024x683.png', 'Diploma in Fire and Industrial Safety'),
            items: [
              { text: 'Eligibility: SSLC / PUC / ITI / Degree / Diploma etc.' },
              { text: 'Duration: 1 Year' },
              { text: 'Certification: BSS, Central Government of India' },
            ],
            enableLink: true,
            link: refCourse('View course details', courses.fire),
          },
        ],
      },
      {
        blockType: 'listColumns',
        eyebrow: 'Admission Procedure',
        heading: 'Procedure for Applying Offline',
        intro: 'Five simple steps at our Dharwad campus — our counsellors guide you through each one.',
        style: 'numbered',
        background: 'muted',
        columns: [
          {
            // One column + picture → photo on the left, steps as a timeline on the right
            image: aboutPhoto,
            items: [
              { text: 'Visit the college reception, and schedule a counselling session with our team of expert counselors.' },
              { text: 'Select your preferred course and engage in an in-depth discussion regarding the fee structure with our skilled team of counselors.' },
              { text: 'Meet the faculties and the Placement Officer to explore potential career paths and placement opportunities in Hotel and Tourism Management, and Fire and Industrial Safety related courses.' },
              { text: 'If the student meets the eligibility criteria, collect the application form and complete all required details. If not, our expert counseling team can discuss alternative courses and career paths.' },
              { text: 'Finalize your course registration and make the payment for your selected course.' },
            ],
            note: 'Timing: Monday – Saturday, 10:30am – 1:30pm and 2:30pm – 4:30pm',
            enableLink: true,
            link: { type: 'custom', url: '/apply-online', label: 'Prefer online? Apply here', newTab: false },
          },
        ],
      },
      {
        blockType: 'contactSection',
        eyebrow: 'Admission Enquiry',
        heading: 'Request a Call Back',
        intro: 'Share your details and our admissions team will call you back.',
        form: forms.enquiry,
        showMap: false,
      },
    ],
    meta: { description: 'Admissions at Prestige Institute Dharwad — eligibility, duration and the step-by-step admission procedure for our diploma programmes.' },
  })

  /* ───────── Gallery ───────── */
  pages.push({
    title: 'Gallery',
    slug: 'gallery',
    hero: {
      type: 'page',
      heading: 'Gallery',
      text: 'Life at Prestige — kitchens, classrooms, fire drills and campus events.',
      media: await img('2025/05/61e53b4d5a72a.jpg', 'Chefs-in-training plating dishes in the kitchen'),
    },
    layout: [{ blockType: 'gallery', showFilters: true, limit: 0, background: 'white' }],
    meta: { description: 'Photo gallery of Prestige Institute Dharwad — hotel & tourism and fire & industrial safety training.' },
  })

  /* ───────── Placements ───────── */
  pages.push({
    title: 'Placements',
    slug: 'placements',
    hero: {
      type: 'page',
      heading: 'Placements',
      text: '100% placement assistance with leading hotels, resorts, cruise lines and industrial companies.',
      media: await img('2026/07/Jul-21-2026-11_10_41-AM-e1784612751543.png', 'Fire & industrial safety students in class'),
    },
    layout: [
      {
        blockType: 'recruiters',
        eyebrow: 'Our Recruiters',
        heading: 'Top Recruiters',
        rows: 'split',
        background: 'white',
      },
      {
        blockType: 'listColumns',
        eyebrow: 'Careers',
        heading: 'Job Profile In Prestige Institute',
        style: 'pills',
        background: 'muted',
        columns: [
          {
            title: 'Hotel and Tourism Management — Career Opportunities',
            image: await img('2025/04/ChatGPT-Image-Apr-26-2025-12_23_24-PM.png', 'Hotel and tourism careers'),
            items: [
              'Food & Beverage Manager', 'Executive Chef', 'Front Office Manager', 'Housekeeping Manager', 'Bar Manager',
              'Banquet Manager', 'Restaurant Manager', 'Sous Chef', 'Pastry Chef', 'Duty Manager',
            ].map((text) => ({ text })),
          },
          {
            title: 'Fire and Industrial Safety Management — Career Opportunities',
            image: await img('2025/04/ChatGPT-Image-Apr-26-2025-12_43_54-PM.png', 'Fire and industrial safety careers'),
            items: [
              'Fire Safety Officer', 'Industrial Safety Manager', 'Construction Safety Manager', 'EHS Officer',
              'Risk Assessment Specialist', 'Safety Auditor', 'Emergency Response Co-ordinator',
            ].map((text) => ({ text })),
          },
        ],
      },
      {
        blockType: 'featureCards',
        style: 'cards',
        columns: '2',
        background: 'white',
        items: [
          { title: 'Live Industry Projects', image: await img('2025/02/fire-students-6-1-1024x576.jpg', 'Students on a live industry project') },
          { title: 'Internship Training', image: await img('2025/02/chef-students-scaled.jpg', 'Students during internship training') },
        ],
      },
      cta('Your career starts here', 'Join 1000+ Prestige students already working with reputed companies.'),
    ],
    meta: { description: 'Placements at Prestige Institute Dharwad — top recruiters, career opportunities, live industry projects and internship training.' },
  })

  /* ───────── Apply Online ───────── */
  pages.push({
    title: 'Apply Online',
    slug: 'apply-online',
    hero: {
      type: 'page',
      eyebrow: 'Admissions 2026-27',
      heading: 'Apply Online',
      text: 'Kindly fill all the information correctly. Your name should be as per your 10th standard certificate.',
      media: await img('2025/02/fire-students-sitting-scaled.jpg', 'Students attending a class at Prestige Institute'),
    },
    layout: [
      {
        blockType: 'formBlock',
        form: forms.apply,
        // Shown as a side panel next to the form
        enableIntro: true,
        introContent: applyIntro(),
      },
    ],
    meta: { description: 'Apply online for the Hotel & Tourism or Fire & Industrial Safety diploma at Prestige Institute Dharwad.' },
  })

  /* ───────── Contact ───────── */
  pages.push({
    title: 'Contact Us',
    slug: 'contact-us',
    hero: {
      type: 'page',
      heading: 'Contact Us',
      text: 'Visit the campus, call us or send a message — we usually reply within one working day.',
      media: await img('2025/02/photo-1581447109200-bf2769116351-scaled.jpg', 'Notebook and pen on a desk'),
    },
    layout: [
      {
        blockType: 'contactSection',
        eyebrow: 'Get In Touch',
        heading: 'We would love to hear from you',
        form: forms.contact,
        showMap: true,
      },
    ],
    meta: { description: 'Contact Prestige Institute Dharwad — 2nd Floor, Akalwadi Complex, P.B. Road, Dharwad. Call +91 90364 42221.' },
  })

  return pages
}
