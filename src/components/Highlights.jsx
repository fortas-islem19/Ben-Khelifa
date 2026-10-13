import { highlights } from '../data/content'

export default function Highlights() {
  return (
    <section className="highlights">
      <div className="container highlights__grid">
        {highlights.map((h) => (
          <div key={h.title} className="highlights__item">
            <h3>{h.title}</h3>
            <p>{h.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
