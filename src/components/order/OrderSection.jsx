import { useRef, useState } from 'react'
import { site } from '../../config/site'
import { findCake } from '../../data/cakes'
import { useOrderContext } from '../../hooks/OrderContext'
import { submitOrder } from '../../services/orders'
import { track, trackCustom } from '../../services/pixel'
import { estimatePrice } from '../../utils/pricing'
import { validateStep } from '../../utils/validation'
import OrderSuccess from './OrderSuccess'
import OrderSummary from './OrderSummary'
import StepContact from './StepContact'
import StepCustomize from './StepCustomize'
import StepDelivery from './StepDelivery'
import StepModel from './StepModel'
import Stepper from './Stepper'
import { STEPS } from './steps'

const stepComponents = [StepModel, StepCustomize, StepDelivery, StepContact]

export default function OrderSection() {
  const ctx = useOrderContext()
  const { order, step, setStep, reset } = ctx
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [result, setResult] = useState(null)
  const checkoutTracked = useRef(false)
  const topRef = useRef(null)

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const goTo = (next) => {
    setErrors({})
    setStep(next)
    scrollTop()
  }

  const next = () => {
    const stepErrors = validateStep(step, order)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length) return

    if (step === 0 && !checkoutTracked.current) {
      checkoutTracked.current = true
      const price = estimatePrice(order)
      track('InitiateCheckout', {
        content_name: findCake(order.cakeId)?.name,
        content_ids: [order.cakeId],
        value: price.total,
        currency: site.currency.code,
      })
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

  const StepComponent = stepComponents[step]

  return (
    <section className="section section--order" id="commander">
      <div className="container" ref={topRef}>
        <header className="section__head">
          <span className="eyebrow">Commande en ligne</span>
          <h2>Réservez votre gâteau</h2>
          <p>Quelques minutes suffisent. Nous vous rappelons pour tout confirmer.</p>
        </header>

        {status === 'success' && result ? (
          <OrderSuccess result={result} onNewOrder={newOrder} />
        ) : (
          <div className="order">
            <form className="order__form" onSubmit={submit} noValidate>
              <Stepper current={step} onGoTo={goTo} />
              <StepComponent {...ctx} errors={errors} />

              {status === 'error' && (
                <p className="order__error" role="alert">
                  Une erreur est survenue lors de l’envoi. Vérifiez votre connexion puis réessayez, ou appelez-nous au{' '}
                  <a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>.
                </p>
              )}

              <div className="order__nav">
                {step > 0 ? (
                  <button type="button" className="btn btn--ghost" onClick={() => goTo(step - 1)}>
                    ← Retour
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className="btn btn--dark" disabled={status === 'submitting'}>
                  {step < STEPS.length - 1
                    ? 'Continuer →'
                    : status === 'submitting'
                      ? 'Envoi en cours…'
                      : 'Envoyer ma commande'}
                </button>
              </div>
            </form>

            <OrderSummary order={order} />
          </div>
        )}
      </div>
    </section>
  )
}
