import { AnimatePresence, motion } from 'motion/react'
import { darken, lighten, mix } from '../../utils/color'
import { project, seeded, tierPaths, toPath, unitShape } from './geometry'

const spring = { type: 'spring', stiffness: 130, damping: 18 }

/** A band of the side face between two heights, following the front curve. */
function band(shape, rx, ry, yTop, yBottom) {
  const { front } = unitShape(shape)
  const top = project(front, rx, ry, yTop)
  const bottom = project(front, rx, ry, yBottom).reverse()
  return toPath([...top, ...bottom])
}

/** Glaze line along the top edge with rounded drops running down the side. */
function dripPath(topFront, h) {
  const n = topFront.length
  const lower = topFront.map(([x, y], k) => {
    const bump = Math.max(0, Math.sin(k * 1.05 + 0.6)) ** 4 * (0.55 + 0.45 * seeded(k))
    return [x, y + 5 + h * 0.4 * bump]
  })
  // Catmull-Rom → cubic Bézier, for soft, round drops
  const r = (v) => Math.round(v * 10) / 10
  const pts = [...lower].reverse()
  let d = toPath(topFront, false).replace(/Z$/, '') + `L${r(pts[0][0])} ${r(pts[0][1])}`
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(n - 1, i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += `C${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`
  }
  return d + 'Z'
}

export default function Tier({ tier, design, ids, delay = 0 }) {
  const { shape, finish, base, accent, sponge, filling } = design
  const { w, h, bottomY, index } = tier
  const p = tierPaths(shape, w, h)
  const naked = finish === 'naked'
  const chantilly = finish === 'chantilly'

  const side = chantilly ? mix(base, '#ffffff', 0.45) : base
  const top =
    finish === 'drip' ? accent : naked ? mix(base, sponge, 0.35) : lighten(side, chantilly ? 0.25 : 0.14)
  const clipId = `${ids.prefix}-clip-${index}`

  // Naked cake: alternate sponge / filling layers
  const layers = [0.27, 0.1, 0.26, 0.1, 0.27]
  let acc = -h - 2
  const bands = layers.map((ratio, i) => {
    const yTop = acc
    acc += ratio * (h + 2)
    return { d: band(shape, p.rx, p.ry, yTop, acc + 0.5), color: i % 2 ? filling : sponge }
  })

  return (
    <motion.g
      initial={{ x: 200, y: bottomY - 200, opacity: 0 }}
      animate={{ x: 200, y: bottomY, opacity: 1 }}
      exit={{ y: bottomY - 200, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ ...spring, delay }}
    >
      <clipPath id={clipId}>
        <motion.path animate={{ d: p.side }} transition={spring} />
      </clipPath>

      {/* side */}
      <motion.path initial={false} animate={{ d: p.side, fill: naked ? sponge : side }} transition={spring} />
      {naked && (
        <g clipPath={`url(#${clipId})`}>
          {bands.map((b, i) => (
            <motion.path key={i} initial={false} animate={{ d: b.d, fill: b.color }} transition={spring} />
          ))}
          <motion.path initial={false} animate={{ d: p.side, fill: base }} opacity={0.32} transition={spring} />
        </g>
      )}
      <motion.path initial={false} animate={{ d: p.side }} fill={`url(#${ids.shade})`} transition={spring} />

      {/* gold leaf flakes */}
      <AnimatePresence>
        {design.decorations.includes('gold-leaf') && (
          <motion.g
            key="leaf"
            clipPath={`url(#${clipId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 7 }, (_, k) => {
              const x = (seeded(k + index * 7) - 0.5) * w * 0.75
              const y = -h * (0.2 + 0.6 * seeded(k * 3 + index)) + p.ry * 0.8
              const s = 4 + seeded(k + 11) * 6
              return (
                <path
                  key={k}
                  d={`M${x} ${y}l${s} ${-s * 0.4}l${s * 0.5} ${s * 0.9}l${-s * 0.9} ${s * 0.5}z`}
                  fill={`url(#${ids.gold})`}
                />
              )
            })}
          </motion.g>
        )}
      </AnimatePresence>

      {/* drip */}
      <AnimatePresence>
        {finish === 'drip' && (
          <motion.path
            key="drip"
            initial={{ opacity: 0, scaleY: 0.2 }}
            animate={{ opacity: 1, scaleY: 1, d: dripPath(p.topFront, h), fill: accent }}
            exit={{ opacity: 0, scaleY: 0.2 }}
            style={{ transformOrigin: `0px ${-h}px` }}
            transition={spring}
          />
        )}
      </AnimatePresence>

      {/* top face */}
      <motion.path initial={false} animate={{ d: p.top, fill: top }} transition={spring} />
      <motion.path initial={false} animate={{ d: p.top }} fill={`url(#${ids.gloss})`} transition={spring} />

      <Borders finish={finish} p={p} base={side} accent={accent} />
    </motion.g>
  )
}

function Borders({ finish, p, base, accent }) {
  const every = (arr, n) => arr.filter((_, i) => i % n === 0)
  let dots = []
  if (finish === 'buttercream') {
    const c = lighten(base, 0.3)
    dots = [
      ...every(p.topOutline, 4).map(([x, y]) => ({ x, y, r: 4.5, c, s: darken(base, 0.08) })),
      ...every(p.bottomFront, 2).map(([x, y]) => ({ x, y: y - 3, r: 5.5, c, s: darken(base, 0.08) })),
    ]
  } else if (finish === 'chantilly') {
    dots = every(p.topOutline, 6).map(([x, y]) => ({ x, y: y - 3, r: 7, c: '#fffdf8', s: '#efe4d3', swirl: true }))
  } else if (finish === 'fondant') {
    dots = every(p.bottomFront, 1).map(([x, y]) => ({ x, y: y - 3, r: 3.6, c: accent, s: darken(accent, 0.2), pearl: true }))
  } else if (finish === 'drip') {
    dots = every(p.bottomFront, 3).map(([x, y]) => ({ x, y: y - 3, r: 4, c: lighten(base, 0.2), s: darken(base, 0.1) }))
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.g key={finish} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {dots.map((d, i) => (
          <g key={i}>
            <motion.circle
              initial={{ r: 0 }}
              animate={{ cx: d.x, cy: d.y, r: d.r, fill: d.c }}
              stroke={d.s}
              strokeWidth={0.8}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: i * 0.008 }}
            />
            {d.swirl && (
              <motion.path
                initial={false}
                animate={{ d: `M${d.x - 3} ${d.y}q3 -4 6 0q-3 3 -5 0` }}
                fill="none"
                stroke="#e6d8c2"
                strokeWidth={1}
              />
            )}
            {d.pearl && <motion.circle initial={false} animate={{ cx: d.x - 1.2, cy: d.y - 1.2 }} r={1.1} fill="#fff" opacity={0.7} />}
          </g>
        ))}
      </motion.g>
    </AnimatePresence>
  )
}
