/**
 * Customization options shown in the order form.
 * `price` = fixed supplement, `multiplier` = factor applied to the base price.
 */
export const occasions = [
  'Anniversaire',
  'Mariage',
  'Fiançailles',
  'Réussite / Bac',
  'Naissance / Baptême',
  'Entreprise',
  'Autre',
]

export const sizes = [
  { id: 's', label: 'Petit', servings: '6 – 8 parts', detail: 'Ø 16 cm', multiplier: 0.7 },
  { id: 'm', label: 'Moyen', servings: '10 – 12 parts', detail: 'Ø 20 cm', multiplier: 1 },
  { id: 'l', label: 'Grand', servings: '15 – 20 parts', detail: 'Ø 24 cm ou 2 étages', multiplier: 1.5 },
  { id: 'xl', label: 'Réception', servings: '25 – 35 parts', detail: '2–3 étages ou rectangulaire', multiplier: 2.4 },
  { id: 'xxl', label: 'Événement', servings: '40 parts et +', detail: 'Sur devis', multiplier: 3.5, onQuote: true },
]

export const shapes = [
  { id: 'round', label: 'Rond' },
  { id: 'square', label: 'Carré' },
  { id: 'rectangle', label: 'Rectangulaire' },
  { id: 'heart', label: 'Cœur', price: 800 },
]

export const tiers = [
  { id: 1, label: '1 étage' },
  { id: 2, label: '2 étages', price: 2500 },
  { id: 3, label: '3 étages', price: 5500 },
]

export const sponges = [
  { id: 'vanilla', label: 'Vanille', color: '#f1d79b' },
  { id: 'chocolate', label: 'Chocolat', color: '#6b3e26' },
  { id: 'almond', label: 'Amande', color: '#e6cc9e' },
  { id: 'pistachio', label: 'Pistache', price: 800, color: '#b6c784' },
  { id: 'red-velvet', label: 'Red velvet', price: 500, color: '#a3243a' },
  { id: 'lemon', label: 'Citron', color: '#f3df72' },
]

export const fillings = [
  { id: 'chantilly-berries', label: 'Chantilly & fruits rouges', color: '#f4cbd3' },
  { id: 'chocolate-ganache', label: 'Ganache chocolat', color: '#43231a' },
  { id: 'praline', label: 'Praliné noisette', price: 600, color: '#b07a45' },
  { id: 'pistachio-cream', label: 'Crème pistache', price: 900, color: '#a5bd72' },
  { id: 'salted-caramel', label: 'Caramel beurre salé', price: 500, color: '#c98a3e' },
  { id: 'lotus', label: 'Lotus spéculoos', price: 500, color: '#b26f37' },
  { id: 'strawberry-mousse', label: 'Mousse fraise', color: '#f19aac' },
]

export const finishes = [
  { id: 'buttercream', label: 'Crème au beurre', hint: 'Lisse et gourmande' },
  { id: 'chantilly', label: 'Chantilly', hint: 'Légère, à consommer vite' },
  { id: 'fondant', label: 'Pâte à sucre', hint: 'Décors sculptés', price: 1500 },
  { id: 'naked', label: 'Naked cake', hint: 'Bords apparents' },
  { id: 'drip', label: 'Drip ganache', hint: 'Coulures chocolat', price: 700 },
]

export const colors = [
  { id: 'white', label: 'Blanc', hex: '#ffffff' },
  { id: 'ivory', label: 'Ivoire', hex: '#f3ead8' },
  { id: 'gold', label: 'Or', hex: '#c9a24b' },
  { id: 'black', label: 'Noir', hex: '#1a1a1a' },
  { id: 'blush', label: 'Rose poudré', hex: '#f2c4c9' },
  { id: 'fuchsia', label: 'Fuchsia', hex: '#e2367a' },
  { id: 'lilac', label: 'Lilas', hex: '#c8b6e2' },
  { id: 'sky', label: 'Bleu ciel', hex: '#9fd0ef' },
  { id: 'navy', label: 'Bleu nuit', hex: '#1f2f56' },
  { id: 'mint', label: 'Vert d’eau', hex: '#bfe3cf' },
  { id: 'lime', label: 'Vert pomme', hex: '#b4d94a' },
  { id: 'caramel', label: 'Caramel', hex: '#e2a35b' },
]
export const maxColors = 3

/** Default look of the cake builder (custom cakes). */
export const builderDefaults = {
  sponge: 'vanilla',
  filling: 'chantilly-berries',
  finish: 'buttercream',
  baseColor: '#f3ead8',
  accentColor: '#c9a24b',
  tiers: 1,
  shape: 'round',
}

export const decorations = [
  { id: 'fresh-flowers', label: 'Fleurs (roses, gypsophile)', price: 1500 },
  { id: 'acrylic-topper', label: 'Topper acrylique doré personnalisé', price: 1200 },
  { id: 'printed-topper', label: 'Toppers photo imprimés', price: 800 },
  { id: 'edible-print', label: 'Impression alimentaire (photo)', price: 1000 },
  { id: 'spheres', label: 'Sphères chocolat or & noir', price: 700 },
  { id: 'sugar-figures', label: 'Figurines en pâte à sucre', price: 2000 },
  { id: 'gold-leaf', label: 'Feuille d’or alimentaire', price: 900 },
  { id: 'candles', label: 'Bougies & chiffres', price: 300 },
  { id: 'fruits', label: 'Fruits frais (fraises)', price: 900 },
  { id: 'sprinkles', label: 'Vermicelles & perles', price: 300 },
]

export const timeSlots = ['09:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00', '18:00 – 21:00']

export const fulfillment = [
  { id: 'pickup', label: 'Retrait en boutique', hint: 'Gratuit' },
  { id: 'delivery', label: 'Livraison', hint: 'Frais selon la zone, confirmés par téléphone' },
]

export const referralSources = ['Instagram', 'Facebook', 'TikTok', 'Bouche-à-oreille', 'Google', 'Déjà client(e)', 'Autre']

export const byId = (list, id) => list.find((item) => item.id === id)

/** Human name of a builder color (palette name, or the hex code for a custom color). */
export const colorName = (hex) => (hex ? (colors.find((c) => c.hex === hex)?.label ?? hex) : '')
