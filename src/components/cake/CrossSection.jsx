import { motion } from 'motion/react'
import { darken } from '../../utils/color'
import { cakeLayout } from './layout'

/** "Vue en coupe": the inside of the cake, layer by layer. */
export default function CrossSection({ design }) {
  const { tiers } = cakeLayout(design)
  const frosting = design.finish === 'naked' ? 0 : 6
  const frostColor = design.finish === 'drip' || design.finish === 'chantilly' ? '#fbf6ee' : design.base
  const layers = [0.27, 0.1, 0.26, 0.1, 0.27]
  const labelTier = tiers[0]
  let order = 0

  return (
    <g>
      {tiers.map((t) => {
        const x = 200 - t.w / 2 + 10
        const width = t.w - 20
        const innerTop = t.topY + frosting
        const innerH = t.h - frosting
        let acc = innerTop
        return (
          <g key={t.index}>
            <motion.rect
              x={x - frosting}
              y={t.topY}
              width={width + frosting * 2}
              height={t.h}
              rx={4}
              fill={frostColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            {layers.map((ratio, i) => {
              const y = acc
              const hh = ratio * innerH
              acc += hh
              const idx = order++
              return (
                <motion.rect
                  key={i}
                  x={x}
                  y={y}
                  width={width}
                  height={hh + 0.5}
                  fill={i % 2 ? design.filling : design.sponge}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * idx, type: 'spring', stiffness: 160, damping: 20 }}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
                />
              )
            })}
            {/* crumb texture */}
            {Array.from({ length: Math.round(width / 9) }, (_, k) => (
              <circle
                key={k}
                cx={x + ((k * 37) % width)}
                cy={innerTop + ((k * 53) % innerH)}
                r={0.9}
                fill={darken(design.sponge, 0.18)}
                opacity={0.5}
              />
            ))}
          </g>
        )
      })}
      <rect x={200 - tiers[0].w / 2 - 20} y={tiers[0].bottomY} width={tiers[0].w + 40} height={7} rx={3} fill="#d9bd7e" />

      <Label y={labelTier.topY + frosting + labelTier.h * 0.1} text={`Génoise · ${design.spongeLabel}`} delay={0.35} />
      <Label y={labelTier.topY + frosting + labelTier.h * 0.32} text={`Garniture · ${design.fillingLabel}`} delay={0.45} />
    </g>
  )
}

function Label({ y, text, delay }) {
  const width = text.length * 6 + 22
  return (
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <rect x={200 - width / 2} y={y - 11} width={width} height={22} rx={11} fill="#1a1a1a" opacity={0.86} />
      <text x={200} y={y + 4} textAnchor="middle" fontSize={11} fontFamily="Jost, sans-serif" fill="#fbf8f3">
        {text}
      </text>
    </motion.g>
  )
}
