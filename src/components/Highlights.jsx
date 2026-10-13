import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { site } from '../config/site'
import { highlights } from '../data/content'
import { occasions } from '../data/options'
import { staggerChild, staggerParent } from './motion/variants'

function CountUp({ to }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (v) => ref.current && (ref.current.textContent = Math.round(v)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>0</span>
}

export default function Highlights() {
  const years = new Date().getFullYear() - site.since
  const words = [...occasions.filter((o) => o !== 'Autre'), 'Sur mesure', 'Fait main']

  return (
    <section className="highlights">
      <div className="marquee" aria-hidden="true">
        <motion.div className="marquee__track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
          {[...words, ...words].map((w, i) => (
            <span key={i}>
              {w} <i>✦</i>
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="container highlights__grid"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
      >
        <motion.div className="highlights__item" variants={staggerChild}>
          <h3>
            <CountUp to={years} /> ans
          </h3>
          <p>De savoir-faire artisanal, depuis {site.since}.</p>
        </motion.div>
        {highlights.slice(1).map((h) => (
          <motion.div key={h.title} className="highlights__item" variants={staggerChild}>
            <h3>{h.title}</h3>
            <p>{h.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
