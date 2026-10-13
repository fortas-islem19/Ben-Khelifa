import { site } from '../config/site'
import { isoDateFromToday } from './format'

const PHONE_RE = /^\+?[0-9\s.-]{9,16}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns `{ field: message }` for the given step; an empty object means valid. */
export function validateStep(step, order) {
  const errors = {}

  if (step === 0) {
    if (!order.cakeId) errors.cakeId = 'Choisissez un modèle ou la création sur mesure.'
    if (!order.occasion) errors.occasion = 'Indiquez l’occasion.'
  }

  if (step === 1) {
    if (!order.size) errors.size = 'Choisissez une taille.'
    if (!order.sponge) errors.sponge = 'Choisissez une génoise.'
    if (!order.filling) errors.filling = 'Choisissez une garniture.'
    if (order.message.length > 60) errors.message = '60 caractères maximum.'
  }

  if (step === 2) {
    const min = isoDateFromToday(site.ordering.minLeadDays)
    const max = isoDateFromToday(site.ordering.maxLeadDays)
    if (!order.date) errors.date = 'Choisissez une date.'
    else if (order.date < min) errors.date = `Commande au minimum ${site.ordering.minLeadDays} jours à l’avance.`
    else if (order.date > max) errors.date = 'Date trop éloignée.'
    if (!order.timeSlot) errors.timeSlot = 'Choisissez un créneau.'
    if (order.fulfillment === 'delivery') {
      if (!order.address.trim()) errors.address = 'Adresse requise pour la livraison.'
      if (!order.city.trim()) errors.city = 'Ville / commune requise.'
    }
  }

  if (step === 3) {
    const { name, phone, email } = order.customer
    if (name.trim().length < 2) errors['customer.name'] = 'Votre nom complet.'
    if (!PHONE_RE.test(phone.trim())) errors['customer.phone'] = 'Numéro de téléphone invalide.'
    if (email.trim() && !EMAIL_RE.test(email.trim())) errors['customer.email'] = 'Adresse e-mail invalide.'
    if (!order.acceptTerms) errors.acceptTerms = 'Veuillez accepter les conditions.'
  }

  return errors
}
