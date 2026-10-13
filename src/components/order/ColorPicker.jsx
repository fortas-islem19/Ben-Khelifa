import { motion } from 'motion/react'
import { colors } from '../../data/options'

/** Palette + free color input. */
export default function ColorPicker({ name, value, onChange }) {
  const isCustom = value && !colors.some((c) => c.hex === value)
  return (
    <div className="palette" role="radiogroup" aria-label={name}>
      {colors.map((c) => (
        <label key={c.id} className={`palette__item ${value === c.hex ? 'is-checked' : ''}`} title={c.label}>
          <input type="radio" name={name} checked={value === c.hex} onChange={() => onChange(c.hex)} />
          <motion.span className="palette__dot" style={{ background: c.hex }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} />
          <span className="sr-only">{c.label}</span>
        </label>
      ))}
      <label className={`palette__item palette__item--custom ${isCustom ? 'is-checked' : ''}`} title="Couleur personnalisée">
        <input type="color" value={isCustom ? value : '#e2367a'} onChange={(e) => onChange(e.target.value)} />
        <motion.span
          className="palette__dot palette__dot--rainbow"
          style={isCustom ? { background: value } : undefined}
          whileHover={{ scale: 1.15, rotate: 30 }}
        />
        <span className="sr-only">Autre couleur</span>
      </label>
    </div>
  )
}
