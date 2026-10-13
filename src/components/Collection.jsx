import { useState } from 'react'
import { cakes, categories, customCake } from '../data/cakes'
import { useOrderContext } from '../hooks/OrderContext'
import { track } from '../services/pixel'
import { site } from '../config/site'
import { formatPrice } from '../utils/format'

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
        <header className="section__head">
          <span className="eyebrow">Notre collection</span>
          <h2>Des créations à commander telles quelles — ou à réinventer</h2>
          <p>Chaque modèle reste personnalisable : taille, saveurs, couleurs et message.</p>
        </header>

        <div className="chips" role="tablist" aria-label="Filtrer par occasion">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={filter === cat.id}
              className={`chip ${filter === cat.id ? 'is-active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="cards">
          {visible.map((cake) => (
            <article key={cake.id} className="card">
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
                  <button type="button" className="btn btn--dark btn--sm" onClick={() => order(cake)}>
                    Commander
                  </button>
                </div>
              </div>
            </article>
          ))}

          <article className="card card--custom">
            <div className="card__body">
              <span className="card__monogram">✦</span>
              <h3>{customCake.name}</h3>
              <p>{customCake.description}</p>
              <button type="button" className="btn btn--gold" onClick={() => order(customCake)}>
                Imaginer mon gâteau
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
