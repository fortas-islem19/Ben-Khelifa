import { integrations } from '../config/site'

/**
 * Meta (Facebook) Pixel wrapper.
 * Every call is a no-op when VITE_META_PIXEL_ID is not set, so components can track freely.
 */
let initialized = false

export function initPixel() {
  const id = integrations.metaPixelId
  if (!id || initialized || typeof window === 'undefined') return
  initialized = true

  /* Official Meta loader snippet */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

  window.fbq('init', id)
  window.fbq('track', 'PageView')
}

/**
 * @param {string} event  Standard event name (ViewContent, InitiateCheckout, Lead, Contact…)
 * @param {object} [params]
 * @param {string} [eventId] Optional id, lets a future server-side Conversions API deduplicate.
 */
export function track(event, params = {}, eventId) {
  if (!initialized || !window.fbq) return
  window.fbq('track', event, params, eventId ? { eventID: eventId } : undefined)
}

export function trackCustom(event, params = {}) {
  if (!initialized || !window.fbq) return
  window.fbq('trackCustom', event, params)
}
