import { site } from '../config/site'

const numberFormat = new Intl.NumberFormat(site.currency.locale, { maximumFractionDigits: 0 })

export const formatPrice = (amount) => `${numberFormat.format(amount)} ${site.currency.symbol}`

export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/** yyyy-mm-dd in local time, for <input type="date"> bounds. */
export function isoDateFromToday(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
