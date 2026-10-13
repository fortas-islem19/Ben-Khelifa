import { site } from '../config/site'
import { findCake } from '../data/cakes'
import * as opt from '../data/options'
import { estimatePrice } from '../utils/pricing'
import { capturePreview } from '../utils/svgToImage'
import { sendToGoogleSheets } from './googleSheets'
import { track } from './pixel'

const label = (list, id) => opt.byId(list, id)?.label ?? ''

export function createOrderReference(date = new Date()) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BK-${ymd}-${rand}`
}

/** Flat, human-readable record — one key per spreadsheet column. */
export function buildOrderRecord(order, reference) {
  const cake = findCake(order.cakeId)
  const size = opt.byId(opt.sizes, order.size)
  const price = estimatePrice(order)

  return {
    reference,
    createdAt: new Date().toISOString(),
    status: 'Nouvelle',
    customerName: order.customer.name.trim(),
    phone: order.customer.phone.trim(),
    email: order.customer.email.trim(),
    model: cake?.name ?? '',
    modelId: order.cakeId,
    occasion: order.occasion,
    size: size ? `${size.label} (${size.servings})` : '',
    shape: order.cakeId === 'custom' ? label(opt.shapes, order.shape) : '',
    tiers: order.cakeId === 'custom' ? label(opt.tiers, Number(order.tiers)) : '',
    sponge: label(opt.sponges, order.sponge),
    filling: label(opt.fillings, order.filling),
    finish: label(opt.finishes, order.finish),
    colors:
      order.cakeId === 'custom'
        ? `Principale : ${opt.colorName(order.baseColor)} · Accent : ${opt.colorName(order.accentColor)}`
        : order.colors.map((id) => label(opt.colors, id)).join(', '),
    decorations: order.decorations.map((id) => label(opt.decorations, id)).join(', '),
    nameOnCake: order.nameOnCake.trim(),
    age: order.age,
    message: order.message.trim(),
    designNotes: order.designNotes.trim(),
    date: order.date,
    timeSlot: order.timeSlot,
    fulfillment: label(opt.fulfillment, order.fulfillment),
    address: order.fulfillment === 'delivery' ? order.address.trim() : '',
    city: order.fulfillment === 'delivery' ? order.city.trim() : '',
    referral: order.customer.referral,
    notes: order.customer.notes.trim(),
    estimatedPrice: price.onQuote ? 'Sur devis' : price.total,
    currency: site.currency.code,
    pageUrl: window.location.href,
  }
}

/**
 * Single entry point used by the form. Swap the transport here (own API, Firebase,
 * Supabase…) without touching any component.
 */
export async function submitOrder(order) {
  const reference = createOrderReference()
  const record = buildOrderRecord(order, reference)
  const designPreview = order.cakeId === 'custom' ? await capturePreview('[data-cake-preview] svg') : null
  const payload = { ...record, referenceImage: order.referenceImage ?? null, designPreview }

  const result = await sendToGoogleSheets(payload)

  const price = estimatePrice(order)
  track(
    'Lead',
    {
      content_name: record.model,
      content_ids: [order.cakeId],
      content_category: record.occasion,
      value: price.onQuote ? 0 : price.total,
      currency: site.currency.code,
    },
    reference,
  )

  return { reference, record, ...result }
}
