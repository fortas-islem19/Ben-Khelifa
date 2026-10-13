import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useOrderContext } from '../hooks/OrderContext'
import CakePreview from './cake/CakePreview'
import { designFromOrder } from './cake/design'
import { Reveal } from './motion/Reveal'
import { staggerChild, staggerParent } from './motion/variants'

/** A few showcase designs the teaser morphs between. */
const showcase = [
  { tiers: 1, shape: 'round', finish: 'drip', baseColor: '#f2c4c9', accentColor: '#6b3e26', decorations: ['candles', 'spheres', 'sprinkles'], nameOnCake: '', message: 'Joyeux anniversaire', sponge: 'chocolate', filling: 'praline' },
  { tiers: 2, shape: 'round', finish: 'fondant', baseColor: '#ffffff', accentColor: '#c9a24b', decorations: ['fresh-flowers', 'acrylic-topper', 'gold-leaf'], nameOnCake: 'Sara & Yanis', message: '', sponge: 'vanilla', filling: 'chantilly-berries' },
  { tiers: 1, shape: 'heart', finish: 'buttercream', baseColor: '#c8b6e2', accentColor: '#ffffff', decorations: ['fruits', 'printed-topper'], nameOnCake: 'Lina', message: '', sponge: 'red-velvet', filling: 'strawberry-mousse' },
  { tiers: 3, shape: 'round', finish: 'buttercream', baseColor: '#1f2f56', accentColor: '#c9a24b', decorations: ['spheres', 'gold-leaf', 'acrylic-topper'], nameOnCake: 'Félicitations', message: '', sponge: 'almond', filling: 'salted-caramel' },
  { tiers: 1, shape: 'square', finish: 'naked', baseColor: '#ffffff', accentColor: '#c9a24b', decorations: ['fresh-flowers', 'fruits'], nameOnCake: '', message: '', sponge: 'pistachio', filling: 'pistachio-cream' },
].map((d) => ({ size: 'l', age: '', occasion: '', ...d }))

const features = [
  ['01', 'Structure', '1 à 3 étages, rond, carré, cœur…'],
  ['02', 'Saveurs', 'Génoise et garniture, visibles en coupe'],
  ['03', 'Habillage', 'Crème, pâte à sucre, drip, naked — vos couleurs'],
  ['04', 'Décor', 'Fleurs, toppers, bougies, prénom, message'],
]

export default function StudioTeaser() {
  const { startOrder } = useOrderContext()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % showcase.length), 3200)
    return () => clearInterval(id)
  }, [paused])

  return (
    <section className="section studio" id="atelier">
      <div className="container studio__inner">
        <div className="studio__text">
          <Reveal>
            <span className="eyebrow">Nouveau · l’atelier en ligne</span>
            <h2>
              Votre gâteau, <em>de A à Z</em>
            </h2>
            <p className="lead">
              Composez votre création étape par étape et regardez-la prendre forme en direct. Nos pâtissiers reçoivent
              votre aperçu et le réalisent à la main.
            </p>
          </Reveal>
          <motion.ul className="studio__features" variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {features.map(([n, t, d]) => (
              <motion.li key={n} variants={staggerChild}>
                <span>{n}</span>
                <div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <Reveal delay={0.2}>
            <motion.button
              type="button"
              className="btn btn--gold btn--shine"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startOrder('custom')}
            >
              Commencer ma création
            </motion.button>
          </Reveal>
        </div>

        <Reveal className="studio__stage" delay={0.15} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          <div className="studio__halo" aria-hidden="true" />
          <CakePreview design={designFromOrder(showcase[index])} interactive />
          <div className="studio__dots">
            {showcase.map((_, i) => (
              <button key={i} type="button" aria-label={`Création ${i + 1}`} onClick={() => setIndex(i)} className={i === index ? 'is-active' : ''}>
                {i === index && <motion.span layoutId="studio-dot" />}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
