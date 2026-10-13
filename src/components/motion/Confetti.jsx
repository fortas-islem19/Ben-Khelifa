import { motion } from 'motion/react'
import { seeded } from '../cake/geometry'

const COLORS = ['#c9a24b', '#f2c4c9', '#1a1a1a', '#d9bd7e', '#e2367a', '#ffffff']

/** One-shot burst of confetti from the centre of its parent. */
export default function Confetti({ count = 46 }) {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const angle = seeded(i) * Math.PI * 2
        const dist = 120 + seeded(i + 100) * 220
        return (
          <motion.span
            key={i}
            style={{ background: COLORS[i % COLORS.length], borderRadius: i % 3 ? 2 : '50%' }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: [0, Math.sin(angle) * dist - 80, Math.sin(angle) * dist + 160],
              opacity: [1, 1, 0],
              rotate: seeded(i + 7) * 720,
              scale: 1,
            }}
            transition={{ duration: 1.8 + seeded(i + 3), ease: 'easeOut', delay: 0.15 }}
          />
        )
      })}
    </div>
  )
}
