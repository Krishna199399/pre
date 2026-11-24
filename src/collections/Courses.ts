import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { anyone } from '../access/anyone'
import { richEditor } from '../fields/richEditor'
import { authenticated } from '../access/authenticated'
import { programCategory } from '../fields/programCategory'
import { revalidateSiteAfterChange, revalidateSiteAfterDelete } from '../hooks/revalidateSite'

export const Courses: CollectionConfig<'courses'> = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'order'],
    group: 'Academics',
  },
  defaultSort: 'order',
  defaultPopulate: {
    title: true,
    slug: true,
    shortTitle: true,
    summary: true,
    image: true,
    category: true,
    highlights: true,
    duration: true,
  },
  access: { create: authenticated, delete: authenticated, read: anyone, update: authenticated },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Full name, e.g. "One-Year Diploma in Hotel and Tourism Management".' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'shortTitle',
                  type: 'text',
                  required: true,
                  admin: {
                    width: '50%',
                    description: 'Short name used on cards, e.g. "Hotel and Tourism Management".',
                  },
                },
                programCategory({ required: true, admin: { width: '50%' } }),
              ],
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: { description: 'One or two sentences shown on course cards.' },
            },
            { name: 'image', type: 'upload', relationTo: 'media' },
            {
              name: 'highlights',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Short bullets shown on the course card (e.g. Practical Learning).' },
              fields: [{ name: 'text', type: 'text', required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'duration', type: 'text', defaultValue: '1 Year', admin: { width: '33%' } },
                {
                  name: 'eligibility',
                  type: 'text',
                  defaultValue: 'SSLC / PUC / ITI / Degree / Diploma etc.',
                  admin: { width: '67%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'mode',
                  label: 'Mode of study',
                  type: 'text',
                  defaultValue: 'Classroom / Practical Sessions / Hybrid',
                  admin: { width: '50%' },
                },
                {
                  name: 'certification',
                  type: 'text',
                  defaultValue: 'Recognized certification from BSS, Central Government of India',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Course details',
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: richEditor,
              admin: { description: 'Main course description shown at the top of the course page.' },
            },
            {
              name: 'whyChoose',
              label: 'Why choose this course?',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
              ],
            },
            { name: 'whoShouldEnroll', type: 'textarea' },
            {
              name: 'careerOpportunities',
              type: 'array',
              fields: [{ name: 'role', type: 'text', required: true }],
            },
            { name: 'conclusion', type: 'textarea' },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    slugField(),
  ],
  hooks: { afterChange: [revalidateSiteAfterChange], afterDelete: [revalidateSiteAfterDelete] },
}
