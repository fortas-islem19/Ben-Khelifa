import { AnimatePresence, motion } from 'motion/react'
import { inkOn, luminance } from '../../utils/color'

/** Script text piped on the front of a tier. */
export default function SideText({ text, tier, design }) {
  const { base, accent, finish } = design
  const bg = finish === 'chantilly' ? '#fbf6ee' : base
  const contrast = Math.abs(luminance(accent) - luminance(bg)) > 0.25
  const fill = finish === 'naked' ? '#fffaf2' : contrast ? accent : inkOn(bg)
  const size = Math.min(30, (tier.w * 0.82) / Math.max(1, text.length * 0.4))

  return (
    <AnimatePresence>
      {text && (
        <motion.text
          key="side-text"
          initial={{ opacity: 0, x: 200, y: tier.bottomY - tier.h * 0.5 + tier.ry + 10 }}
          animate={{ opacity: 1, x: 200, y: tier.bottomY - tier.h * 0.5 + tier.ry * 0.9 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 130, damping: 18 }}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size}
          fontFamily="'Great Vibes', cursive"
          fill={fill}
          stroke={finish === 'naked' ? '#5a3a24' : 'none'}
          strokeWidth={finish === 'naked' ? 0.6 : 0}
        >
          {text}
        </motion.text>
      )}
    </AnimatePresence>
  )
}
