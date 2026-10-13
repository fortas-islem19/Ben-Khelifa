import * as opt from '../../data/options'

/** Translates order fields into what the cake preview needs to draw. */
export function designFromOrder(order) {
  const sponge = opt.byId(opt.sponges, order.sponge)
  const filling = opt.byId(opt.fillings, order.filling)
  return {
    shape: order.shape || 'round',
    tiers: Number(order.tiers) || 1,
    size: order.size || 'm',
    finish: order.finish || 'buttercream',
    base: order.baseColor || opt.builderDefaults.baseColor,
    accent: order.accentColor || opt.builderDefaults.accentColor,
    sponge: sponge?.color ?? '#f1d79b',
    filling: filling?.color ?? '#fbeedd',
    spongeLabel: sponge?.label ?? 'Génoise',
    fillingLabel: filling?.label ?? 'Garniture',
    decorations: order.decorations ?? [],
    name: (order.nameOnCake ?? '').trim(),
    message: (order.message ?? '').trim(),
    age: String(order.age ?? '').trim(),
    occasion: order.occasion ?? '',
  }
}

const pick = (list) => list[Math.floor(Math.random() * list.length)]

/** Random — but tasteful — set of builder choices ("Surprenez-moi"). */
export function randomDesign() {
  const palettes = [
    ['#f3ead8', '#c9a24b'],
    ['#ffffff', '#e2367a'],
    ['#f2c4c9', '#c9a24b'],
    ['#1f2f56', '#c9a24b'],
    ['#bfe3cf', '#ffffff'],
    ['#1a1a1a', '#c9a24b'],
    ['#c8b6e2', '#ffffff'],
    ['#9fd0ef', '#ffffff'],
    ['#ffffff', '#1a1a1a'],
    ['#e2a35b', '#6b3e26'],
  ]
  const [baseColor, accentColor] = pick(palettes)
  const decor = opt.decorations.map((d) => d.id).filter(() => Math.random() < 0.3)
  return {
    shape: pick(['round', 'round', 'square', 'heart']),
    tiers: pick([1, 1, 2, 2, 3]),
    finish: pick(opt.finishes).id,
    sponge: pick(opt.sponges).id,
    filling: pick(opt.fillings).id,
    baseColor,
    accentColor,
    decorations: decor.length ? decor : ['fresh-flowers'],
  }
}
