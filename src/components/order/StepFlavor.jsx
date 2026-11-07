import { flavors } from '../../data/options'
import OptionCard from './OptionCard'
import StepTitle from './StepTitle'

export default function StepFlavor({ order, set, advance, errors }) {
  return (
    <div className="step">
      <StepTitle title="Choisissez le goût" error={errors.flavor} />
      <div className="options options--flavors" role="radiogroup" aria-label="Goût">
        {flavors.map((flavor) => (
          <OptionCard
            key={flavor.id}
            className="option--flavor"
            checked={order.flavor === flavor.id}
            onSelect={() => {
              set('flavor', flavor.id)
              advance()
            }}
            art={
              flavor.image ? (
                <span className="theme-art theme-art--photo">
                  <img src={flavor.image} alt="" loading="lazy" />
                </span>
              ) : (
                <span className="theme-art" style={{ background: `radial-gradient(circle at 28% 22%, ${flavor.colors[1]}, ${flavor.colors[0]} 75%)` }}>
                  <span className="theme-art__emoji">{flavor.emoji}</span>
                </span>
              )
            }
            title={flavor.label}
          />
        ))}
      </div>
    </div>
  )
}
