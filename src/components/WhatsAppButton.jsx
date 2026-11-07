import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { integrations } from '../config/site'
import { track } from '../services/pixel'

/** On phones and tablets, the button would cover the form's “Continuer” button. */
const SMALL_SCREEN = '(max-width: 900px)'

/** True while the order form fills the screen of a small device. */
function useTuckedOverForm() {
  const [tucked, setTucked] = useState(false)
  useEffect(() => {
    const section = document.getElementById('commander')
    if (!section || !('IntersectionObserver' in window)) return
    const small = window.matchMedia(SMALL_SCREEN)
    let formVisible = false
    const update = () => setTucked(formVisible && small.matches)
    const observer = new IntersectionObserver(
      ([entry]) => {
        formVisible = entry.isIntersecting
        update()
      },
      { rootMargin: '-35% 0px -35% 0px' }, // the form crosses the middle of the screen
    )
    observer.observe(section)
    small.addEventListener('change', update)
    return () => {
      observer.disconnect()
      small.removeEventListener('change', update)
    }
  }, [])
  return tucked
}

export default function WhatsAppButton() {
  const tucked = useTuckedOverForm()
  if (!integrations.whatsappNumber) return null
  const text = encodeURIComponent('Bonjour, je souhaite des informations pour une commande de gâteau.')
  return (
    <motion.a
      initial={{ scale: 0 }}
      animate={{ scale: tucked ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: tucked ? 0 : 0.3 }}
      whileHover={{ scale: 1.1 }}
      className="whatsapp-fab"
      style={{ pointerEvents: tucked ? 'none' : undefined }}
      tabIndex={tucked ? -1 : undefined}
      aria-hidden={tucked || undefined}
      href={`https://wa.me/${integrations.whatsappNumber}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      onClick={() => track('Contact', { method: 'whatsapp' })}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
        />
      </svg>
    </motion.a>
  )
}
