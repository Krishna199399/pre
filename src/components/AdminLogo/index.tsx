import React from 'react'

/** Login-screen branding: the institute's logo mark + name. */
export const AdminLogo: React.FC = () => (
  <div className="prestige-brand">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/brand/logo-mark.png" alt="" width={56} height={56} className="prestige-brand__mark" />
    <div className="prestige-brand__text">
      <span className="prestige-brand__name">Prestige Institute</span>
      <span className="prestige-brand__sub">Dharwad · Results Admin</span>
    </div>
  </div>
)

/** Small mark used at the top of the admin (breadcrumb / nav). */
export const AdminIcon: React.FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src="/brand/logo-mark.png" alt="Prestige Institute" width={30} height={30} style={{ display: 'block', objectFit: 'contain' }} />
)
