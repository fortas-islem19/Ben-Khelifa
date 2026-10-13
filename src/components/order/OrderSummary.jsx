import { findCake } from '../../data/cakes'
import * as opt from '../../data/options'
import { formatDate, formatPrice } from '../../utils/format'
import { estimatePrice } from '../../utils/pricing'

const label = (list, id) => opt.byId(list, id)?.label

export default function OrderSummary({ order }) {
  const cake = findCake(order.cakeId)
  const price = estimatePrice(order)
  const size = opt.byId(opt.sizes, order.size)

  const rows = [
    ['Occasion', order.occasion],
    ['Taille', size && `${size.label} · ${size.servings}`],
    ['Génoise', label(opt.sponges, order.sponge)],
    ['Garniture', label(opt.fillings, order.filling)],
    ['Finition', label(opt.finishes, order.finish)],
    ['Inscription', [order.nameOnCake, order.age && `${order.age} ans`, order.message].filter(Boolean).join(' · ')],
    ['Date', order.date && `${formatDate(order.date)}${order.timeSlot ? `, ${order.timeSlot}` : ''}`],
    ['Retrait', order.date && label(opt.fulfillment, order.fulfillment)],
  ].filter(([, v]) => v)

  return (
    <aside className="summary" aria-label="Récapitulatif">
      <div className="summary__media">
        {cake?.image ? (
          <img src={cake.image} alt="" />
        ) : order.referenceImage ? (
          <img src={order.referenceImage.preview} alt="" />
        ) : (
          <span className="summary__placeholder">✦</span>
        )}
      </div>
      <div className="summary__body">
        <span className="eyebrow">Votre commande</span>
        <h3>{cake ? cake.name : 'Choisissez un modèle'}</h3>

        {order.colors.length > 0 && (
          <div className="summary__colors">
            {order.colors.map((id) => {
              const c = opt.byId(opt.colors, id)
              return <span key={id} title={c.label} style={{ background: c.hex }} />
            })}
          </div>
        )}

        {rows.length > 0 && (
          <dl className="summary__rows">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {cake && (
          <div className="summary__price">
            {price.lines.length > 1 && (
              <ul>
                {price.lines.map((l) => (
                  <li key={l.label}>
                    <span>{l.label}</span>
                    <span>{formatPrice(l.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="summary__total">
              <span>Estimation</span>
              <strong>{price.onQuote ? 'Sur devis' : formatPrice(price.total)}</strong>
            </p>
            <p className="summary__note">Prix indicatif, confirmé par notre équipe.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
