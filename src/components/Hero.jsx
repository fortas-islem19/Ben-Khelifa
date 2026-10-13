import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import logo from '../assets/logo-full.png'
import { cakes } from '../data/cakes'
import { useOrderContext } from '../hooks/OrderContext'
import { WordsReveal } from './motion/Reveal'
import { ease } from './motion/variants'
import { seeded } from './cake/geometry'

const photos = [
  { depth: 26, rotate: 0, from: { x: -60, y: 40, rotate: -8 } },
  { depth: 50, rotate: 4, from: { x: 80, y: -40, rotate: 14 } },
  { depth: 38, rotate: -3, from: { x: 60, y: 80, rotate: -12 } },
]

export default function Hero() {
  const { startOrder } = useOrderContext()
  const ref = useRef(null)

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const galleryY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Pointer parallax
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 15 })
  const sy = useSpring(py, { stiffness: 60, damping: 15 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section className="hero" id="top" ref={ref} onPointerMove={onMove}>
      <Sparkles />
      <div className="container hero__inner">
        <motion.div className="hero__text" style={{ y: textY, opacity: fade }}>
          <motion.div
            className="hero__logo-wrap"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease }}
          >
            <svg className="hero__ring" viewBox="0 0 200 200" aria-hidden="true">
              <motion.circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="#c9a24b"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
              />
            </svg>
            <motion.svg
              className="hero__ring"
              viewBox="0 0 200 200"
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="100" cy="4" r="3" fill="#c9a24b" />
            </motion.svg>
            <img className="hero__logo" src={logo} alt="Pâtisserie Benkhelifa — depuis 2009" width="150" />
          </motion.div>

          <h1>
            <WordsReveal text="Le gâteau de vos" delay={0.4} /> <em><WordsReveal text="plus beaux" delay={0.68} /></em>{' '}
            <WordsReveal text="moments" delay={0.82} />
          </h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease }}
          >
            Anniversaires, fiançailles, mariages, réussites : choisissez un modèle de notre collection ou composez le vôtre
            de A à Z dans notre atelier en ligne.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease }}
          >
            <motion.button
              type="button"
              className="btn btn--dark btn--shine"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startOrder('custom')}
            >
              Créer mon gâteau
            </motion.button>
            <motion.a className="btn btn--ghost" href="#collection" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              Voir la collection
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div className="hero__gallery" aria-hidden="true" style={{ y: galleryY }}>
          {cakes.slice(0, 3).map((cake, i) => (
            <HeroPhoto key={cake.id} cake={cake} index={i} sx={sx} sy={sy} />
          ))}
          <motion.span
            className="hero__badge"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 1.2 }}
          >
            Depuis
            <strong>2009</strong>
          </motion.span>
        </motion.div>
      </div>

      <motion.a
        href="#collection"
        className="hero__scroll"
        aria-label="Défiler"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.span animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
      </motion.a>
    </section>
  )
}

function HeroPhoto({ cake, index, sx, sy }) {
  const p = photos[index]
  const x = useTransform(sx, [-0.5, 0.5], [-p.depth, p.depth])
  const y = useTransform(sy, [-0.5, 0.5], [-p.depth * 0.6, p.depth * 0.6])
  return (
    <motion.figure className={`hero__photo hero__photo--${index + 1}`} style={{ x, y }}>
      <motion.div
        className="hero__photo-inner"
        initial={{ opacity: 0, ...p.from, scale: 0.85 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: p.rotate, scale: 1 }}
        transition={{ duration: 1.1, ease, delay: 0.5 + index * 0.18 }}
        whileHover={{ scale: 1.04, rotate: 0, zIndex: 5 }}
      >
        <img src={cake.image} alt="" loading={index === 0 ? 'eager' : 'lazy'} />
      </motion.div>
    </motion.figure>
  )
}

function Sparkles() {
  return (
    <div className="sparkles" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <motion.span
          key={i}
          style={{ left: `${seeded(i) * 100}%`, top: `${seeded(i + 20) * 100}%`, fontSize: 8 + seeded(i + 40) * 12 }}
          animate={{ y: [0, -30, 0], opacity: [0, 0.8, 0], rotate: [0, 90, 180] }}
          transition={{ duration: 5 + seeded(i + 60) * 5, repeat: Infinity, delay: seeded(i + 80) * 5, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  )
}
