import { site } from '../../config/site'
import { fulfillment, timeSlots } from '../../data/options'
import { isoDateFromToday } from '../../utils/format'
import { ChoiceList } from '../form/Choice'
import { Field, Group } from '../form/Field'

export default function StepDelivery({ order, set, errors }) {
  return (
    <div className="step">
      <Group legend="Mode de retrait">
        <ChoiceList
          name="fulfillment"
          variant="tile"
          options={fulfillment}
          value={order.fulfillment}
          onChange={(v) => set('fulfillment', v)}
        />
      </Group>

      <div className="grid-2">
        <Field
          label={order.fulfillment === 'delivery' ? 'Date de livraison' : 'Date de retrait'}
          error={errors.date}
          hint={`Au minimum ${site.ordering.minLeadDays} jours à l’avance.`}
        >
          {(id) => (
            <input
              id={id}
              type="date"
              min={isoDateFromToday(site.ordering.minLeadDays)}
              max={isoDateFromToday(site.ordering.maxLeadDays)}
              value={order.date}
              onChange={(e) => set('date', e.target.value)}
            />
          )}
        </Field>

        <Group legend="Créneau" error={errors.timeSlot}>
          <div className="choices choices--chip">
            {timeSlots.map((slot) => (
              <label key={slot} className={`choice choice--chip ${order.timeSlot === slot ? 'is-checked' : ''}`}>
                <input
                  type="radio"
                  name="timeSlot"
                  checked={order.timeSlot === slot}
                  onChange={() => set('timeSlot', slot)}
                />
                <span className="choice__title">{slot}</span>
              </label>
            ))}
          </div>
        </Group>
      </div>

      {order.fulfillment === 'delivery' && (
        <div className="grid-2">
          <Field label="Adresse de livraison" error={errors.address}>
            {(id) => (
              <input id={id} autoComplete="street-address" value={order.address} onChange={(e) => set('address', e.target.value)} />
            )}
          </Field>
          <Field label="Ville / commune" error={errors.city}>
            {(id) => (
              <input id={id} autoComplete="address-level2" value={order.city} onChange={(e) => set('city', e.target.value)} />
            )}
          </Field>
        </div>
      )}
    </div>
  )
}
