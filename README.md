# Pâtisserie Benkhelifa — Landing page & commandes

Landing page React (Vite) pour présenter la collection de gâteaux et prendre des commandes en ligne :
modèles de la collection ou création sur mesure, personnalisation complète, estimation de prix en direct,
envoi vers **Google Sheets** et suivi **Meta Pixel**.

## Démarrage

```bash
npm install
cp .env.example .env   # puis remplir les variables
npm run dev            # http://localhost:5173
npm run build          # build de production dans dist/
```

| Variable | Rôle |
| --- | --- |
| `VITE_GOOGLE_SHEETS_WEBHOOK_URL` | URL de l’Apps Script qui écrit les commandes — voir [integrations/google-sheets](integrations/google-sheets/README.md) |
| `VITE_META_PIXEL_ID` | ID du Pixel Meta (vide = pas de tracking) |
| `VITE_WHATSAPP_NUMBER` | Numéro WhatsApp, format international sans `+` (vide = bouton masqué) |

## Modifier le contenu (sans toucher aux composants)

| Fichier | Contenu |
| --- | --- |
| `src/config/site.js` | Nom, téléphone, adresse, horaires, réseaux, devise, délai minimum de commande |
| `src/data/cakes.js` | Catalogue : ajouter un modèle = 1 photo dans `public/images/cakes/` + 1 entrée |
| `src/data/options.js` | Tailles, génoises, garnitures, finitions, couleurs, décorations, créneaux + suppléments |
| `src/data/content.js` | Points forts, étapes, FAQ |

> Les prix du catalogue et les suppléments, ainsi que le téléphone et l’adresse, sont des **valeurs d’exemple** :
> remplacez-les par les vôtres.

## Parcours de commande

1. **Modèle** — un modèle de la collection ou « Création sur mesure » + occasion
2. **Personnalisation** — taille, forme, génoise, garniture, finition, couleurs, décorations, prénom/âge/message, description, photo d’inspiration
3. **Date & retrait** — retrait en boutique ou livraison, date (délai minimum configurable), créneau
4. **Coordonnées** — nom, téléphone, e-mail, source, remarques

Le récapitulatif et l’estimation de prix se mettent à jour en direct. Chaque commande reçoit une référence
(`BK-AAMMJJ-XXXX`) ; la page de confirmation propose de l’envoyer sur WhatsApp.

## Événements Meta Pixel

| Événement | Déclencheur |
| --- | --- |
| `PageView` | Chargement de la page |
| `ViewContent` | Clic « Commander » sur un modèle |
| `InitiateCheckout` | Fin de l’étape 1 du formulaire |
| `OrderStepCompleted` (custom) | Chaque étape validée |
| `Lead` | Commande envoyée (valeur estimée + devise, `eventID` = référence de commande) |
| `Contact` | Clic WhatsApp |

L’`eventID` permet d’ajouter plus tard l’API Conversions côté serveur sans doublons.

## Architecture

```
src/
  config/site.js          réglages de la marque + variables d’environnement
  data/                   catalogue, options, textes (remplaçables par une API/CMS)
  services/
    orders.js             point d’entrée unique d’envoi d’une commande
    googleSheets.js       transport vers Apps Script
    pixel.js              wrapper Meta Pixel (no-op si non configuré)
  hooks/                  état de la commande (useReducer) + contexte
  utils/                  prix, validation, formatage, compression d’image
  components/             sections de la page
  components/order/       formulaire multi-étapes
integrations/google-sheets/Code.gs   script à coller dans Google Sheets
```

Pour passer plus tard à un vrai backend (API, Firebase, Supabase…), seul `services/orders.js` est à modifier ;
pour un catalogue dynamique, remplacez les imports de `src/data/` par un appel API.
