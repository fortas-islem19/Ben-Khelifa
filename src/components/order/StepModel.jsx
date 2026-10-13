import { cakes, customCake } from '../../data/cakes'
import { occasions } from '../../data/options'
import { formatPrice } from '../../utils/format'
import { Group } from '../form/Field'

export default function StepModel({ order, set, selectCake, errors }) {
  const options = [...cakes, customCake]

  return (
    <div className="step">
      <Group legend="Quel gâteau souhaitez-vous ?" error={errors.cakeId}>
        <div className="model-grid">
          {options.map((cake) => (
            <label key={cake.id} className={`model ${order.cakeId === cake.id ? 'is-checked' : ''}`}>
              <input
                type="radio"
                name="cakeId"
                checked={order.cakeId === cake.id}
                onChange={() => selectCake(cake.id)}
              />
              <span className="model__media">
                {cake.image ? <img src={cake.image} alt="" loading="lazy" /> : <span className="model__custom">✦</span>}
              </span>
              <span className="model__name">{cake.name}</span>
              <span className="model__price">
                {cake.image ? `dès ${formatPrice(cake.basePrice)}` : 'Votre idée, notre savoir-faire'}
              </span>
            </label>
          ))}
        </div>
      </Group>

      <Group legend="Pour quelle occasion ?" error={errors.occasion}>
        <div className="choices choices--chip">
          {occasions.map((o) => (
            <label key={o} className={`choice choice--chip ${order.occasion === o ? 'is-checked' : ''}`}>
              <input type="radio" name="occasion" checked={order.occasion === o} onChange={() => set('occasion', o)} />
              <span className="choice__title">{o}</span>
            </label>
          ))}
        </div>
      </Group>
    </div>
  )
}
