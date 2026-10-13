/**
 * Brand & business settings.
 * Everything a non-developer may want to change lives here or in `src/data/`.
 */
export const site = {
  name: 'Pâtisserie Benkhelifa',
  shortName: 'Benkhelifa',
  since: 2009,
  tagline: 'L’art du gâteau sur mesure',

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

  currency: {
    code: 'DZD', // ISO code, sent to the pixel
    symbol: 'DA', // displayed to customers
    locale: 'fr-DZ',
  },

  ordering: {
    /** Minimum notice before the pickup / delivery date, in days. */
    minLeadDays: 2,
    /** How far in advance an order can be placed, in days. */
    maxLeadDays: 120,
    /** Size of the reference photo after client-side compression. */
    maxImageDimension: 1600,
    maxImageUploadMb: 15,
  },
}

/** Third-party integrations, configured through environment variables (see `.env.example`). */
export const integrations = {
  googleSheetsWebhookUrl: import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '',
  metaPixelId: import.meta.env.VITE_META_PIXEL_ID || '',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
}
