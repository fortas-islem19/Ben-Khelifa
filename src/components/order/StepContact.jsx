import { referralSources } from '../../data/options'
import { Field } from '../form/Field'

export default function StepContact({ order, set, setCustomer, errors }) {
  const c = order.customer
  return (
    <div className="step">
      <div className="grid-2">
        <Field label="Nom complet" error={errors['customer.name']}>
          {(id) => <input id={id} autoComplete="name" value={c.name} onChange={(e) => setCustomer('name', e.target.value)} />}
        </Field>
        <Field label="Téléphone" error={errors['customer.phone']} hint="Nous vous appelons pour confirmer la commande.">
          {(id) => (
            <input
              id={id}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="05 55 00 00 00"
              value={c.phone}
              onChange={(e) => setCustomer('phone', e.target.value)}
            />
          )}
        </Field>
        <Field label="E-mail" optional error={errors['customer.email']}>
          {(id) => (
            <input id={id} type="email" autoComplete="email" value={c.email} onChange={(e) => setCustomer('email', e.target.value)} />
          )}
        </Field>
        <Field label="Comment nous avez-vous connus ?" optional>
          {(id) => (
            <select id={id} value={c.referral} onChange={(e) => setCustomer('referral', e.target.value)}>
              <option value="">—</option>
              {referralSources.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field label="Remarques" optional hint="Allergies, contraintes, informations utiles…">
        {(id) => <textarea id={id} rows={3} value={c.notes} onChange={(e) => setCustomer('notes', e.target.value)} />}
      </Field>

      <label className={`consent ${errors.acceptTerms ? 'has-error' : ''}`}>
        <input type="checkbox" checked={order.acceptTerms} onChange={(e) => set('acceptTerms', e.target.checked)} />
        <span>
          J’ai compris que le prix affiché est une estimation et que ma commande sera confirmée par téléphone, avec
          versement d’un acompte.
        </span>
      </label>
      {errors.acceptTerms && <p className="field__error">{errors.acceptTerms}</p>}
    </div>
  )
}
