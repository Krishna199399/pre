import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

/**
 * Institute-wide details shown in the header, footer, contact page and SEO.
 * One place for the admin to update phone numbers, address, socials, etc.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'Prestige Institute Dharwad' },
            { name: 'tagline', type: 'text', defaultValue: 'Hotel & Tourism · Fire & Industrial Safety Management' },
            {
              type: 'row',
              fields: [
                { name: 'logo', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Shown in the header.' } },
                { name: 'logoLight', type: 'upload', relationTo: 'media', admin: { width: '50%', description: 'Optional white version for the dark footer.' } },
              ],
            },
            { name: 'footerAbout', type: 'textarea', admin: { description: 'Short paragraph under the logo in the footer.' } },
          ],
        },
        {
          label: 'Announcement bar',
          fields: [
            {
              name: 'announcement',
              type: 'group',
              fields: [
                { name: 'enabled', type: 'checkbox', defaultValue: true },
                { name: 'text', type: 'text', defaultValue: 'Admissions Are Open Now for 2026-27 | Hotel and Fire Safety Management, Hubli - Dharwad.' },
                { name: 'linkLabel', type: 'text', defaultValue: 'Apply Now' },
                { name: 'linkUrl', type: 'text', defaultValue: '/apply-online' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phones', type: 'array', labels: { singular: 'Phone', plural: 'Phones' }, fields: [{ name: 'number', type: 'text', required: true }] },
            { name: 'emails', type: 'array', labels: { singular: 'Email', plural: 'Emails' }, fields: [{ name: 'email', type: 'email', required: true }] },
            { name: 'whatsapp', type: 'text', admin: { description: 'Number with country code, digits only, e.g. 919036442221. Shows a WhatsApp button.' } },
            { name: 'address', type: 'textarea' },
            { name: 'officeHours', type: 'text', defaultValue: 'Monday – Saturday · 10:30am – 1:30pm, 2:30pm – 4:30pm' },
            { name: 'mapEmbedUrl', type: 'text', admin: { description: 'Google Maps → Share → Embed a map → copy only the src="..." URL.' } },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socials',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '40%' },
                      options: ['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'whatsapp'].map((v) => ({ label: v[0].toUpperCase() + v.slice(1), value: v })),
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Footer & credits',
          fields: [
            { name: 'copyrightName', type: 'text', defaultValue: 'Prestige Institute Dharwad. All Rights Reserved.', admin: { description: 'The current year is added automatically.' } },
            { name: 'creditLabel', type: 'text', defaultValue: 'Dark Elite Creations' },
            { name: 'creditUrl', type: 'text', defaultValue: 'https://darkelitecreations.com/' },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { context } }) => {
        if (!context.disableRevalidate) revalidateTag('global_site-settings', 'max')
        return doc
      },
    ],
  },
}
