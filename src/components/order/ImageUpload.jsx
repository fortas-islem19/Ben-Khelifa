import { useState } from 'react'
import { site } from '../../config/site'
import { compressImage } from '../../utils/image'

export default function ImageUpload({ value, onChange }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleFile = async (file) => {
    setError('')
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Seules les images sont acceptées.')
    if (file.size > site.ordering.maxImageUploadMb * 1024 * 1024)
      return setError(`Image trop lourde (max ${site.ordering.maxImageUploadMb} Mo).`)
    setBusy(true)
    try {
      onChange(await compressImage(file, site.ordering.maxImageDimension))
    } catch {
      setError('Impossible de lire cette image.')
    } finally {
      setBusy(false)
    }
  }

  if (value) {
    return (
      <div className="upload upload--filled">
        <img src={value.preview} alt="Photo d’inspiration" />
        <div>
          <p>{value.name}</p>
          <button type="button" className="link" onClick={() => onChange(null)}>
            Retirer la photo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <label
        className="upload"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
        <span className="upload__icon" aria-hidden="true">
          ⤒
        </span>
        <span>{busy ? 'Préparation…' : 'Ajouter une photo d’inspiration'}</span>
        <small>Glissez une image ou cliquez — JPG, PNG, HEIC</small>
      </label>
      {error && <p className="field__error">{error}</p>}
    </div>
  )
}
