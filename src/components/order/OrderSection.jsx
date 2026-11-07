import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../../config/site'
import { steps } from '../../data/content'
import { useOrderContext } from '../../hooks/OrderContext'
import { submitOrder } from '../../services/orders'
import { orderParams, track, trackCustom } from '../../services/pixel'
import { validateStep } from '../../utils/validation'
import { Reveal } from '../motion/Reveal'
import OrderSuccess from './OrderSuccess'
import StepDate from './StepDate'
import StepFlavor from './StepFlavor'
import StepMessage from './StepMessage'
import StepSize from './StepSize'
import StepTheme from './StepTheme'
import Stepper from './Stepper'

const stepComponents = [StepTheme, StepSize, StepDate, StepFlavor, StepMessage]
const LAST = steps.length - 1
/** Pause after a tap on a card before sliding to the next step, so the selection is seen. */
const AUTO_ADVANCE_MS = 380

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 50 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -50 }),
}

export default function OrderSection() {
  const { order, set, reset, step, setStep } = useOrderContext()
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [result, setResult] = useState(null)
  const [direction, setDirection] = useState(1)
  const tracked = useRef({}) // events sent once per order: AddToCart, InitiateCheckout
  const autoTimer = useRef(null)
  const topRef = useRef(null)
  // Latest order, for the auto-advance timer (its closure was created before the last choice)
  const orderRef = useRef(order)

  useEffect(() => {
    orderRef.current = order
  }, [order])
  useEffect(() => () => clearTimeout(autoTimer.current), [])

  // ViewContent: the visitor sees the order form (once per visit)
  const inView = useInView(topRef, { once: true, amount: 0.25 })
  useEffect(() => {
    if (inView) track('ViewContent', { content_name: 'Formulaire de commande', content_type: 'product' })
  }, [inView])

  // AddToCart once a theme is chosen, InitiateCheckout on reaching the contact details.
  // Watching the step also covers orders started from the theme strip (which open step 2).
  useEffect(() => {
    const once = (event) => {
      if (tracked.current[event]) return
      tracked.current[event] = true
      track(event, orderParams(orderRef.current))
    }
    if (step >= 1) once('AddToCart')
    if (step === LAST) once('InitiateCheckout')
  }, [step])

  const scrollTop = () => {
    const top = topRef.current?.getBoundingClientRect().top ?? 0
    // Only scroll when the top of the form is out of view (long steps on mobile)
    if (top < 0) topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const goTo = (target, from = step) => {
    clearTimeout(autoTimer.current)
    setErrors({})
    setDirection(target >= from ? 1 : -1)
    setStep(target)
    scrollTop()
  }

  /** Step `from` is valid: track it and move on. */
  const complete = (from) => {
    const next = from + 1
    trackCustom('OrderStepCompleted', { step: steps[from], step_number: next, ...orderParams(orderRef.current) })
    goTo(next, from)
  }

  /** Called by the cards: a choice was just made, so the step is valid. */
  const advance = () => {
    clearTimeout(autoTimer.current)
    const from = step
    autoTimer.current = setTimeout(() => complete(from), AUTO_ADVANCE_MS)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (step < LAST) {
      const stepErrors = validateStep(step, order)
      setErrors(stepErrors)
      if (!Object.keys(stepErrors).length) complete(step)
      return
    }

    // Re-check every step: the customer may have gone back and changed something
    for (let i = 0; i < steps.length; i++) {
      const stepErrors = validateStep(i, order)
      if (Object.keys(stepErrors).length) {
        if (i !== step) goTo(i)
        setErrors(stepErrors)
        return
      }
    }

    setStatus('submitting')
    try {
      setResult(await submitOrder(order))
      setStatus('success')
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const newOrder = () => {
    reset()
    setResult(null)
    setStatus('idle')
    tracked.current = {}
    goTo(0)
  }

  const StepComponent = stepComponents[step]

  return (
    <section className="section section--order" id="commander">
      <div className="container container--narrow" ref={topRef}>
        <Reveal as="header" className="section__head">
          <span className="eyebrow">Commande en ligne</span>
          <h2>
            Commandez votre <em>gâteau</em>
          </h2>
          <p>5 étapes rapides, puis nous vous appelons pour confirmer.</p>
        </Reveal>

        <AnimatePresence mode="wait">
          {status === 'success' && result ? (
            <OrderSuccess key="success" result={result} onNewOrder={newOrder} />
          ) : (
            <Reveal key="form" className="order" delay={0.1} exit={{ opacity: 0, scale: 0.97 }}>
              <form className="order__form" onSubmit={submit} noValidate>
                <Stepper current={step} onGoTo={(i) => goTo(i)} />

                <div className="order__body">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <StepComponent order={order} set={set} errors={errors} advance={advance} goTo={goTo} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {status === 'error' && (
                    <motion.p className="order__error" role="alert" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      Une erreur est survenue lors de l’envoi. Vérifiez votre connexion puis réessayez, ou appelez-nous au{' '}
                      <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>.
                    </motion.p>
                  )}
                </AnimatePresence>

                <div className="order__nav">
                  {step > 0 ? (
                    <motion.button type="button" className="btn btn--ghost" whileTap={{ scale: 0.95 }} onClick={() => goTo(step - 1)}>
                      ← Retour
                    </motion.button>
                  ) : (
                    <span />
                  )}
                  <motion.button
                    type="submit"
                    className="btn btn--dark btn--shine"
                    disabled={status === 'submitting'}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {step < LAST ? 'Continuer →' : status === 'submitting' ? 'Envoi en cours…' : 'Envoyer ma commande'}
                  </motion.button>
                </div>
              </form>
            </Reveal>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
