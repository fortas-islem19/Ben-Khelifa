/** Deterministic pseudo-random number in [0, 1) — stable decorative layouts between renders. */
export const seeded = (i) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}
