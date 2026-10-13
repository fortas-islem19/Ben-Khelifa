/**
 * Cake geometry for the live preview.
 * Every shape is sampled with the same number of points so that SVG paths can be
 * morphed smoothly from one shape to another (round → heart → square…).
 */
const N = 72
export const DEPTH = 0.3 // perspective: depth of the top face relative to its width

const superellipse = (t, n) => {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return [Math.sign(c) * Math.abs(c) ** (2 / n), Math.sign(s) * Math.abs(s) ** (2 / n)]
}

const raw = {
  round: (t) => [Math.cos(t), Math.sin(t)],
  square: (t) => superellipse(t, 9),
  rectangle: (t) => superellipse(t, 9),
  heart: (t) => {
    // Classic heart curve, lobes at the back, tip pointing at the viewer
    const x = (16 * Math.sin(t) ** 3) / 17
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17
    return [x, y]
  },
}

const cache = {}

/** Unit outline (≈ [-1, 1]²), its front arc (left → right) and the y of its widest point. */
export function unitShape(shape) {
  const key = raw[shape] ? shape : 'round'
  if (cache[key]) return cache[key]

  // Start each outline at its rightmost point, going through the front first,
  // so that point i of every shape sits at a comparable position (clean morphs)
  let pts = Array.from({ length: N }, (_, i) => raw[key]((i / N) * Math.PI * 2 + (key === 'heart' ? Math.PI / 2 : 0)))
  // Normalise to [-1, 1]
  const xs = pts.map((p) => p[0])
  const ys = pts.map((p) => p[1])
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  pts = pts.map(([x, y]) => [((x - minX) / (maxX - minX)) * 2 - 1, ((y - minY) / (maxY - minY)) * 2 - 1])

  let iL = 0
  let iR = 0
  pts.forEach((p, i) => {
    if (p[0] < pts[iL][0]) iL = i
    if (p[0] > pts[iR][0]) iR = i
  })
  const walk = (a, b) => {
    const out = []
    for (let i = a; ; i = (i + 1) % N) {
      out.push(pts[i])
      if (i === b) break
    }
    return out
  }
  const A = walk(iR, iL)
  const B = walk(iL, iR)
  const mean = (arr) => arr.reduce((s, p) => s + p[1], 0) / arr.length
  let front = mean(A) > mean(B) ? [...A].reverse() : B
  front = resample(front, 36)

  cache[key] = { outline: pts, front }
  return cache[key]
}

/** Resamples a polyline to exactly `count` points (keeps morphs stable between shapes). */
function resample(points, count) {
  const seg = []
  let total = 0
  for (let i = 1; i < points.length; i++) {
    const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1])
    seg.push(d)
    total += d
  }
  const out = []
  let i = 0
  let acc = 0
  for (let k = 0; k < count; k++) {
    const target = (k / (count - 1)) * total
    while (i < seg.length - 1 && acc + seg[i] < target) acc += seg[i++]
    const t = seg[i] ? (target - acc) / seg[i] : 0
    const a = points[i]
    const b = points[i + 1] ?? a
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
  }
  return out
}

const fmt = (n) => Math.round(n * 10) / 10

/** Projects unit points onto the cake: centre (0, y), half-width rx, half-depth ry. */
export const project = (pts, rx, ry, y = 0) => pts.map(([px, py]) => [fmt(px * rx), fmt(y + py * ry)])

export const toPath = (pts, close = true) =>
  'M' + pts.map((p) => p.join(' ')).join('L') + (close ? 'Z' : '')

/** All the paths of one tier, in local coordinates (bottom centre = 0,0; top face centre = 0,-h). */
export function tierPaths(shape, w, h) {
  const { outline, front } = unitShape(shape)
  const rx = w / 2
  const ry = (w * DEPTH) / 2
  const topFront = project(front, rx, ry, -h)
  const bottomFront = project(front, rx, ry, 0)
  return {
    rx,
    ry,
    top: toPath(project(outline, rx, ry, -h)),
    side: toPath([...topFront, ...[...bottomFront].reverse()]),
    topFront,
    bottomFront,
    topOutline: project(outline, rx, ry, -h),
    bottomOutline: project(outline, rx, ry, 0),
  }
}

/** Deterministic pseudo-random in [0, 1) — keeps renders pure. */
export const seeded = (i) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
