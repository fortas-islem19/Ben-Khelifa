import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useState } from 'react'
import monogram from '../assets/monogram.png'
import { site } from '../config/site'
import { useOrderContext } from '../hooks/OrderContext'

export default function Header() {
  const { startOrder } = useOrderContext()
  const [scrolled, setScrolled] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <motion.div className="header__progress" style={{ scaleX: progress }} />
      <div className="container header__inner">
        <a href="#top" className="header__brand" aria-label={site.name}>
          <motion.img src={monogram} alt="" width="40" height="40" whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} />
          <span>
            <small>Pâtisserie</small>
            {site.shortName}
          </span>
        </a>

        <div className="header__actions">
          <a className="header__phone" href={site.contact.phoneHref}>
            {site.contact.phoneDisplay}
          </a>
          <motion.button
            type="button"
            className="btn btn--dark btn--sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startOrder()}
          >
            Commander
          </motion.button>
        </div>
      </div>
    </header>
  )
}
