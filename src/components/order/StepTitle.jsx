import { AnimatePresence, motion } from 'motion/react'

/** Heading of a step, with an optional hint and the step's error message. */
export default function StepTitle({ title, hint, error }) {
  return (
    <div className="step__head">
      <h3>{title}</h3>
      {hint && <p className="step__hint">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            className="field__error"
            role="alert"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: [0, -6, 6, -3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
