/**
 * FAQs shown on pages (and marked up as FAQPage schema) — written for answer engines:
 * a direct one-sentence answer first, then the detail. Only facts the institute has published.
 */
export type Faq = { q: string; a: string }

const PHONE = '+91 90364 42221'
const ADDRESS = '2nd Floor, Akalwadi Complex, Near Toll Naka, Opp. Modern Hall, P.B. Road, Dharwad – 580004, Karnataka'

const eligibility: Faq = {
  q: 'Can I join after 10th (SSLC) or PUC?',
  a: 'Yes. Both diplomas are open to students who have passed SSLC (10th), PUC / 12th (arts, commerce or science), ITI, a degree or a diploma. Admission starts with a counselling session at the institute, where our team checks eligibility and helps you choose the course.',
}
const certification: Faq = {
  q: 'Is the diploma certificate recognised?',
  a: 'Yes. The diploma programmes at Prestige Institute Dharwad carry recognised certification from Bharat Sevak Samaj (BSS), Central Government of India.',
}
const fees: Faq = {
  q: 'What are the course fees?',
  a: `Fees depend on the programme and are explained in detail during the free counselling session. For the current fee structure, call ${PHONE} or visit the institute, Monday to Saturday, 10:30am – 4:30pm.`,
}
const howToApply: Faq = {
  q: 'How do I apply for admission?',
  a: 'You can apply online on the Apply Online page (it takes about 5 minutes), or visit the college reception for a counselling session, discuss the course and fee structure, meet the faculty and the Placement Officer, complete the application form and register.',
}

export const FAQS: Record<string, { heading: string; items: Faq[] }> = {
  home: {
    heading: 'Frequently asked questions',
    items: [
      {
        q: 'Which courses does Prestige Institute Dharwad offer?',
        a: 'Prestige Institute Dharwad offers two one-year diplomas: Hotel & Tourism Management, and Fire & Industrial Safety Management. Both combine classroom teaching with practical sessions and industrial training.',
      },
      eligibility,
      {
        q: 'Do you provide placement after the course?',
        a: 'Yes. Prestige Institute provides 100% placement assistance, with 60+ hiring partners including hotels, resorts, cruise lines and industrial companies, plus internships and industrial training during the course.',
      },
      certification,
      {
        q: 'Where is Prestige Institute located?',
        a: `The institute is at ${ADDRESS}. It serves students from Dharwad, Hubballi (Hubli) and across North Karnataka.`,
      },
      fees,
      howToApply,
    ],
  },

  courses: {
    heading: 'Courses after 10th & PUC — questions',
    items: [
      {
        q: 'Which job-oriented courses can I do after 10th or PUC in Karnataka?',
        a: 'At Prestige Institute Dharwad you can join a one-year Diploma in Hotel & Tourism Management or a one-year Diploma in Fire & Industrial Safety Management directly after SSLC (10th) or PUC (12th). Both are short, practical and placement-focused.',
      },
      {
        q: 'How long are the diploma courses?',
        a: 'Each diploma takes one year, delivered through classroom teaching, practical sessions and a hybrid mode.',
      },
      {
        q: 'Can arts, commerce and science students join hotel management?',
        a: 'Yes. Students from any PUC / 12th stream — arts, commerce or science — can join the hotel management and fire & industrial safety diplomas.',
      },
      {
        q: 'Which course is better: hotel management or fire & industrial safety?',
        a: 'Choose hotel management if you enjoy working with people in hotels, restaurants, travel and events; choose fire & industrial safety if you want to work on safety, risk assessment and emergency response in factories, construction sites and other industries. Our counsellors help you decide.',
      },
      certification,
      fees,
    ],
  },

  'course:hotel-and-tourism-management': {
    heading: 'Hotel management diploma — questions',
    items: [
      {
        q: 'Can I do hotel management after 10th or 2nd PUC?',
        a: 'Yes. The one-year Diploma in Hotel & Tourism Management at Prestige Institute Dharwad accepts students after SSLC (10th), 2nd PUC / 12th (arts, commerce or science), ITI, a degree or a diploma.',
      },
      {
        q: 'How long is the hotel management diploma?',
        a: 'The course is one year long and includes classroom teaching, practical sessions and industrial training.',
      },
      {
        q: 'What will I learn in the hotel and tourism management course?',
        a: 'You learn hotel operations, customer service, food & beverage services, event management and hospitality management, with hands-on practicals, real-world industry exposure and guidance from experienced faculty.',
      },
      {
        q: 'Does the hotel management course include industrial training and placement?',
        a: 'Yes. Students get industrial training and internships during the course, followed by 100% placement assistance with hotels, resorts, cruise lines and event companies.',
      },
      {
        q: 'What jobs can I get after a hotel management diploma?',
        a: 'Graduates work in hotels, resorts, cruise lines, airlines and event management. Roles include Food & Beverage Manager, Front Office Manager, Housekeeping Manager, Restaurant Manager, Banquet Manager, Chef and Duty Manager as they grow in their careers.',
      },
      certification,
    ],
  },

  'course:fire-and-industrial-safety-management': {
    heading: 'Fire & industrial safety course — questions',
    items: [
      {
        q: 'Can I join the fire and industrial safety course after SSLC or PUC?',
        a: 'Yes. The one-year Diploma in Fire & Industrial Safety Management at Prestige Institute Dharwad is open after SSLC (10th), PUC (12th), ITI, a degree or a diploma.',
      },
      {
        q: 'How long is the fire and industrial safety diploma?',
        a: 'It is a one-year diploma with classroom teaching, practical fire training and hybrid sessions.',
      },
      {
        q: 'What does the fire and industrial safety course cover?',
        a: 'The course covers fire prevention, fire fighting and emergency response, Hazard Identification and Risk Assessment (HIRA), industrial safety protocols, safety audits and legal compliance, with practical training.',
      },
      {
        q: 'What jobs can I get after a fire and industrial safety course?',
        a: 'Graduates work in manufacturing, construction, oil and gas, chemicals and other industries. Career roles include Fire Safety Officer, EHS Officer, Industrial Safety Manager, Construction Safety Manager, Safety Auditor, Risk Assessment Specialist and Emergency Response Co-ordinator.',
      },
      {
        q: 'Is there placement after the fire and industrial safety course?',
        a: 'Yes. Prestige Institute provides 100% placement assistance with industrial companies and safety employers.',
      },
      certification,
      fees,
    ],
  },

  admissions: {
    heading: 'Admission questions',
    items: [
      {
        q: 'Are admissions open for 2026-27?',
        a: 'Yes. Admissions for the 2026-27 batch are open for both the Hotel & Tourism Management and the Fire & Industrial Safety Management diplomas.',
      },
      eligibility,
      howToApply,
      {
        q: 'What should I keep ready for the application?',
        a: 'Keep your 10th marks card (and 12th, if you have it) and your parents’ contact details. Enter your name exactly as on your 10th standard certificate.',
      },
      {
        q: 'What are the office timings for admission enquiries?',
        a: `Monday to Saturday, 10:30am – 1:30pm and 2:30pm – 4:30pm. You can also call ${PHONE}.`,
      },
      fees,
    ],
  },

  placements: {
    heading: 'Placement questions',
    items: [
      {
        q: 'Does Prestige Institute provide 100% placement?',
        a: 'Prestige Institute provides 100% placement assistance to its students, supported by 60+ hiring partners, internships and live industry projects.',
      },
      {
        q: 'Which companies recruit hotel management students?',
        a: 'Hotel & tourism students are placed with hotel chains, resorts, cruise lines and hospitality groups — see the recruiter logos on this page.',
      },
      {
        q: 'Which companies recruit fire and industrial safety students?',
        a: 'Fire & industrial safety students are placed with manufacturing, construction, automobile and other industrial companies that need safety professionals.',
      },
    ],
  },
}
