# Pâtisserie Benkhelifa — Landing page & commandes

Landing page React (Vite) pour commander un **gâteau à thème** en ligne, avec un formulaire simple en **5 étapes** :

1. **Thème** — Mouloudia, USMA, CRB, Stitch & Angel, Spider-Man, Batman, Barbie, Baby Boss, Reine des neiges
2. **Dimension** — 30 × 20 cm ou 30 × 40 cm
3. **Date & heure** — boutons pour les prochains jours (ou calendrier) + choix de l’heure
4. **Goût** — Chocolat ou Fruit
5. **Écriture** — le texte à écrire sur le gâteau (avec aperçu), nom, téléphone, remarque, puis récapitulatif

Un simple toucher sur un thème, une dimension ou un goût passe directement à l’étape suivante.
Les commandes sont envoyées vers **Google Sheets**, avec suivi **Meta Pixel**.

Design : page blanche avec un fond animé léger (taches pastel qui dérivent, grille de points, vermicelles flottants).
Animations : [Motion](https://motion.dev) (`motion/react`) et CSS. Elles sont automatiquement coupées quand
l’appareil du visiteur demande moins d’animations (`prefers-reduced-motion`).

## Démarrage

```bash
npm install
cp .env.example .env   # puis remplir les variables
npm run dev            # http://localhost:5173
npm run build          # build de production dans dist/
```

L’URL Google Sheets et l’ID du Pixel Meta (`1865859407934132`) se règlent en haut de `src/config/site.js`
(`GOOGLE_SHEETS_WEBHOOK_URL`, `META_PIXEL_ID`). Les variables d’environnement ci-dessous, si elles sont définies,
sont prioritaires :

| Variable | Rôle |
| --- | --- |
| `VITE_GOOGLE_SHEETS_WEBHOOK_URL` | URL de l’Apps Script qui écrit les commandes — voir [integrations/google-sheets](integrations/google-sheets/README.md) |
| `VITE_META_PIXEL_ID` | ID du Pixel Meta (vide = pas de tracking) |
| `VITE_WHATSAPP_NUMBER` | Numéro WhatsApp, format international sans `+` (vide = bouton masqué) |

## Modifier le contenu (sans toucher aux composants)

| Fichier | Contenu |
| --- | --- |
| `src/config/site.js` | Nom, téléphone, adresse, horaires, réseaux, délai minimum de commande |
| `src/data/options.js` | Thèmes, dimensions, heures, goûts, longueur max du texte |
| `src/data/content.js` | Photos du haut de page, noms des 5 étapes |

**Ajouter une photo à un thème** : mettez la photo dans `public/images/themes/` puis ajoutez
`image: '/images/themes/nom.jpg'` au thème dans `src/data/options.js`. La photo remplace alors la carte colorée.

> Le téléphone et l’adresse dans `src/config/site.js` sont des **valeurs d’exemple** : remplacez-les par les vôtres.

Chaque commande reçoit une référence (`BK-AAMMJJ-XXXX`) ; la page de confirmation propose de l’envoyer sur WhatsApp.

## Événements Meta Pixel

| Événement | Déclencheur |
| --- | --- |
| `PageView` | Chargement de la page |
| `ViewContent` | Le formulaire de commande apparaît à l’écran (1 fois par visite) |
| `AddToCart` | Thème choisi (1 fois par commande) |
| `InitiateCheckout` | Arrivée à l’étape 5, nom et téléphone (1 fois par commande) |
| `Lead` + `Purchase` | Commande envoyée (`eventID` = référence de commande) |
| `Contact` | Clic sur WhatsApp ou sur le numéro de téléphone |
| `OrderStepCompleted` (custom) | Chaque étape validée (`step`, `step_number`) |

Chaque événement de commande envoie le thème (`content_name`, `content_ids`), la dimension et le goût
(`content_category`), et une valeur en DZD. La valeur vient du champ `price` des dimensions dans
`src/data/options.js` (non affiché sur la page) : renseignez-le pour optimiser vos campagnes sur la valeur.

### API Conversions (côté serveur)

Sur le site déployé, chaque événement standard est envoyé **deux fois** avec le même `eventID` : par le Pixel
dans le navigateur et par le serveur (`api/meta-capi.js`, fonction Vercel). Meta fusionne les deux ; les visiteurs
qui bloquent le Pixel (bloqueurs de pub, iPhone) sont quand même comptés. Pour `Lead` et `Purchase`, le nom et le
téléphone sont hachés (SHA-256) sur le serveur avant d’être envoyés à Meta, ce qui améliore l’attribution.

Variables d’environnement Vercel (Project → Settings → Environment Variables) :

| Variable | Rôle |
| --- | --- |
| `META_CAPI_ACCESS_TOKEN` | **Obligatoire.** Jeton d’accès de l’API Conversions (Gestionnaire d’événements → Pixel → Paramètres). Ne jamais le mettre dans le code : le dépôt est public. |
| `META_TEST_EVENT_CODE` | Facultatif. Code `TEST…` de l’onglet « Tester les événements », pour vérifier les envois serveur. À retirer ensuite. |
| `META_PIXEL_ID` | Facultatif. Par défaut, le Pixel du site. |

Après toute modification d’une variable, redéployez le site.

Conseil : activez aussi **Correspondance avancée automatique** dans le Gestionnaire d’événements (Pixel → Paramètres) :
le Pixel récupère alors le nom et le téléphone du formulaire (hachés) et améliore l’attribution des commandes.

## Architecture

```
api/meta-capi.js          fonction Vercel : envoi des événements à l’API Conversions de Meta
src/
  config/site.js          réglages de la marque, ID Pixel, URL Google Sheets
  data/                   thèmes, dimensions, goûts, heures, textes
  services/
    orders.js             point d’entrée unique d’envoi d’une commande
    googleSheets.js       transport vers Apps Script
    pixel.js              Meta Pixel + envoi parallèle vers api/meta-capi (no-op si non configuré)
  hooks/OrderContext.jsx  état de la commande + étape en cours
  utils/                  validation, formatage des dates
  components/             fond animé, en-tête, haut de page, pied de page
  components/order/       formulaire en 5 étapes
  components/motion/      animations réutilisables (apparition, confettis)
integrations/google-sheets/Code.gs   script à coller dans Google Sheets
```

Pour passer plus tard à un vrai backend (API, Firebase, Supabase…), seul `services/orders.js` est à modifier.
