import RichText from '@/components/RichText'
import React from 'react'

import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

/**
 * A "message" inside a form is used as a section heading ("Student details", "Parent details"…).
 * Shown compactly with an automatic step number (the form resets the counter).
 */
export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  if (!message) return null
  return (
    <div className="flex items-center gap-3 border-b border-border pb-3">
      <span
        className="bg-gradient-primary inline-flex size-8 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-bold text-white shadow-md shadow-primary/25 [counter-increment:formstep] before:content-[counter(formstep)]"
        aria-hidden
      />
      <RichText
        data={message}
        enableGutter={false}
        className="mx-0 max-w-none prose-headings:m-0 prose-headings:font-heading prose-headings:text-lg prose-headings:text-navy prose-p:m-0"
      />
    </div>
  )
}
