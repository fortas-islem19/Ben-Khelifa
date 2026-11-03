import { seeded } from '../utils/random'

const SPRINKLES = ['#ff8fb1', '#ffd166', '#7cc8ff', '#8fe3b5', '#c3a6ff']

/**
 * One fixed background behind the whole page: white, with soft pastel lights drifting
 * slowly, a faint dot grid and a few floating sprinkles. Pure CSS animations (cheap),
 * switched off when the visitor prefers reduced motion.
 */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="bd-blob bd-blob--1" />
      <span className="bd-blob bd-blob--2" />
      <span className="bd-blob bd-blob--3" />
      <span className="bd-blob bd-blob--4" />
      <div className="bd-dots" />
      {Array.from({ length: 22 }, (_, i) => (
        <span
          key={i}
          className="bd-sprinkle"
          style={{
            left: `${seeded(i) * 100}%`,
            top: `${seeded(i + 30) * 100}%`,
            background: SPRINKLES[i % SPRINKLES.length],
            '--r': `${Math.round(seeded(i + 60) * 180)}deg`,
            animationDuration: `${14 + seeded(i + 90) * 14}s`,
            animationDelay: `${-seeded(i + 120) * 20}s`,
          }}
        />
      ))}
    </div>
  )
}
