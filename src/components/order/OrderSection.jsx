import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { site } from '../../config/site'
import { findCake } from '../../data/cakes'
import { useOrderContext } from '../../hooks/OrderContext'
import { submitOrder } from '../../services/orders'
import { track, trackCustom } from '../../services/pixel'
import { estimatePrice } from '../../utils/pricing'
import { validateStep } from '../../utils/validation'
import { Reveal } from '../motion/Reveal'
import OrderSuccess from './OrderSuccess'
import OrderSummary from './OrderSummary'
import StepBuilder from './StepBuilder'
import StepContact from './StepContact'
import StepCustomize from './StepCustomize'
import StepDelivery from './StepDelivery'
import StepModel from './StepModel'
import Stepper from './Stepper'
import { STEPS } from './steps'

const stepComponents = [StepModel, StepCustomize, StepDelivery, StepContact]

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -40 }),
}

export default function OrderSection() {
  const ctx = useOrderContext()
  const { order, step, setStep, reset } = ctx
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [result, setResult] = useState(null)
  const [direction, setDirection] = useState(1)
  const checkoutTracked = useRef(false)
  const topRef = useRef(null)

  const isCustom = order.cakeId === 'custom'
  const builderMode = step === 1 && isCustom

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const goTo = (next) => {
    setErrors({})
    setDirection(next >= step ? 1 : -1)
    setStep(next)
    scrollTop()
  }

  const next = () => {
    const stepErrors = validateStep(step, order)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length) return

    if (step === 0) {
      if (!checkoutTracked.current) {
        checkoutTracked.current = true
        track('InitiateCheckout', {
          content_name: findCake(order.cakeId)?.name,
          content_ids: [order.cakeId],
          value: estimatePrice(order).total,
          currency: site.currency.code,
        })
      }
      if (isCustom) track('CustomizeProduct', { content_ids: ['custom'] })
    }
    trackCustom('OrderStepCompleted', { step: STEPS[step] })
    goTo(step + 1)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (step < STEPS.length - 1) return next()
    // Re-validate every step: the customer may have jumped back and changed something
    for (let i = 0; i < STEPS.length; i++) {
      const stepErrors = validateStep(i, order)
      if (Object.keys(stepErrors).length) {
        setErrors(stepErrors)
        if (i !== step) setStep(i)
        return
      }
    }

    setStatus('submitting')
    try {
      setResult(await submitOrder(order))
      setStatus('success')
      scrollTop()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const newOrder = () => {
    reset()
    setResult(null)
    setStatus('idle')
    checkoutTracked.current = false
    goTo(0)
  }

  const StepComponent = builderMode ? StepBuilder : stepComponents[step]

  return (
    <section className="section section--order" id="commander">
      <div className="container" ref={topRef}>
        <Reveal as="header" className="section__head">
          <span className="eyebrow">Commande en ligne</span>
          <h2>
            Réservez votre <em>gâteau</em>
          </h2>
          <p>Choisissez un modèle ou composez le vôtre de A à Z dans notre atelier.</p>
        </Reveal>

        <AnimatePresence mode="wait">
          {status === 'success' && result ? (
            <OrderSuccess key="success" result={result} onNewOrder={newOrder} />
          ) : (
            <motion.div key="form" className={`order ${builderMode ? 'order--wide' : ''}`} layout="position" exit={{ opacity: 0, scale: 0.97 }}>
              <form className="order__form" onSubmit={submit} noValidate>
                <Stepper current={step} onGoTo={goTo} custom={isCustom} />

                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={`${step}-${builderMode}`}
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <StepComponent {...ctx} errors={errors} />
                  </motion.div>
                </AnimatePresence>

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
                    {step < STEPS.length - 1
                      ? builderMode
                        ? 'Valider ma création →'
                        : 'Continuer →'
                      : status === 'submitting'
                        ? 'Envoi en cours…'
                        : 'Envoyer ma commande'}
                  </motion.button>
                </div>
              </form>

              {!builderMode && <OrderSummary order={order} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
