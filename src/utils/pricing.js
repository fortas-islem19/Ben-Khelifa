import { findCake } from '../data/cakes'
import * as opt from '../data/options'

const sum = (list, ids) => ids.reduce((acc, id) => acc + (opt.byId(list, id)?.price ?? 0), 0)
const roundTo = (value, step = 100) => Math.round(value / step) * step

/** Indicative price, recalculated live in the summary. */
export function estimatePrice(order) {
  const cake = findCake(order.cakeId)
  if (!cake) return { total: 0, lines: [], onQuote: false }

  const size = opt.byId(opt.sizes, order.size) ?? opt.byId(opt.sizes, cake.defaultSize)
  const defaultSize = opt.byId(opt.sizes, cake.defaultSize)
  const sizeFactor = size.multiplier / defaultSize.multiplier
  // Supplements scale (lightly) with the cake size
  const extraFactor = Math.max(1, size.multiplier)

  const lines = [{ label: `${cake.name} — ${size.label}`, amount: roundTo(cake.basePrice * sizeFactor) }]
  const add = (labelText, amount) => amount > 0 && lines.push({ label: labelText, amount: roundTo(amount) })

  // The finish is part of the model's design, so it's only a supplement when it changes
  if (order.finish !== cake.defaultFinish) add('Finition', (opt.byId(opt.finishes, order.finish)?.price ?? 0) * extraFactor)
  if (cake.id === 'custom') {
    add('Forme', opt.byId(opt.shapes, order.shape)?.price ?? 0)
    add('Étages', opt.byId(opt.tiers, order.tiers)?.price ?? 0)
  }
  add('Saveurs', (sum(opt.sponges, [order.sponge]) + sum(opt.fillings, [order.filling])) * extraFactor)
  add('Décorations', sum(opt.decorations, order.decorations))

  const total = lines.reduce((acc, l) => acc + l.amount, 0)
  return { total, lines, onQuote: Boolean(size.onQuote) }
}
