import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { site } from '../config/site'
import { hero } from '../data/content'
import { byId, themes } from '../data/options'
import { useOrderContext } from '../hooks/OrderContext'
import { track } from '../services/pixel'
import { WordsReveal } from './motion/Reveal'
import { ease } from './motion/variants'
import PhoneIcon from './PhoneIcon'
import ThemeArt from './ThemeArt'

const photoLayout = [
  { rotate: -4, from: { x: -60, y: 40 }, float: 10, duration: 6 },
  { rotate: 5, from: { x: 80, y: -40 }, float: 14, duration: 7 },
  { rotate: -2, from: { x: 60, y: 80 }, float: 8, duration: 5.5 },
]

export default function Hero() {
  const { startOrder } = useOrderContext()

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <motion.span
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            {site.name} · depuis {site.since}
          </motion.span>
          <h1>
            <WordsReveal text="Votre gâteau à thème," delay={0.15} /> <em><WordsReveal text="en 5 étapes" delay={0.45} /></em>
          </h1>
          <motion.p
            className="lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease }}
          >
            Choisissez le thème, la dimension, la date, le goût et ce que vous voulez écrire dessus. On s’occupe du reste.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
          >
            <motion.button
              type="button"
              className="btn btn--dark btn--shine"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startOrder()}
            >
              Commander mon gâteau
            </motion.button>
            <motion.a
              className="btn btn--ghost"
              href={site.contact.phoneHref}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => track('Contact', { method: 'phone' })}
            >
              <PhoneIcon />
              {site.contact.phoneDisplay}
            </motion.a>
          </motion.div>
        </div>

        <div className="hero__gallery" aria-hidden="true">
          <HeroFrame index={0}>
            <img src={hero.main.src} alt={hero.main.alt} fetchPriority="high" />
          </HeroFrame>
          {hero.rotations.map((ids, i) => (
            <HeroFrame key={i} index={i + 1}>
              <RotatingTheme ids={ids} offset={i} />
            </HeroFrame>
          ))}
          <motion.span
            className="hero__badge"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 1 }}
          >
            Depuis
            <strong>{site.since}</strong>
          </motion.span>
        </div>
      </div>

      <ThemeMarquee onPick={(theme) => startOrder(theme.id)} />
    </section>
  )
}

/** A tilted, floating photo frame of the hero gallery. */
function HeroFrame({ index, children }) {
  const p = photoLayout[index]
  return (
    <motion.figure
      className={`hero__photo hero__photo--${index + 1}`}
      initial={{ opacity: 0, scale: 0.85, rotate: p.rotate * 3, ...p.from }}
      animate={{ opacity: 1, scale: 1, rotate: p.rotate, x: 0, y: 0 }}
      transition={{ duration: 1.1, ease, delay: 0.3 + index * 0.15 }}
    >
      <div
        className="hero__photo-inner"
        style={{ '--float': `${-p.float}px`, animationDuration: `${p.duration}s`, animationDelay: `${1.4 + index * 0.4}s` }}
      >
        {children}
      </div>
    </motion.figure>
  )
}

/** Cross-fades through the photos of several themes, with the theme name. */
function RotatingTheme({ ids, offset }) {
  const list = useMemo(() => ids.map((id) => byId(themes, id)).filter((t) => t?.image), [ids])
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    // Preload the next photos so each fade is instant
    list.forEach((t) => {
      new Image().src = t.image
    })
  }, [list])

  useEffect(() => {
    if (reduceMotion || list.length < 2) return
    let timer
    // The two frames change one after the other, not at the same time
    const start = setTimeout(() => {
      setIndex((i) => (i + 1) % list.length)
      timer = setInterval(() => setIndex((i) => (i + 1) % list.length), hero.interval * 1000)
    }, (hero.interval + offset * (hero.interval / 2)) * 1000)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [reduceMotion, list.length, offset])

  const theme = list[index]
  if (!theme) return null
  return (
    <>
      <AnimatePresence initial={false}>
        <motion.img
          key={theme.id}
          src={theme.image}
          alt=""
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease }}
        />
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme.id}
          className="hero__tag"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {theme.label}
        </motion.span>
      </AnimatePresence>
    </>
  )
}

/** Endless strip of the themes; tapping one starts an order with it. */
function ThemeMarquee({ onPick }) {
  return (
    <motion.div
      className="marquee"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <div className="marquee__track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee__list" aria-hidden={copy === 1 || undefined}>
            {themes.map((theme) => (
              <li key={theme.id}>
                <button type="button" className="marquee__item" tabIndex={copy === 1 ? -1 : undefined} onClick={() => onPick(theme)}>
                  <ThemeArt theme={theme} className="theme-art--mini" />
                  {theme.label}
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </motion.div>
  )
}
