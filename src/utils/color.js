const toRgb = (hex) => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')

/** Linear mix of two hex colors, t = 0 → a, t = 1 → b. */
export const mix = (a, b, t) => {
  const A = toRgb(a)
  const B = toRgb(b)
  return toHex(A.map((v, i) => v + (B[i] - v) * t))
}
export const lighten = (hex, t) => mix(hex, '#ffffff', t)
export const darken = (hex, t) => mix(hex, '#000000', t)

export const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Readable ink on top of `hex`. */
export const inkOn = (hex) => (luminance(hex) > 0.4 ? '#2a211b' : '#fffaf2')
