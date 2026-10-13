/**
 * Resizes and re-encodes an image in the browser so the upload stays small.
 * @returns {Promise<{name: string, mimeType: string, data: string, preview: string}>}
 *          `data` is base64 without the data-URL prefix.
 */
export function compressImage(file, maxDimension = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const dataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve({
        name: file.name.replace(/\.[^.]+$/, '') + '.jpg',
        mimeType: 'image/jpeg',
        data: dataUrl.split(',')[1],
        preview: dataUrl,
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image illisible'))
    }
    img.src = url
  })
}
