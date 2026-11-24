import React from 'react'

/** Renders schema.org structured data. `<` is escaped so content can never break out of the script tag. */
export const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
)
