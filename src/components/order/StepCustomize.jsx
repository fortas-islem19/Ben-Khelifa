import { findCake } from '../../data/cakes'
import * as opt from '../../data/options'
import { Choice, ChoiceList } from '../form/Choice'
import { Field, Group } from '../form/Field'
import ImageUpload from './ImageUpload'

export default function StepCustomize({ order, set, toggle, errors }) {
  const cake = findCake(order.cakeId)
  const isCustom = order.cakeId === 'custom'
  const p = cake?.personalizable ?? {}

  return (
    <div className="step">
      <Group legend="Taille" error={errors.size}>
        <div className="choices choices--tile">
          {opt.sizes.map((s) => (
            <Choice
              key={s.id}
              name="size"
              checked={order.size === s.id}
              onChange={() => set('size', s.id)}
              title={s.label}
              subtitle={`${s.servings} · ${s.detail}`}
            />
          ))}
        </div>
      </Group>

      {isCustom && (
        <Group legend="Forme">
          <ChoiceList name="shape" options={opt.shapes} value={order.shape} onChange={(v) => set('shape', v)} />
        </Group>
      )}

      <div className="grid-2">
        <Group legend="Génoise" error={errors.sponge}>
          <ChoiceList name="sponge" options={opt.sponges} value={order.sponge} onChange={(v) => set('sponge', v)} />
        </Group>
        <Group legend="Garniture" error={errors.filling}>
          <ChoiceList name="filling" options={opt.fillings} value={order.filling} onChange={(v) => set('filling', v)} />
        </Group>
      </div>

      <Group legend="Finition" hint={isCustom ? undefined : 'Pré-sélectionnée selon le modèle choisi.'}>
        <ChoiceList
          name="finish"
          variant="tile"
          options={opt.finishes}
          value={order.finish}
          onChange={(v) => set('finish', v)}
        />
      </Group>

      <Group legend="Couleurs" optional hint={`Jusqu’à ${opt.maxColors} couleurs dominantes.`}>
        <div className="swatches">
          {opt.colors.map((c) => {
            const checked = order.colors.includes(c.id)
            const full = !checked && order.colors.length >= opt.maxColors
            return (
              <label key={c.id} className={`swatch ${checked ? 'is-checked' : ''} ${full ? 'is-disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={full}
                  onChange={() => toggle('colors', c.id, opt.maxColors)}
                />
                <span className="swatch__dot" style={{ background: c.hex }} />
                <span className="swatch__label">{c.label}</span>
              </label>
            )
          })}
        </div>
      </Group>

      <Group legend="Décorations" optional>
        <div className="choices choices--tile choices--compact">
          {opt.decorations.map((d) => (
            <Choice
              key={d.id}
              type="checkbox"
              checked={order.decorations.includes(d.id)}
              onChange={() => toggle('decorations', d.id)}
              title={d.label}
              price={d.price}
            />
          ))}
        </div>
      </Group>

      <div className="grid-3">
        {p.name && (
          <Field label="Prénom(s) sur le gâteau" optional>
            {(id) => (
              <input id={id} value={order.nameOnCake} maxLength={40} onChange={(e) => set('nameOnCake', e.target.value)} />
            )}
          </Field>
        )}
        {p.age && (
          <Field label="Âge" optional>
            {(id) => (
              <input
                id={id}
                type="number"
                min="0"
                max="120"
                inputMode="numeric"
                value={order.age}
                onChange={(e) => set('age', e.target.value)}
              />
            )}
          </Field>
        )}
        {p.message && (
          <Field label="Message" optional error={errors.message} hint={`${order.message.length}/60`}>
            {(id) => (
              <input
                id={id}
                value={order.message}
                placeholder="Joyeux anniversaire…"
                onChange={(e) => set('message', e.target.value)}
              />
            )}
          </Field>
        )}
      </div>

      <Field
        label={isCustom ? 'Décrivez votre gâteau' : 'Modifications souhaitées'}
        optional={!isCustom}
        error={errors.designNotes}
        hint={isCustom ? 'Thème, personnages, ambiance, inscriptions…' : 'Un détail à changer par rapport au modèle ?'}
      >
        {(id) => (
          <textarea id={id} rows={4} value={order.designNotes} onChange={(e) => set('designNotes', e.target.value)} />
        )}
      </Field>

      <Group legend="Photo d’inspiration" optional>
        <ImageUpload value={order.referenceImage} onChange={(v) => set('referenceImage', v)} />
      </Group>
    </div>
  )
}
