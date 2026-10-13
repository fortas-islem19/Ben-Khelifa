import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useCallback, useState } from 'react'
import * as opt from '../../data/options'
import { estimatePrice } from '../../utils/pricing'
import { formatPrice } from '../../utils/format'
import CakePreview from '../cake/CakePreview'
import { designFromOrder, randomDesign } from '../cake/design'
import { Choice, ChoiceList } from '../form/Choice'
import { Field, Group } from '../form/Field'
import AnimatedNumber from '../motion/AnimatedNumber'
import ColorPicker from './ColorPicker'
import ImageUpload from './ImageUpload'

const TABS = [
  { id: 'structure', label: 'Structure', icon: '◎' },
  { id: 'flavors', label: 'Saveurs', icon: '◒' },
  { id: 'finish', label: 'Habillage', icon: '◐' },
  { id: 'decor', label: 'Décor', icon: '✿' },
  { id: 'idea', label: 'Inspiration', icon: '✎' },
]

/** "L’atelier": build a cake from scratch with a live animated preview. */
export default function StepBuilder({ order, set, merge, toggle, errors }) {
  const [tab, setTab] = useState('structure')
  const [view, setView] = useState('outside')
  const design = designFromOrder(order)
  const price = estimatePrice(order)
  const fmt = useCallback((n) => formatPrice(Math.round(n / 10) * 10), [])

  const openTab = (id) => {
    setTab(id)
    setView(id === 'flavors' ? 'inside' : 'outside')
  }
  const setFlavor = (field, value) => {
    set(field, value)
    setView('inside')
  }
  const tabIndex = TABS.findIndex((t) => t.id === tab)

  return (
    <div className="builder">
      <div className="builder__preview">
        <div className="builder__toolbar">
          <div className="segmented" role="tablist" aria-label="Vue">
            {[
              ['outside', 'Extérieur'],
              ['inside', 'En coupe'],
            ].map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={view === id} onClick={() => setView(id)}>
                {view === id && <motion.span layoutId="view-pill" className="segmented__pill" />}
                <span>{label}</span>
              </button>
            ))}
          </div>
          <motion.button
            type="button"
            className="btn btn--ghost btn--sm"
            whileTap={{ scale: 0.92, rotate: -4 }}
            onClick={() => {
              merge(randomDesign())
              setView('outside')
            }}
          >
            ✦ <span className="hide-xs">Surprenez-moi</span>
          </motion.button>
        </div>

        <CakePreview design={design} view={view} interactive data-cake-preview="builder" />

        <div className="builder__price">
          <span>Estimation</span>
          <strong>{price.onQuote ? 'Sur devis' : <AnimatedNumber value={price.total} format={fmt} />}</strong>
        </div>
      </div>

      <div className="builder__controls">
        <LayoutGroup id="builder-tabs">
          <div className="tabs" role="tablist" aria-label="Étapes de l’atelier">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'is-active' : ''}
                onClick={() => openTab(t.id)}
              >
                {tab === t.id && <motion.span layoutId="tab-pill" className="tabs__pill" />}
                <span className="tabs__icon" aria-hidden="true">
                  {t.icon}
                </span>
                <span>
                  <small>{String(i + 1).padStart(2, '0')}</small> {t.label}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="step builder__panel"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {tab === 'structure' && (
              <>
                <Group legend="Nombre d’étages">
                  <ChoiceList
                    name="tiers"
                    variant="tile"
                    options={opt.tiers}
                    value={Number(order.tiers)}
                    onChange={(v) => set('tiers', v)}
                  />
                </Group>
                <Group legend="Forme">
                  <ChoiceList name="shape" options={opt.shapes} value={order.shape} onChange={(v) => set('shape', v)} />
                </Group>
                <Group legend="Nombre de parts" error={errors.size}>
                  <div className="choices choices--tile">
                    {opt.sizes.map((s) => (
                      <Choice
                        key={s.id}
                        name="size"
                        checked={order.size === s.id}
                        onChange={() => set('size', s.id)}
                        title={s.servings}
                        subtitle={s.label}
                      />
                    ))}
                  </div>
                </Group>
              </>
            )}

            {tab === 'flavors' && (
              <>
                <Group legend="Génoise" error={errors.sponge}>
                  <FlavorList name="sponge" options={opt.sponges} value={order.sponge} onChange={(v) => setFlavor('sponge', v)} />
                </Group>
                <Group legend="Garniture" error={errors.filling}>
                  <FlavorList name="filling" options={opt.fillings} value={order.filling} onChange={(v) => setFlavor('filling', v)} />
                </Group>
              </>
            )}

            {tab === 'finish' && (
              <>
                <Group legend="Finition">
                  <ChoiceList name="finish" variant="tile" options={opt.finishes} value={order.finish} onChange={(v) => set('finish', v)} />
                </Group>
                <Group legend="Couleur principale">
                  <ColorPicker name="Couleur principale" value={order.baseColor} onChange={(v) => set('baseColor', v)} />
                </Group>
                <Group legend="Couleur d’accent" hint="Drip, perles, bougies et lettrage.">
                  <ColorPicker name="Couleur d’accent" value={order.accentColor} onChange={(v) => set('accentColor', v)} />
                </Group>
              </>
            )}

            {tab === 'decor' && (
              <>
                <Group legend="Décorations" hint="Touchez pour ajouter ou retirer — l’aperçu se met à jour.">
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
                  <Field label="Prénom(s)" optional>
                    {(id) => <input id={id} value={order.nameOnCake} maxLength={24} onChange={(e) => set('nameOnCake', e.target.value)} />}
                  </Field>
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
                  <Field label="Message" optional error={errors.message} hint={`${order.message.length}/60`}>
                    {(id) => (
                      <input
                        id={id}
                        value={order.message}
                        maxLength={60}
                        placeholder="Joyeux anniversaire…"
                        onChange={(e) => set('message', e.target.value)}
                      />
                    )}
                  </Field>
                </div>
              </>
            )}

            {tab === 'idea' && (
              <>
                <Field label="Décrivez votre idée" optional hint="Thème, personnages, ambiance… tout ce que l’aperçu ne montre pas.">
                  {(id) => <textarea id={id} rows={5} value={order.designNotes} onChange={(e) => set('designNotes', e.target.value)} />}
                </Field>
                <Group legend="Photo d’inspiration" optional>
                  <ImageUpload value={order.referenceImage} onChange={(v) => set('referenceImage', v)} />
                </Group>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="builder__tabnav">
          <button type="button" className="link" disabled={tabIndex === 0} onClick={() => openTab(TABS[tabIndex - 1].id)}>
            ← {TABS[tabIndex - 1]?.label ?? ''}
          </button>
          {tabIndex < TABS.length - 1 && (
            <button type="button" className="link" onClick={() => openTab(TABS[tabIndex + 1].id)}>
              {TABS[tabIndex + 1].label} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FlavorList({ name, options, value, onChange }) {
  return (
    <div className="choices choices--chip">
      {options.map((o) => (
        <motion.label
          key={o.id}
          className={`choice choice--chip choice--flavor ${value === o.id ? 'is-checked' : ''}`}
          whileTap={{ scale: 0.94 }}
        >
          <input type="radio" name={name} checked={value === o.id} onChange={() => onChange(o.id)} />
          <span className="flavor-dot" style={{ background: o.color }} />
          <span className="choice__title">{o.label}</span>
          {o.price > 0 && <span className="choice__price">+ {formatPrice(o.price)}</span>}
        </motion.label>
      ))}
    </div>
  )
}
