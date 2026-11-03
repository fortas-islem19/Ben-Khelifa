import { motion } from 'motion/react'
import { site } from '../config/site'
import { heroPhotos } from '../data/content'
import { themes } from '../data/options'
import { useOrderContext } from '../hooks/OrderContext'
import { track } from '../services/pixel'
import { WordsReveal } from './motion/Reveal'
import { ease } from './motion/variants'
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
            <motion.a className="btn btn--ghost" href={site.contact.phoneHref} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              Appeler
            </motion.a>
          </motion.div>
        </div>

        <div className="hero__gallery" aria-hidden="true">
          {heroPhotos.map((photo, i) => {
            const p = photoLayout[i]
            return (
              <motion.figure
                key={photo.src}
                className={`hero__photo hero__photo--${i + 1}`}
                initial={{ opacity: 0, scale: 0.85, rotate: p.rotate * 3, ...p.from }}
                animate={{ opacity: 1, scale: 1, rotate: p.rotate, x: 0, y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.3 + i * 0.15 }}
              >
                <div
                  className="hero__photo-inner"
                  style={{ '--float': `${-p.float}px`, animationDuration: `${p.duration}s`, animationDelay: `${1.4 + i * 0.4}s` }}
                >
                  <img src={photo.src} alt={photo.alt} loading={i === 0 ? 'eager' : 'lazy'} />
                </div>
              </motion.figure>
            )
          })}
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

      <ThemeMarquee
        onPick={(theme) => {
          track('ViewContent', { content_name: theme.label, content_ids: [theme.id] })
          startOrder(theme.id)
        }}
      />
    </section>
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
