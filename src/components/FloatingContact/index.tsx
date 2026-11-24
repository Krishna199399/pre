import { MessageCircle, Phone } from 'lucide-react'
import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'

/** Bottom-right quick contact buttons (WhatsApp + call). */
export async function FloatingContact() {
  const settings = await getCachedGlobal('site-settings', 1)()
  const phone = settings.phones?.[0]?.number?.replace(/[^\d+]/g, '')
  const wa = settings.whatsapp?.replace(/\D/g, '')
  if (!phone && !wa) return null

  return (
    <div className="no-print fixed right-4 bottom-4 z-30 flex flex-col gap-3 md:right-6 md:bottom-6">
      {wa && (
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent('Hello, I would like to know more about admissions at Prestige Institute Dharwad.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
        >
          <MessageCircle className="size-7" aria-hidden />
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          aria-label="Call us"
          className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-black/20 transition hover:scale-105 md:hidden"
        >
          <Phone className="size-6" aria-hidden />
        </a>
      )}
    </div>
  )
}
