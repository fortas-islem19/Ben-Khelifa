import { site } from '../config/site'
import { maxCakeText } from '../data/options'
import { isoDateFromToday } from './format'

const PHONE_RE = /^\+?[0-9\s.-]{9,16}$/

/** Returns `{ field: message }` for the given step; an empty object means valid. */
export function validateStep(step, order) {
  const errors = {}

  if (step === 0 && !order.theme) errors.theme = 'Choisissez un thème.'

  if (step === 1 && !order.size) errors.size = 'Choisissez une dimension.'

  if (step === 2) {
    const min = isoDateFromToday(site.ordering.minLeadDays)
    const max = isoDateFromToday(site.ordering.maxLeadDays)
    if (!order.date) errors.date = 'Choisissez une date.'
    else if (order.date < min) errors.date = `Commande au minimum ${site.ordering.minLeadDays} jours à l’avance.`
    else if (order.date > max) errors.date = 'Date trop éloignée.'
    if (!order.time) errors.time = 'Choisissez une heure.'
  }

  if (step === 3 && !order.flavor) errors.flavor = 'Choisissez un goût.'

  if (step === 4) {
    if (order.cakeText.length > maxCakeText) errors.cakeText = `${maxCakeText} caractères maximum.`
    if (order.name.trim().length < 2) errors.name = 'Votre nom et prénom.'
    if (!PHONE_RE.test(order.phone.trim())) errors.phone = 'Numéro de téléphone invalide.'
  }

  return errors
}
