import { AnimatePresence, motion } from 'motion/react'
import { darken, inkOn, lighten, luminance } from '../../utils/color'
import { project, seeded, unitShape } from './geometry'

const pop = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } },
  transition: { type: 'spring', stiffness: 260, damping: 15 },
  style: { transformBox: 'fill-box', transformOrigin: '50% 100%' },
}

function Rose({ x, y, r, color }) {
  const dark = darken(color, 0.18)
  return (
    <g>
      <ellipse cx={x - r * 0.9} cy={y + r * 0.35} rx={r * 0.7} ry={r * 0.32} fill="#5d7d4a" transform={`rotate(-20 ${x} ${y})`} />
      <circle cx={x} cy={y} r={r} fill={color} stroke={dark} strokeWidth={0.6} />
      <path
        d={`M${x - r * 0.55} ${y}a${r * 0.55} ${r * 0.55} 0 1 1 ${r * 0.9} ${r * 0.3}M${x - r * 0.25} ${y - r * 0.05}a${r * 0.28} ${r * 0.28} 0 1 1 ${r * 0.45} ${r * 0.15}`}
        fill="none"
        stroke={dark}
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </g>
  )
}

function Candle({ x, y, height, color, delay }) {
  return (
    <g>
      <rect x={x - 3} y={y - height} width={6} height={height} rx={2} fill="#fffaf2" stroke="#e8dccb" strokeWidth={0.6} />
      {[0.2, 0.45, 0.7].map((t) => (
        <path key={t} d={`M${x - 3} ${y - height * t}l6 -5v3l-6 5z`} fill={color} />
      ))}
      <line x1={x} y1={y - height} x2={x} y2={y - height - 4} stroke="#3a3632" strokeWidth={1} />
      <motion.path
        d={`M${x} ${y - height - 16}c4 5 4 9 0 11c-4 -2 -4 -6 0 -11z`}
        fill="url(#flame)"
        animate={{ scaleY: [1, 1.18, 0.92, 1.1, 1], rotate: [0, 3, -3, 2, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      />
    </g>
  )
}

/** Everything sitting on the top tier. Coordinates are relative to its top-face centre. */
export default function Decorations({ design, tier, ids }) {
  const { decorations: dec, accent, base } = design
  const rx = tier.w / 2
  const ry = tier.ry
  const has = (id) => dec.includes(id)
  const { outline } = unitShape(design.shape)
  const rim = project(outline, rx * 0.86, ry * 0.86)
  const topperText = design.name || (design.occasion && design.occasion !== 'Autre' ? design.occasion.split(' /')[0] : '') || 'Joyeux anniversaire'
  const topperSize = Math.min(34, (rx * 2.1) / (topperText.length * 0.42))
  const candleColor = luminance(accent) > 0.85 ? '#e2367a' : accent

  return (
    <motion.g initial={false} animate={{ x: 200, y: tier.topY }} transition={{ type: 'spring', stiffness: 130, damping: 18 }}>
      <AnimatePresence>
        {has('edible-print') && (
          <motion.g key="print" {...pop} style={{ ...pop.style, transformOrigin: '50% 50%' }}>
            <ellipse rx={rx * 0.5} ry={ry * 0.5} fill={`url(#${ids.photo})`} stroke="#fff" strokeWidth={2} />
            <path
              d={`M${-rx * 0.3} ${ry * 0.18}l${rx * 0.16} ${-ry * 0.3}l${rx * 0.12} ${ry * 0.18}l${rx * 0.1} ${-ry * 0.12}l${rx * 0.18} ${ry * 0.24}z`}
              fill="#ffffff"
              opacity={0.75}
            />
          </motion.g>
        )}

        {has('sprinkles') && (
          <motion.g key="sprinkles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {Array.from({ length: 34 }, (_, k) => {
              const a = seeded(k) * Math.PI * 2
              const d = Math.sqrt(seeded(k + 50)) * 0.85
              const colors = ['#e2367a', '#9fd0ef', '#f3df72', '#b4d94a', '#ffffff', '#c9a24b']
              return (
                <motion.rect
                  key={k}
                  x={Math.cos(a) * d * rx}
                  y={Math.sin(a) * d * ry}
                  width={4}
                  height={1.6}
                  rx={0.8}
                  fill={colors[k % colors.length]}
                  transform={`rotate(${seeded(k + 9) * 180} ${Math.cos(a) * d * rx} ${Math.sin(a) * d * ry})`}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: k * 0.015, type: 'spring', stiffness: 300, damping: 18 }}
                />
              )
            })}
          </motion.g>
        )}

        {has('fruits') && (
          <motion.g key="fruits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {rim
              .filter((_, i) => i % 9 === 4)
              .map(([x, y], k) => (
                <motion.g
                  key={k}
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: k * 0.06, type: 'spring', stiffness: 240, damping: 14 }}
                >
                  <path d={`M${x} ${y + 8}c-8 -3 -9 -12 -4 -14c2 -1 3 0 4 0c1 0 2 -1 4 0c5 2 4 11 -4 14z`} fill="#d62f3f" />
                  <path d={`M${x - 4} ${y - 5}l4 2l4 -2l-2 -2h-4z`} fill="#4f8a3a" />
                  <circle cx={x - 2} cy={y} r={0.6} fill="#ffe08a" />
                  <circle cx={x + 2} cy={y + 3} r={0.6} fill="#ffe08a" />
                </motion.g>
              ))}
          </motion.g>
        )}

        {has('printed-topper') && (
          <motion.g key="printed" {...pop}>
            <line x1={-rx * 0.48} y1={-ry * 0.2} x2={-rx * 0.48} y2={-ry * 0.2 - 30} stroke="#d8cbb6" strokeWidth={2} />
            <circle cx={-rx * 0.48} cy={-ry * 0.2 - 52} r={24} fill={`url(#${ids.photo})`} stroke="#fff" strokeWidth={3} />
            <text
              x={-rx * 0.48}
              y={-ry * 0.2 - 45}
              textAnchor="middle"
              fontSize={20}
              fontFamily="Cormorant Garamond, serif"
              fontWeight={600}
              fill="#fff"
            >
              {(design.name || '★').slice(0, 1).toUpperCase()}
            </text>
          </motion.g>
        )}

        {has('acrylic-topper') && (
          <motion.g key="acrylic" {...pop}>
            <line x1={-rx * 0.25} y1={-ry * 0.25} x2={-rx * 0.25} y2={-ry * 0.25 - 44} stroke={`url(#${ids.gold})`} strokeWidth={2} />
            <line x1={rx * 0.25} y1={-ry * 0.25} x2={rx * 0.25} y2={-ry * 0.25 - 44} stroke={`url(#${ids.gold})`} strokeWidth={2} />
            <text
              y={-ry * 0.25 - 48}
              textAnchor="middle"
              fontSize={topperSize}
              fontFamily="'Great Vibes', cursive"
              fill={`url(#${ids.gold})`}
              stroke="#8a6a25"
              strokeWidth={0.4}
            >
              {topperText}
            </text>
          </motion.g>
        )}

        {has('fresh-flowers') && (
          <motion.g key="flowers" {...pop}>
            {[
              [0.42, -0.25, 13, '#f4b6c2'],
              [0.62, 0.1, 11, '#fff6ea'],
              [0.3, 0.15, 10, '#fff6ea'],
              [0.55, -0.55, 9, '#f4b6c2'],
            ].map(([fx, fy, r, c], k) => (
              <Rose key={k} x={fx * rx} y={fy * ry} r={r} color={c} />
            ))}
            {Array.from({ length: 12 }, (_, k) => (
              <circle
                key={k}
                cx={rx * (0.25 + seeded(k) * 0.5)}
                cy={ry * (-0.6 + seeded(k + 4) * 0.9) - 6}
                r={1.8}
                fill={k % 3 ? '#e2367a' : '#ffffff'}
              />
            ))}
          </motion.g>
        )}

        {has('spheres') && (
          <motion.g key="spheres" {...pop}>
            {[
              [-0.58, 0.18, 12, 'gold'],
              [-0.38, 0.42, 9, 'black'],
              [-0.7, 0.45, 6.5, 'gold'],
            ].map(([sx, sy, r, kind], k) => (
              <circle
                key={k}
                cx={sx * rx}
                cy={sy * ry - r * 0.6}
                r={r}
                fill={kind === 'gold' ? `url(#${ids.sphereGold})` : `url(#${ids.sphereBlack})`}
              />
            ))}
          </motion.g>
        )}

        {has('sugar-figures') && (
          <motion.g key="figure" {...pop}>
            <g transform={`translate(${rx * 0.22} ${ry * 0.3})`}>
              <ellipse cx={0} cy={-11} rx={10} ry={11} fill="#c98a3e" />
              <ellipse cx={0} cy={-9} rx={6} ry={7} fill="#f0d2a5" />
              <circle cx={0} cy={-27} r={9} fill="#c98a3e" />
              <circle cx={-7} cy={-34} r={3.5} fill="#c98a3e" />
              <circle cx={7} cy={-34} r={3.5} fill="#c98a3e" />
              <ellipse cx={0} cy={-24} rx={4.2} ry={3.2} fill="#f0d2a5" />
              <circle cx={-3.2} cy={-29} r={1.2} fill="#2a211b" />
              <circle cx={3.2} cy={-29} r={1.2} fill="#2a211b" />
              <circle cx={0} cy={-25} r={1.2} fill="#2a211b" />
              <path d="M-5 -19h10l-5 4z" fill={accent} />
            </g>
          </motion.g>
        )}

        {has('candles') && (
          <motion.g key="candles" {...pop}>
            {design.age && /^\d{1,3}$/.test(design.age) ? (
              <text
                y={ry * 0.5}
                textAnchor="middle"
                fontSize={44}
                fontFamily="Jost, sans-serif"
                fontWeight={600}
                fill={lighten(candleColor, 0.1)}
                stroke={darken(candleColor, 0.25)}
                strokeWidth={1.2}
              >
                {design.age}
              </text>
            ) : (
              [-0.16, 0, 0.16].map((cx, k) => (
                <Candle key={k} x={cx * rx} y={ry * 0.45} height={30} color={candleColor} delay={k * 0.2} />
              ))
            )}
          </motion.g>
        )}
      </AnimatePresence>

      {/* name written on the top face (when no topper carries it) */}
      <AnimatePresence>
        {design.name && design.tiers === 1 && design.message && !has('acrylic-topper') && (
          <motion.text
            key="top-name"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            textAnchor="middle"
            transform={`translate(0 ${ry * 0.15}) scale(1 0.55)`}
            fontSize={Math.min(30, (rx * 1.6) / (design.name.length * 0.42))}
            fontFamily="'Great Vibes', cursive"
            fill={luminance(base) > 0.4 ? darken(accent, 0.1) : inkOn(base)}
          >
            {design.name}
          </motion.text>
        )}
      </AnimatePresence>
    </motion.g>
  )
}
