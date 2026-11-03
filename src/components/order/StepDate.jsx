import { AnimatePresence, motion } from 'motion/react'
import { site } from '../../config/site'
import { hours } from '../../data/options'
import { dateParts, formatDate, isoDateFromToday } from '../../utils/format'
import { Field } from '../form/Field'
import StepTitle from './StepTitle'

const { minLeadDays, maxLeadDays, quickDays } = site.ordering

export default function StepDate({ order, set, errors }) {
  const quickDates = Array.from({ length: quickDays }, (_, i) => isoDateFromToday(minLeadDays + i))

  return (
    <div className="step">
      <StepTitle title="Choisissez la date et l’heure" hint={`Commande au minimum ${minLeadDays} jours à l’avance.`} />

      <fieldset className={`group ${errors.date ? 'has-error' : ''}`}>
        <legend className="field__label">Date de récupération</legend>
        <div className="days" role="radiogroup" aria-label="Date">
          {quickDates.map((iso, i) => {
            const p = dateParts(iso)
            const checked = order.date === iso
            return (
              <motion.button
                key={iso}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={formatDate(iso)}
                className={`day ${checked ? 'is-checked' : ''}`}
                onClick={() => set('date', iso)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.92 }}
              >
                <small>{p.weekday}</small>
                <strong>{p.day}</strong>
                <small>{p.month}</small>
              </motion.button>
            )
          })}
        </div>
        <Field label="Ou une autre date :" error={errors.date} className="field--inline">
          {(id) => (
            <input
              id={id}
              type="date"
              value={order.date}
              min={isoDateFromToday(minLeadDays)}
              max={isoDateFromToday(maxLeadDays)}
              onChange={(e) => set('date', e.target.value)}
            />
          )}
        </Field>
      </fieldset>

      <fieldset className={`group ${errors.time ? 'has-error' : ''}`}>
        <legend className="field__label">Heure</legend>
        <div className="hours" role="radiogroup" aria-label="Heure">
          {hours.map((h) => (
            <motion.button
              key={h}
              type="button"
              role="radio"
              aria-checked={order.time === h}
              className={`hour ${order.time === h ? 'is-checked' : ''}`}
              onClick={() => set('time', h)}
              whileTap={{ scale: 0.92 }}
            >
              {h}
            </motion.button>
          ))}
        </div>
        {errors.time && (
          <p className="field__error" role="alert">
            {errors.time}
          </p>
        )}
      </fieldset>

      <AnimatePresence>
        {order.date && order.time && (
          <motion.p
            className="when"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            📅 <strong>{formatDate(order.date)}</strong> à <strong>{order.time}</strong>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
