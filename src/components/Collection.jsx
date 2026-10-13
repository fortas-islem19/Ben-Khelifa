import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useState } from 'react'
import { site } from '../config/site'
import { cakes, categories, customCake } from '../data/cakes'
import { useOrderContext } from '../hooks/OrderContext'
import { track } from '../services/pixel'
import { formatPrice } from '../utils/format'
import { Reveal } from './motion/Reveal'
import TiltCard from './TiltCard'

const cardMotion = {
  layout: true,
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  transition: { type: 'spring', stiffness: 120, damping: 18 },
}

export default function Collection() {
  const { startOrder } = useOrderContext()
  const [filter, setFilter] = useState('all')
  const visible = filter === 'all' ? cakes : cakes.filter((c) => c.category === filter)

  const order = (cake) => {
    track('ViewContent', {
      content_name: cake.name,
      content_ids: [cake.id],
      content_type: 'product',
      value: cake.basePrice,
      currency: site.currency.code,
    })
    startOrder(cake.id)
  }

  return (
    <section className="section" id="collection">
      <div className="container">
        <Reveal as="header" className="section__head">
          <span className="eyebrow">Notre collection</span>
          <h2>
            Des créations à commander telles quelles — <em>ou à réinventer</em>
          </h2>
          <p>Chaque modèle reste personnalisable : taille, saveurs, couleurs et message.</p>
        </Reveal>

        <Reveal className="chips" role="tablist" aria-label="Filtrer par occasion" delay={0.1}>
          <LayoutGroup id="filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={filter === cat.id}
                className={`chip ${filter === cat.id ? 'is-active' : ''}`}
                onClick={() => setFilter(cat.id)}
              >
                {filter === cat.id && <motion.span layoutId="chip-pill" className="chip__pill" transition={{ type: 'spring', stiffness: 300, damping: 26 }} />}
                <span>{cat.label}</span>
              </button>
            ))}
          </LayoutGroup>
        </Reveal>

        <motion.div className="cards" layout>
          <AnimatePresence mode="popLayout">
            {visible.map((cake, i) => (
              <motion.div key={cake.id} {...cardMotion} transition={{ ...cardMotion.transition, delay: i * 0.06 }}>
                <TiltCard className="card">
                  <div className="card__media">
                    <img src={cake.image} alt={cake.name} loading="lazy" />
                    <span className="card__category">{categories.find((c) => c.id === cake.category)?.label}</span>
                  </div>
                  <div className="card__body">
                    <h3>{cake.name}</h3>
                    <p>{cake.description}</p>
                    <ul className="tags">
                      {cake.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <div className="card__foot">
                      <span className="price">
                        <small>à partir de</small>
                        {formatPrice(cake.basePrice)}
                      </span>
                      <motion.button
                        type="button"
                        className="btn btn--dark btn--sm"
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => order(cake)}
                      >
                        Commander
                      </motion.button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}

            <motion.div key="custom" {...cardMotion}>
              <TiltCard className="card card--custom">
                <div className="card__body">
                  <motion.span
                    className="card__monogram"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 12, repeat: Infinity, ease: 'linear' }, scale: { duration: 3, repeat: Infinity } }}
                  >
                    ✦
                  </motion.span>
                  <h3>{customCake.name}</h3>
                  <p>Composez-le de A à Z dans l’atelier : étages, forme, saveurs, couleurs, décor — et voyez-le prendre vie.</p>
                  <motion.button
                    type="button"
                    className="btn btn--gold btn--shine"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => order(customCake)}
                  >
                    Ouvrir l’atelier
                  </motion.button>
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
