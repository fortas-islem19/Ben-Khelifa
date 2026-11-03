import * as opt from '../data/options'
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
  return {
    reference,
    createdAt: new Date().toISOString(),
    status: 'Nouvelle',
    customerName: order.name.trim(),
    phone: order.phone.trim(),
    theme: label(opt.themes, order.theme),
    size: label(opt.sizes, order.size),
    flavor: label(opt.flavors, order.flavor),
    date: order.date,
    time: order.time,
    cakeText: order.cakeText.trim(),
    notes: order.notes.trim(),
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
  const result = await sendToGoogleSheets(record)

  track(
    'Lead',
    { content_name: record.theme, content_ids: [order.theme], content_category: record.size },
    reference,
  )

  return { reference, record, ...result }
}
