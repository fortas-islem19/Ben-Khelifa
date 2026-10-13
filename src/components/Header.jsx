import { useEffect, useState } from 'react'
import monogram from '../assets/monogram.png'
import { site } from '../config/site'
import { useOrderContext } from '../hooks/OrderContext'

const links = [
  { href: '#collection', label: 'Collection' },
  { href: '#etapes', label: 'Comment ça marche' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const { startOrder } = useOrderContext()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a href="#top" className="header__brand" aria-label={site.name}>
          <img src={monogram} alt="" width="40" height="40" />
          <span>
            <small>Pâtisserie</small>
            {site.shortName}
          </span>
        </a>

        <nav className={`header__nav ${open ? 'is-open' : ''}`} aria-label="Navigation principale">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <button
            type="button"
            className="btn btn--dark btn--sm"
            onClick={() => {
              setOpen(false)
              startOrder()
            }}
          >
            Commander
          </button>
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
    </header>
  )
}
