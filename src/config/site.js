/**
 * Brand & business settings.
 * Everything a non-developer may want to change lives here or in `src/data/`.
 */

/**
 * Google Apps Script Web App URL that writes each order in Google Sheets
 * (https://script.google.com/macros/s/…/exec — see integrations/google-sheets/README.md).
 */
const GOOGLE_SHEETS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwqhwMLleihTWM94HxuZ1fYcpRdu4-ca_JBweH-BgiXTB68nzsVPx7y3ObLZ_IjrP1gEA/exec'

/** Meta (Facebook) Pixel ID, from Events Manager → Data sources. */
const META_PIXEL_ID = '1865859407934132'

/**
 * Also send each Pixel event from the server (Meta Conversions API, `api/meta-capi.js`).
 * Needs META_CAPI_ACCESS_TOKEN in the Vercel environment variables; only active on the deployed site.
 */
const CONVERSIONS_API = true

export const site = {
  name: 'Pâtisserie Benkhelifa',
  shortName: 'Benkhelifa',
  since: 2009,
  tagline: 'Gâteaux à thème sur commande',

  contact: {
    phoneDisplay: '0560 42 23 02',
    phoneHref: 'tel:+213560422302',
    // TODO: replace with the real shop details
    email: 'contact@benkhelifa.com',
    address: 'Adresse de la boutique, Ville',
    mapsUrl: 'https://maps.google.com',
    hours: [
      { days: 'Samedi – Jeudi', time: '08:00 – 21:00' },
      { days: 'Vendredi', time: '14:00 – 21:00' },
    ],
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
  },

  /** Currency sent to the Meta Pixel with the order value. */
  currency: 'DZD',

  ordering: {
    /** Minimum notice before the pickup / delivery date, in days. */
    minLeadDays: 2,
    /** How far in advance an order can be placed, in days. */
    maxLeadDays: 120,
    /** Number of quick date buttons shown in step 3 (an “other date” calendar is always available). */
    quickDays: 8,
  },
}

/** Third-party integrations. Environment variables (see `.env.example`) override the values above. */
export const integrations = {
  googleSheetsWebhookUrl: import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || GOOGLE_SHEETS_WEBHOOK_URL,
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || META_PIXEL_ID,
  conversionsApiUrl: CONVERSIONS_API && import.meta.env.PROD ? '/api/meta-capi' : '',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
}
