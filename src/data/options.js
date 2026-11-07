/**
 * Everything the customer can pick in the order form.
 * Edit the lists below to add, remove or rename a choice: the form follows automatically.
 */

/**
 * Cake themes (step 1).
 * - `colors`: the two colours of the card (gradient, or stripes for the football clubs)
 * - `badge`: short text shown on the card (clubs) — otherwise `emoji` is shown
 * - `image`: photo of a cake in this theme (`public/images/themes/`). When set, the photo replaces the
 *   coloured card. The current photos are AI-generated illustrations: replace them with photos of your
 *   own cakes by keeping the same file names.
 */
export const themes = [
  { id: 'mouloudia', label: 'Mouloudia', badge: 'MCA', colors: ['#0a8f43', '#d7182a'], club: true, image: '/images/themes/mouloudia.jpg' },
  { id: 'usma', label: 'USMA', badge: 'USMA', colors: ['#d7182a', '#141414'], club: true, image: '/images/themes/usma.jpg' },
  { id: 'crb', label: 'CRB', badge: 'CRB', colors: ['#d7182a', '#ffffff'], club: true, image: '/images/themes/crb.jpg' },
  { id: 'stitch-angel', label: 'Stitch & Angel', emoji: '💙', colors: ['#2f7bf5', '#f472b6'], image: '/images/themes/stitch-angel.jpg' },
  { id: 'spider-man', label: 'Spider-Man', emoji: '🕷️', colors: ['#e11d2e', '#1d4ed8'], image: '/images/themes/spider-man.jpg' },
  { id: 'batman', label: 'Batman', emoji: '🦇', colors: ['#141414', '#f5c518'], image: '/images/themes/batman.jpg' },
  { id: 'barbie', label: 'Barbie', emoji: '💖', colors: ['#ec4899', '#fbcfe8'], image: '/images/themes/barbie.jpg' },
  { id: 'baby-boss', label: 'Baby Boss', emoji: '👶', colors: ['#1e3a8a', '#93c5fd'], image: '/images/themes/baby-boss.jpg' },
  { id: 'reine-des-neiges', label: 'Reine des neiges', emoji: '❄️', colors: ['#38bdf8', '#e0f2fe'], image: '/images/themes/reine-des-neiges.jpg' },
]

/**
 * Cake dimensions (step 2), in centimetres.
 * `price` (DA) is not shown on the page: it is only sent to the Meta Pixel as the order value,
 * so that campaigns can optimise on it. Leave it at 0 if unknown.
 */
export const sizes = [
  { id: '30x20', label: '30 × 20 cm', width: 30, height: 20, hint: 'Format classique', price: 0 },
  { id: '30x40', label: '30 × 40 cm', width: 30, height: 40, hint: 'Grand format', price: 0 },
]

/** Pickup hours offered in step 3. */
export const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

/** Flavours (step 4). */
export const flavors = [
  { id: 'chocolat', label: 'Chocolat', emoji: '🍫', colors: ['#5a321d', '#a8693f'], image: '/images/flavors/chocolat.jpg' },
  { id: 'fruit', label: 'Fruit', emoji: '🍓', colors: ['#f43f5e', '#fecdd3'], image: '/images/flavors/fruit.jpg' },
]

/** Maximum length of the text written on the cake (step 5). */
export const maxCakeText = 40

export const byId = (list, id) => list.find((item) => item.id === id)
