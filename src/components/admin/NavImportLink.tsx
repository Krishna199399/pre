import React from 'react'

/** Extra menu link under the collections: the Excel import screen (styled in app/(payload)/custom.scss). */
export const NavImportLink: React.FC = () => (
  <a href="/admin/import-results/" className="prestige-nav-import">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8M10 9H8" />
    </svg>
    Import from Excel
  </a>
)
