import { DEPTH } from './geometry'

const sizeScale = { s: 0.84, m: 0.92, l: 1, xl: 1.05, xxl: 1.1 }
const widths = { 1: [250], 2: [260, 180], 3: [276, 200, 132] }
const heights = { 1: [118], 2: [92, 80], 3: [78, 68, 60] }

export const VIEW = { w: 400, h: 430, floor: 372 }

/** Position and size of each tier, bottom to top. */
export function cakeLayout(design) {
  const n = Math.min(3, Math.max(1, design.tiers))
  const scale = sizeScale[design.size] ?? 1
  const wide = design.shape === 'rectangle' ? 1.28 : 1
  let bottomY = VIEW.floor
  const tiers = widths[n].map((w0, i) => {
    const w = Math.min(350, w0 * scale * wide)
    const h = heights[n][i] * (0.92 + scale * 0.08)
    const tier = { index: i, w, h, bottomY, topY: bottomY - h, ry: (w * DEPTH) / 2 }
    bottomY -= h
    return tier
  })
  const board = { rx: Math.min(190, tiers[0].w / 2 + 22), y: VIEW.floor + 4 }
  const top = tiers[tiers.length - 1]

  // Zoom small cakes so they fill the frame (decorations need ~100px above the top tier)
  const contentHeight = VIEW.floor + 40 - (top.topY - 100)
  const zoom = Math.max(1, Math.min(1.35, (VIEW.floor + 40 - 10) / contentHeight, 196 / board.rx))
  return { tiers, board, top, zoom }
}
