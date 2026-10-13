import { integrations } from '../../config/site'
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
    <div className="success" role="status">
      <span className="success__icon" aria-hidden="true">
        ✓
      </span>
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
    </div>
  )
}
