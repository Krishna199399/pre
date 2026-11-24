import type { Access, CollectionConfig, GlobalConfig, Plugin } from 'payload'

/**
 * The admin panel is for student results only (client decision): staff manage Students, Results and
 * their own accounts — nothing else.
 *
 * All website content (pages, blog, courses, gallery, settings, menus, forms…) stays in the database
 * and keeps rendering on the website, but it is hidden from the admin and locked against edits
 * through the admin/API. Developers can still change content with scripts (the Local API bypasses access).
 */
const ADMIN_COLLECTIONS = ['students', 'results', 'users']

const nobody: Access = () => false

const lockCollection = (c: CollectionConfig): CollectionConfig => {
  if (ADMIN_COLLECTIONS.includes(c.slug)) return c
  // Website visitors still submit the contact / apply forms, so form submissions keep public "create".
  const keepCreate = c.slug === 'form-submissions'
  return {
    ...c,
    admin: { ...c.admin, hidden: true },
    access: {
      ...c.access,
      create: keepCreate ? c.access?.create : nobody,
      update: nobody,
      delete: nobody,
      ...(c.slug === 'form-submissions' ? { read: nobody } : {}),
      // Drafts / versions of website content are not needed by staff
      ...(c.versions ? { readVersions: nobody } : {}),
    },
  }
}

const lockGlobal = (g: GlobalConfig): GlobalConfig => ({
  ...g,
  admin: { ...g.admin, hidden: true },
  access: { ...g.access, update: nobody, readVersions: nobody },
})

export const resultsOnlyAdmin: Plugin = (config) => ({
  ...config,
  collections: (config.collections || []).map(lockCollection),
  globals: (config.globals || []).map(lockGlobal),
  // No folder browser — only the website's media library used folders
  folders: { ...(config.folders || {}), browseByFolder: false },
})
