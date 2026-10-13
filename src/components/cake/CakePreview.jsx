import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useId } from 'react'
import CrossSection from './CrossSection'
import Decorations from './Decorations'
import { cakeLayout, VIEW } from './layout'
import SideText from './SideText'
import Tier from './Tier'

/**
 * Live, animated drawing of the cake being designed.
 * @param {object}  design   output of designFromOrder()
 * @param {'outside'|'inside'} view
 * @param {boolean} interactive  3D tilt following the pointer + idle float
 */
export default function CakePreview({ design, view = 'outside', interactive = false, className = '', ...rest }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ids = {
    prefix: uid,
    shade: `${uid}-shade`,
    gloss: `${uid}-gloss`,
    gold: `${uid}-gold`,
    photo: `${uid}-photo`,
    sphereGold: `${uid}-sg`,
    sphereBlack: `${uid}-sb`,
  }
  const { tiers, board, top, zoom } = cakeLayout(design)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 15 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 15 })

  const onMove = (e) => {
    if (!interactive) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const bottomText = design.message || (design.tiers === 1 && !design.decorations.includes('acrylic-topper') ? design.name : '')
  const topText = design.tiers > 1 && !design.decorations.includes('acrylic-topper') ? design.name : ''

  return (
    <div className={`cake-preview ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      <motion.div
        className="cake-preview__stage"
        style={interactive ? { rotateX, rotateY } : undefined}
        animate={interactive ? { y: [0, -6, 0] } : undefined}
        transition={interactive ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Aperçu de votre gâteau">
          <defs>
            <linearGradient id={ids.shade} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#000" stopOpacity="0.22" />
              <stop offset="0.3" stopColor="#fff" stopOpacity="0.08" />
              <stop offset="0.55" stopColor="#fff" stopOpacity="0.14" />
              <stop offset="1" stopColor="#000" stopOpacity="0.28" />
            </linearGradient>
            <radialGradient id={ids.gloss} cx="0.4" cy="0.35" r="0.7">
              <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={ids.gold} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f6e1a6" />
              <stop offset="0.45" stopColor="#c9a24b" />
              <stop offset="0.7" stopColor="#f3d98f" />
              <stop offset="1" stopColor="#9c7a2e" />
            </linearGradient>
            <linearGradient id={ids.photo} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#9fd0ef" />
              <stop offset="0.6" stopColor="#c8b6e2" />
              <stop offset="1" stopColor="#f2c4c9" />
            </linearGradient>
            <radialGradient id={ids.sphereGold} cx="0.35" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#fff4cf" />
              <stop offset="0.4" stopColor="#d4ac55" />
              <stop offset="1" stopColor="#7d5d1f" />
            </radialGradient>
            <radialGradient id={ids.sphereBlack} cx="0.35" cy="0.3" r="0.75">
              <stop offset="0" stopColor="#777" />
              <stop offset="0.35" stopColor="#222" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <radialGradient id="flame" cx="0.5" cy="0.7" r="0.6">
              <stop offset="0" stopColor="#fff6c2" />
              <stop offset="0.5" stopColor="#ffc53d" />
              <stop offset="1" stopColor="#ff7a1a" />
            </radialGradient>
          </defs>

          <g
            style={{
              transformBox: 'view-box',
              transformOrigin: `200px ${VIEW.floor + 40}px`,
              transform: `scale(${zoom})`,
              transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* floor shadow + board */}
            <motion.ellipse
              cx={200}
              initial={false}
              animate={{ cy: board.y + 14, rx: board.rx + 14, ry: (board.rx + 14) * 0.18 }}
              fill="#2a211b"
              opacity={0.12}
            />
            <motion.ellipse cx={200} initial={false} animate={{ cy: board.y + 3, rx: board.rx, ry: board.rx * 0.3 }} fill="#c9a24b" />
            <motion.ellipse cx={200} initial={false} animate={{ cy: board.y, rx: board.rx - 2, ry: board.rx * 0.3 - 2 }} fill="#fbf6ee" />

            <AnimatePresence mode="wait">
              {view === 'inside' ? (
                <motion.g key="inside" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CrossSection design={design} />
                </motion.g>
              ) : (
                <motion.g key="outside" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AnimatePresence>
                    {tiers.map((t) => (
                      <Tier key={t.index} tier={t} design={design} ids={ids} delay={t.index * 0.08} />
                    ))}
                  </AnimatePresence>
                  <SideText text={bottomText} tier={tiers[0]} design={design} />
                  {tiers.length > 1 && <SideText text={topText} tier={top} design={design} />}
                  <Decorations design={design} tier={top} ids={ids} />
                </motion.g>
              )}
            </AnimatePresence>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
