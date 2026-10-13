import { STEPS } from './steps'

export default function Stepper({ current, onGoTo }) {
  return (
    <ol className="stepper">
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo'
        return (
          <li key={label} className={`stepper__item is-${state}`}>
            <button
              type="button"
              disabled={i >= current}
              onClick={() => onGoTo(i)}
              aria-current={i === current ? 'step' : undefined}
            >
              <span className="stepper__num">{i < current ? '✓' : i + 1}</span>
              <span className="stepper__label">{label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
