const pad = (n) => String(n).padStart(2, '0')

/** yyyy-mm-dd in local time (the format of <input type="date">). */
export const toIsoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Local date `days` days from today, as yyyy-mm-dd. */
export function isoDateFromToday(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}

export const parseIsoDate = (isoDate) => {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** “Samedi 7 novembre 2026” */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const text = parseIsoDate(isoDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Parts used by the quick date buttons: { weekday: 'sam.', day: '7', month: 'nov.' } */
export function dateParts(isoDate) {
  const d = parseIsoDate(isoDate)
  return {
    weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }),
    day: String(d.getDate()),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }),
  }
}
