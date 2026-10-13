import { motion } from 'motion/react'
import { steps } from '../data/content'
import { Reveal } from './motion/Reveal'
import { ease } from './motion/variants'

export default function HowItWorks() {
  return (
    <section className="section section--tinted" id="etapes">
      <div className="container">
        <Reveal as="header" className="section__head">
          <span className="eyebrow">Comment ça marche</span>
          <h2>Votre gâteau en quatre étapes</h2>
        </Reveal>
        <ol className="steps">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease, delay: i * 0.15 }}
            >
              <motion.span
                className="steps__line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.15 }}
              />
              <span className="steps__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
