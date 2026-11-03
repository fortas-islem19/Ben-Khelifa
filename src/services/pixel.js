import { site, integrations } from '../config/site'
import { byId, flavors, sizes, themes } from '../data/options'

/**
 * Meta (Facebook) Pixel wrapper.
 * Every call is a no-op when no Pixel ID is configured, so components can track freely.
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

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))

/**
 * @param {string} event  Standard event name (ViewContent, AddToCart, InitiateCheckout, Lead, Purchase, Contact…)
 * @param {object} [params]
 * @param {string} [eventId] Optional id, lets a future server-side Conversions API deduplicate.
 */
export function track(event, params = {}, eventId) {
  if (!initialized || !window.fbq) return
  window.fbq('track', event, clean(params), eventId ? { eventID: eventId } : undefined)
}

export function trackCustom(event, params = {}) {
  if (!initialized || !window.fbq) return
  window.fbq('trackCustom', event, clean(params))
}

/** Standard parameters describing the order so far (product = the chosen theme). */
export function orderParams(order) {
  const theme = byId(themes, order.theme)
  const size = byId(sizes, order.size)
  const flavor = byId(flavors, order.flavor)
  const value = size?.price || 0
  return {
    content_name: theme?.label,
    content_ids: order.theme ? [order.theme] : undefined,
    content_type: 'product',
    content_category: [size?.label, flavor?.label].filter(Boolean).join(' · ') || undefined,
    contents: order.theme ? [{ id: order.theme, quantity: 1, item_price: value }] : undefined,
    num_items: 1,
    value,
    currency: site.currency,
  }
}
