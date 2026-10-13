import { motion } from 'motion/react'
import { formatPrice } from '../../utils/format'

/**
 * Accessible radio / checkbox rendered as a selectable tile.
 * variant: "tile" (title + subtitle) | "chip" (compact pill)
 */
export function Choice({ type = 'radio', name, checked, onChange, title, subtitle, price, disabled, variant = 'tile' }) {
  return (
    <motion.label
      className={`choice choice--${variant} ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} disabled={disabled} />
      <span className="choice__title">{title}</span>
      {subtitle && <span className="choice__subtitle">{subtitle}</span>}
      {price > 0 && <span className="choice__price">+ {formatPrice(price)}</span>}
    </motion.label>
  )
}

/** Single-choice list from an options array `{ id, label, hint?, price? }`. */
export function ChoiceList({ name, options, value, onChange, variant = 'chip', subtitleKey = 'hint' }) {
  return (
    <div className={`choices choices--${variant}`}>
      {options.map((o) => (
        <Choice
          key={o.id}
          name={name}
          variant={variant}
          checked={value === o.id}
          onChange={() => onChange(o.id)}
          title={o.label}
          subtitle={o[subtitleKey]}
          price={o.price}
        />
      ))}
    </div>
  )
}
