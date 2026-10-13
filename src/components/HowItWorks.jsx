import { steps } from '../data/content'

export default function HowItWorks() {
  return (
    <section className="section section--tinted" id="etapes">
      <div className="container">
        <header className="section__head">
          <span className="eyebrow">Comment ça marche</span>
          <h2>Votre gâteau en quatre étapes</h2>
        </header>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="steps__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
