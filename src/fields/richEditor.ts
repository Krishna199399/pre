import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/** Rich text with headings and bullet/numbered lists, for page sections and course descriptions. */
export const richEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
    UnorderedListFeature(),
    OrderedListFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})
