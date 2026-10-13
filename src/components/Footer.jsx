import logo from '../assets/logo-full.png'
import { site } from '../config/site'

export default function Footer() {
  const { contact } = site
  return (
    <footer className="footer" id="contact">
      <div className="container footer__grid">
        <div>
          <img className="footer__logo" src={logo} alt={site.name} width="150" />
        </div>
        <div>
          <h4>Boutique</h4>
          <p>
            <a href={contact.mapsUrl} target="_blank" rel="noreferrer">
              {contact.address}
            </a>
          </p>
          {contact.hours.map((h) => (
            <p key={h.days}>
              {h.days} · {h.time}
            </p>
          ))}
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          </p>
          <p>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
          <p className="footer__social">
            <a href={contact.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={contact.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
          </p>
        </div>
      </div>
      <div className="container footer__bottom">
        © {new Date().getFullYear()} {site.name} — Depuis {site.since}
      </div>
    </footer>
  )
}
