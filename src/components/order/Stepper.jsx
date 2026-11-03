import { motion } from 'motion/react'
import { steps } from '../../data/content'

export default function Stepper({ current, onGoTo }) {
  return (
    <div className="stepper-wrap">
      <ol className="stepper">
        {steps.map((label, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo'
          return (
            <li key={label} className={`stepper__item is-${state}`}>
              <button type="button" disabled={i >= current} onClick={() => onGoTo(i)} aria-current={i === current ? 'step' : undefined}>
                <motion.span
                  className="stepper__num"
                  animate={{ scale: i === current ? 1.12 : 1 }}
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
          animate={{ scaleX: (current + 1) / steps.length }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  )
}
