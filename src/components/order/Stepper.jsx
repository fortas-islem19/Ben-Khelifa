import { motion } from 'motion/react'
import { CUSTOM_STEPS, STEPS } from './steps'

export default function Stepper({ current, onGoTo, custom }) {
  const labels = custom ? CUSTOM_STEPS : STEPS
  return (
    <div className="stepper-wrap">
      <ol className="stepper">
        {labels.map((label, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo'
          return (
            <li key={i} className={`stepper__item is-${state}`}>
              <button
                type="button"
                disabled={i >= current}
                onClick={() => onGoTo(i)}
                aria-current={i === current ? 'step' : undefined}
              >
                <motion.span
                  className="stepper__num"
                  animate={{ scale: i === current ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {i < current ? '✓' : i + 1}
                </motion.span>
                <span className="stepper__label">{label}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="stepper__track">
        <motion.div
          className="stepper__progress"
          initial={false}
          animate={{ scaleX: (current + 1) / labels.length }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  )
}
