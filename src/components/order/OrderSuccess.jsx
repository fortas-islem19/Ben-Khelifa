import { motion } from 'motion/react'
import { integrations } from '../../config/site'
import Confetti from '../motion/Confetti'
import { formatDate } from '../../utils/format'
import { track } from '../../services/pixel'

export default function OrderSuccess({ result, onNewOrder }) {
  const { reference, record, sent } = result

  const whatsappText = encodeURIComponent(
    [
      `Bonjour, je viens de passer la commande ${reference}.`,
      `Modèle : ${record.model}`,
      `Taille : ${record.size}`,
      `Date : ${formatDate(record.date)} (${record.timeSlot}) — ${record.fulfillment}`,
      `Nom : ${record.customerName}`,
    ].join('\n'),
  )

  return (
    <motion.div
      className="success"
      role="status"
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
    >
      <Confetti />
      <motion.span
        className="success__icon"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 }}
      >
        <svg viewBox="0 0 24 24" width="30" height="30">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          />
        </svg>
      </motion.span>
      <h3>Merci {record.customerName.split(' ')[0]} !</h3>
      <p>
        Votre demande <strong>{reference}</strong> a bien été reçue. Notre équipe vous appelle très vite au{' '}
        <strong>{record.phone}</strong> pour confirmer les détails et le prix final.
      </p>
      {!sent && import.meta.env.DEV && (
        <p className="success__dev">
          Mode développement : <code>VITE_GOOGLE_SHEETS_WEBHOOK_URL</code> n’est pas configurée, la commande a été
          affichée dans la console.
        </p>
      )}
      <div className="success__actions">
        {integrations.whatsappNumber && (
          <a
            className="btn btn--gold"
            href={`https://wa.me/${integrations.whatsappNumber}?text=${whatsappText}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('Contact', { method: 'whatsapp', reference })}
          >
            Confirmer sur WhatsApp
          </a>
        )}
        <button type="button" className="btn btn--ghost" onClick={onNewOrder}>
          Nouvelle commande
        </button>
      </div>
    </motion.div>
  )
}
