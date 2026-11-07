# Google Sheets — réception des commandes

Chaque commande envoyée depuis le site ajoute une ligne dans une feuille Google Sheets :
référence, client, téléphone, thème, dimension, goût, date, heure, texte sur le gâteau, remarque.

## Mise en place (5 minutes)

1. Ouvrez la feuille Google Sheets des commandes (ex. « Patisserie Ben Khelifa ») ou créez-en une.
2. Menu **Extensions → Apps Script**.
3. Remplacez le contenu de `Code.gs` par le fichier [`Code.gs`](./Code.gs) de ce dossier, puis enregistrez.
4. **Déployer → Nouveau déploiement** :
   - Type : **Application Web**
   - Exécuter en tant que : **Moi**
   - Qui a accès : **Tout le monde**
5. Autorisez l’accès quand Google le demande.
6. Copiez l’URL de l’application Web (`https://script.google.com/macros/s/…/exec`) dans
   `GOOGLE_SHEETS_WEBHOOK_URL`, en haut de `src/config/site.js` (ou dans la variable d’environnement
   `VITE_GOOGLE_SHEETS_WEBHOOK_URL`, qui est prioritaire).
7. Redéployez le site et passez une commande de test.

L’onglet **Commandes site web** et ses en-têtes sont créés automatiquement à la première commande ;
les autres onglets de la feuille (ex. les formulaires Facebook) ne sont pas modifiés.
La colonne **Statut** (« Nouvelle ») peut ensuite être modifiée à la main : Confirmée, En préparation, Livrée…

## Modifier le script

Après toute modification de `Code.gs`, faites **Déployer → Gérer les déploiements → Modifier → Nouvelle version**,
sinon l’ancienne version reste active. L’URL ne change pas.

## Notes

- Le site envoie la requête en `no-cors` (Apps Script ne gère pas CORS) : le navigateur ne peut pas lire la réponse,
  il sait seulement que la requête est partie. Vérifiez la feuille après votre commande de test.
- Pour être notifié par e-mail à chaque commande, décommentez la ligne `MailApp.sendEmail` dans `doPost`.
