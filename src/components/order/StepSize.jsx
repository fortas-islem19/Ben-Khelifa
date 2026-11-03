import { motion } from 'motion/react'
import { sizes } from '../../data/options'
import OptionCard from './OptionCard'
import StepTitle from './StepTitle'

const biggest = Math.max(...sizes.flatMap((s) => [s.width, s.height]))

export default function StepSize({ order, set, advance, errors }) {
  return (
    <div className="step">
      <StepTitle title="Choisissez la dimension" error={errors.size} />
      <div className="options options--sizes" role="radiogroup" aria-label="Dimension">
        {sizes.map((size) => (
          <OptionCard
            key={size.id}
            className="option--size"
            checked={order.size === size.id}
            onSelect={() => {
              set('size', size.id)
              advance()
            }}
            art={
              <span className="size-art">
                {/* The cake drawn to scale, with its dimensions */}
                <motion.span
                  className="size-art__cake"
                  style={{ width: `${(size.width / biggest) * 100}%`, height: `${(size.height / biggest) * 100}%` }}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16 }}
                >
                  <span className="size-art__w">{size.width} cm</span>
                  <span className="size-art__h">{size.height} cm</span>
                </motion.span>
              </span>
            }
            title={size.label}
            subtitle={size.hint}
          />
        ))}
      </div>
    </div>
  )
}
