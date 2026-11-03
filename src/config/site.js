/**
 * Brand & business settings.
 * Everything a non-developer may want to change lives here or in `src/data/`.
 */

/**
 * Google Apps Script Web App URL that writes each order in Google Sheets
 * (https://script.google.com/macros/s/…/exec — see integrations/google-sheets/README.md).
 */
const GOOGLE_SHEETS_WEBHOOK_URL = ''

/** Meta (Facebook) Pixel ID, from Events Manager → Data sources. */
const META_PIXEL_ID = ''

export const site = {
  name: 'Pâtisserie Benkhelifa',
  shortName: 'Benkhelifa',
  since: 2009,
  tagline: 'Gâteaux à thème sur commande',

  contact: {
    // TODO: replace with the real shop details
    phoneDisplay: '+213 555 00 00 00',
    phoneHref: 'tel:+213555000000',
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
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
}
