import { faq } from '../data/content'

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container container--narrow">
        <header className="section__head">
          <span className="eyebrow">Questions fréquentes</span>
          <h2>Bon à savoir</h2>
        </header>
        <div className="faq">
          {faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
