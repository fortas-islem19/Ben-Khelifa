import { integrations } from '../config/site'

/**
 * Sends an order to the Google Apps Script web app bound to the orders spreadsheet
 * (see integrations/google-sheets/).
 *
 * Apps Script web apps don't return CORS headers, so the request is sent as a
 * "simple request" (text/plain, no-cors). The response is opaque: a resolved promise
 * means the request reached Google, a rejection means a network failure.
 */
export async function sendToGoogleSheets(payload) {
  const url = integrations.googleSheetsWebhookUrl
  if (!url) {
    console.warn('[sheets] VITE_GOOGLE_SHEETS_WEBHOOK_URL is not set — order not sent.', payload)
    return { sent: false, reason: 'not-configured' }
  }

  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  return { sent: true }
}
