import { findCake } from '../../data/cakes'
import * as opt from '../../data/options'
import { formatDate, formatPrice } from '../../utils/format'
import { estimatePrice } from '../../utils/pricing'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback } from 'react'
import CakePreview from '../cake/CakePreview'
import { designFromOrder } from '../cake/design'
import AnimatedNumber from '../motion/AnimatedNumber'

const label = (list, id) => opt.byId(list, id)?.label

export default function OrderSummary({ order }) {
  const cake = findCake(order.cakeId)
  const price = estimatePrice(order)
  const size = opt.byId(opt.sizes, order.size)
  const isCustom = order.cakeId === 'custom'
  const fmt = useCallback((n) => formatPrice(Math.round(n / 10) * 10), [])

  const rows = [
    ['Occasion', order.occasion],
    ['Taille', size && `${size.label} · ${size.servings}`],
    ['Structure', isCustom && `${opt.byId(opt.tiers, Number(order.tiers))?.label} · ${opt.byId(opt.shapes, order.shape)?.label}`],
    ['Génoise', label(opt.sponges, order.sponge)],
    ['Garniture', label(opt.fillings, order.filling)],
    ['Finition', label(opt.finishes, order.finish)],
    ['Couleurs', isCustom && [opt.colorName(order.baseColor), opt.colorName(order.accentColor)].filter(Boolean).join(' & ')],
    ['Décor', order.decorations.map((id) => label(opt.decorations, id)).join(', ')],
    ['Inscription', [order.nameOnCake, order.age && `${order.age} ans`, order.message].filter(Boolean).join(' · ')],
    ['Date', order.date && `${formatDate(order.date)}${order.timeSlot ? `, ${order.timeSlot}` : ''}`],
    ['Retrait', order.date && label(opt.fulfillment, order.fulfillment)],
  ].filter(([, v]) => v)

  return (
    <aside className="summary" aria-label="Récapitulatif">
      <div className={`summary__media ${isCustom ? 'summary__media--cake' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={order.cakeId || 'none'}
            className="summary__media-inner"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
          >
            {isCustom ? (
              <CakePreview design={designFromOrder(order)} data-cake-preview="summary" />
            ) : cake?.image ? (
              <img src={cake.image} alt="" />
            ) : (
              <span className="summary__placeholder">✦</span>
            )}
          </motion.div>
        </AnimatePresence>
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
            <AnimatePresence initial={false}>
              {rows.map(([k, v]) => (
                <motion.div key={k} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </motion.div>
              ))}
            </AnimatePresence>
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
              <strong>{price.onQuote ? 'Sur devis' : <AnimatedNumber value={price.total} format={fmt} />}</strong>
            </p>
            <p className="summary__note">Prix indicatif, confirmé par notre équipe.</p>
          </div>
        )}
      </div>
    </aside>
  )
}
