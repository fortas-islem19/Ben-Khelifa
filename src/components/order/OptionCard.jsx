import { AnimatePresence, motion } from 'motion/react'

/**
 * Selectable card used by every step. Rendered as a button with role="radio" so that
 * tapping it — even when it is already selected — can move straight to the next step.
 */
export default function OptionCard({ checked, onSelect, art, title, subtitle, className = '' }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={checked}
      className={`option ${checked ? 'is-checked' : ''} ${className}`}
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
    >
      {art}
      <span className="option__title">{title}</span>
      {subtitle && <span className="option__subtitle">{subtitle}</span>}
      <AnimatePresence>
        {checked && (
          <motion.span
            className="option__check"
            aria-hidden="true"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          >
            ✓
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
