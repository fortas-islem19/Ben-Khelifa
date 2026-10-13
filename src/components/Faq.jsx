import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { faq } from '../data/content'
import { Reveal } from './motion/Reveal'

export default function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" id="faq">
      <div className="container container--narrow">
        <Reveal as="header" className="section__head">
          <span className="eyebrow">Questions fréquentes</span>
          <h2>Bon à savoir</h2>
        </Reveal>
        <div className="faq">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <Reveal key={item.q} className="faq__item" delay={i * 0.06}>
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{item.q}</span>
                  <motion.i animate={{ rotate: isOpen ? 45 : 0 }} aria-hidden="true">
                    +
                  </motion.i>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
