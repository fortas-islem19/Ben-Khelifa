/**
 * Renders an on-screen SVG (the cake builder preview) to a JPEG so the bakery
 * receives a picture of the customer's design with the order.
 * Resolves to `null` on any failure — the order must never be blocked by it.
 */
export async function capturePreview(selector, width = 800) {
  try {
    const svg = document.querySelector(selector)
    if (!svg) return null
    const [, , vw, vh] = svg.getAttribute('viewBox').split(' ').map(Number)
    const height = Math.round((width * vh) / vw)

    const clone = svg.cloneNode(true)
    clone.setAttribute('width', width)
    clone.setAttribute('height', height)
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone))

    const img = await new Promise((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = reject
      i.src = url
    })
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fbf8f3'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    return { name: 'creation.jpg', mimeType: 'image/jpeg', data: canvas.toDataURL('image/jpeg', 0.88).split(',')[1] }
  } catch (err) {
    console.warn('[preview] capture failed', err)
    return null
  }
}
