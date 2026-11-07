/**
 * Meta Conversions API relay (Vercel serverless function: POST /api/meta-capi).
 *
 * The browser Pixel sends each event; the page also posts it here with the same event ID,
 * and this function forwards it to Meta from the server. Meta deduplicates the pair, and
 * events blocked in the browser (ad blockers, iOS) are still counted.
 *
 * Settings (Vercel → Project → Settings → Environment Variables):
 *   META_CAPI_ACCESS_TOKEN  required — Events Manager → Pixel → Settings → Conversions API → access token.
 *                           Never put it in the code: the repository is public.
 *   META_PIXEL_ID           optional — defaults to the site's Pixel.
 *   META_TEST_EVENT_CODE    optional — e.g. TEST12345, to see events in Events Manager → Test events.
 */
import { createHash } from 'node:crypto'

const PIXEL_ID = process.env.META_PIXEL_ID || '1865859407934132'
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || ''
const API_VERSION = process.env.META_GRAPH_API_VERSION || 'v24.0'

const ALLOWED_EVENTS = new Set(['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Lead', 'Purchase', 'Contact'])
const CUSTOM_DATA_KEYS = ['content_name', 'content_ids', 'content_type', 'content_category', 'contents', 'num_items', 'value', 'currency', 'method']

const sha256 = (value) => createHash('sha256').update(value).digest('hex')
const clean = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== '' && v !== null))

/** Algerian numbers to international format without “+”: 0555 12 34 56 → 213555123456. */
function normalizePhone(phone) {
  let digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0')) digits = '213' + digits.slice(1)
  return digits.length >= 9 ? digits : ''
}

function readCookie(req, name) {
  const match = (req.headers.cookie || '').match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

function userData(req, user = {}) {
  const data = {
    client_ip_address: String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined,
    client_user_agent: req.headers['user-agent'],
    fbp: readCookie(req, '_fbp'),
    fbc: readCookie(req, '_fbc'),
  }
  const phone = user.phone ? normalizePhone(user.phone) : ''
  if (phone) {
    data.ph = [sha256(phone)]
    data.external_id = [sha256(phone)]
  }
  const names = String(user.name || '').trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (names.length) {
    data.fn = [sha256(names[0])]
    if (names.length > 1) data.ln = [sha256(names.slice(1).join(' '))]
  }
  if (phone || names.length) data.country = [sha256('dz')]
  return clean(data)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'POST only' })
  if (!ACCESS_TOKEN) return res.status(200).json({ ok: false, error: 'META_CAPI_ACCESS_TOKEN is not set' })

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = null
    }
  }
  const { event_name, event_id, event_source_url, custom_data = {}, user } = body || {}
  if (!ALLOWED_EVENTS.has(event_name) || typeof event_id !== 'string' || event_id.length > 100) {
    return res.status(400).json({ ok: false, error: 'Invalid event' })
  }

  const payload = {
    data: [
      clean({
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url: typeof event_source_url === 'string' ? event_source_url.slice(0, 1000) : undefined,
        action_source: 'website',
        user_data: userData(req, user),
        custom_data: clean(Object.fromEntries(CUSTOM_DATA_KEYS.map((k) => [k, custom_data[k]]))),
      }),
    ],
  }
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
    )
    const result = await response.json().catch(() => ({}))
    if (!response.ok) console.error('[meta-capi]', event_name, result.error?.message)
    return res.status(response.ok ? 200 : 502).json({ ok: response.ok, events_received: result.events_received, error: result.error?.message })
  } catch (err) {
    console.error('[meta-capi]', err)
    return res.status(502).json({ ok: false, error: 'Meta unreachable' })
  }
}
