import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useState } from 'react'
import monogram from '../assets/monogram.png'
import { site } from '../config/site'
import { useOrderContext } from '../hooks/OrderContext'

const links = [
  { href: '#collection', label: 'Collection' },
  { href: '#atelier', label: 'L’atelier' },
  { href: '#etapes', label: 'Comment ça marche' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const { startOrder } = useOrderContext()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 400 && y > prev && !open)
  })

  return (
    <motion.header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <motion.div className="header__progress" style={{ scaleX: progress }} />
      <div className="container header__inner">
        <a href="#top" className="header__brand" aria-label={site.name}>
          <motion.img src={monogram} alt="" width="40" height="40" whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} />
          <span>
            <small>Pâtisserie</small>
            {site.shortName}
          </span>
        </a>

        <nav className={`header__nav ${open ? 'is-open' : ''}`} aria-label="Navigation principale" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} onMouseEnter={() => setHovered(l.href)}>
              {l.label}
              <AnimatePresence>
                {hovered === l.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="header__underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <motion.button
            type="button"
            className="btn btn--dark btn--sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setOpen(false)
              startOrder()
            }}
          >
            Commander
          </motion.button>
          <button
            type="button"
            className={`header__burger ${open ? 'is-open' : ''}`}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
