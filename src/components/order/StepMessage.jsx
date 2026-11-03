import { AnimatePresence, motion } from 'motion/react'
import { byId, flavors, maxCakeText, sizes, themes } from '../../data/options'
import { steps } from '../../data/content'
import { formatDate } from '../../utils/format'
import { Field } from '../form/Field'
import StepTitle from './StepTitle'

export default function StepMessage({ order, set, errors, goTo }) {
  const theme = byId(themes, order.theme)
  const size = byId(sizes, order.size)
  const flavor = byId(flavors, order.flavor)

  const recap = [
    { step: 0, label: steps[0], value: theme?.label },
    { step: 1, label: steps[1], value: size?.label },
    { step: 2, label: steps[2], value: order.date && `${formatDate(order.date)} à ${order.time}` },
    { step: 3, label: steps[3], value: flavor && `${flavor.emoji} ${flavor.label}` },
  ]

  return (
    <div className="step">
      <StepTitle title="Que voulez-vous écrire sur le gâteau ?" />

      <div className="message">
        <div className="message__fields">
          <Field label="Texte sur le gâteau" optional error={errors.cakeText} hint={`${order.cakeText.length} / ${maxCakeText}`}>
            {(id) => (
              <input
                id={id}
                value={order.cakeText}
                maxLength={maxCakeText}
                placeholder="Ex. : Joyeux anniversaire Adam"
                onChange={(e) => set('cakeText', e.target.value)}
              />
            )}
          </Field>

          <div className="grid-2">
            <Field label="Nom et prénom" error={errors.name}>
              {(id) => <input id={id} value={order.name} autoComplete="name" onChange={(e) => set('name', e.target.value)} />}
            </Field>
            <Field label="Téléphone" error={errors.phone}>
              {(id) => (
                <input
                  id={id}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="05 XX XX XX XX"
                  value={order.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              )}
            </Field>
          </div>

          <Field label="Remarque" optional>
            {(id) => (
              <textarea
                id={id}
                rows="2"
                value={order.notes}
                placeholder="Âge de l’enfant, couleur préférée…"
                onChange={(e) => set('notes', e.target.value)}
              />
            )}
          </Field>
        </div>

        <CakeTop theme={theme} size={size} text={order.cakeText} />
      </div>

      <dl className="recap">
        {recap.map((r) => (
          <div key={r.step}>
            <dt>{r.label}</dt>
            <dd>{r.value || '—'}</dd>
            <button type="button" className="link" onClick={() => goTo(r.step)}>
              Modifier
            </button>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** Top view of the cake, in the chosen dimension and theme colours, with the text on it. */
function CakeTop({ theme, size, text }) {
  const [a, b] = theme?.colors ?? ['#ffd6e4', '#fff1f6']
  return (
    <div className="cake-top" aria-hidden="true">
      <motion.div
        className="cake-top__cake"
        layout
        style={{
          aspectRatio: size ? `${size.width} / ${size.height}` : '3 / 2',
          background: theme?.club
            ? `repeating-linear-gradient(90deg, ${a} 0 14px, ${b} 14px 28px)`
            : `radial-gradient(circle at 30% 25%, ${b}, ${a} 80%)`,
        }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
      >
        <span className="cake-top__plaque">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={text ? 'text' : 'empty'}
              className={text ? '' : 'is-empty'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              {text || 'Votre texte ici'}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.div>
      <small>Aperçu</small>
    </div>
  )
}
