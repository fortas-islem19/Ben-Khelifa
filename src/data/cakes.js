/**
 * Cake catalog.
 *
 * To add a model: put the photo in `public/images/cakes/` and add an entry below.
 * `basePrice` is the price for the model's default size (`defaultSize`, see options.js).
 * Prices are indicative and confirmed by the shop when the order is validated.
 *
 * Later this file can be replaced by an API / CMS call without touching the components:
 * they only depend on the shape of these objects.
 */
export const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'birthday', label: 'Anniversaire' },
  { id: 'graduation', label: 'Réussite & Bac' },
  { id: 'wedding', label: 'Mariage & Fiançailles' },
]

export const cakes = [
  {
    id: 'minecraft-anis',
    name: 'Pixel Adventure',
    category: 'birthday',
    occasion: 'Anniversaire',
    image: '/images/cakes/minecraft-anis.jpg',
    description:
      'Gâteau d’anniversaire à thème jeu vidéo, crème au beurre vert pistache, toppers imprimés au prénom de l’enfant.',
    tags: ['Prénom personnalisé', 'Toppers imprimés'],
    basePrice: 6500,
    defaultSize: 'm',
    defaultFinish: 'buttercream',
    personalizable: { name: true, age: true, message: true },
  },
  {
    id: 'bac-graduation',
    name: 'Réussite Dorée',
    category: 'graduation',
    occasion: 'Réussite / Bac',
    image: '/images/cakes/bac-graduation.jpg',
    description:
      'Deux étages blanc & caramel, toques en pâte à sucre, lettres dorées à la feuille, sphères noires et or et couronne de laurier.',
    tags: ['2 étages', 'Lettrage doré', 'Topper BAC'],
    basePrice: 12000,
    defaultSize: 'l',
    defaultFinish: 'fondant',
    personalizable: { name: true, age: false, message: true },
  },
  {
    id: 'wedding-roses',
    name: 'Drapé de Roses',
    category: 'wedding',
    occasion: 'Fiançailles',
    image: '/images/cakes/wedding-roses.jpg',
    description:
      'Grand gâteau rectangulaire en pâte à sucre, drapé de satin, bouquet de roses et gypsophile, alliances dorées et filets d’or.',
    tags: ['Grand format', 'Fleurs', 'Fiançailles'],
    basePrice: 18000,
    defaultSize: 'xl',
    defaultFinish: 'fondant',
    personalizable: { name: true, age: false, message: true },
  },
]

/** Pseudo-model used when the customer wants to design their own cake. */
export const customCake = {
  id: 'custom',
  name: 'Création sur mesure',
  category: 'custom',
  image: null,
  description: 'Décrivez votre idée, ajoutez une photo d’inspiration : nous la réalisons pour vous.',
  tags: [],
  basePrice: 5000,
  defaultSize: 'm',
  defaultFinish: 'buttercream',
  personalizable: { name: true, age: true, message: true },
}

export const findCake = (id) => (id === customCake.id ? customCake : cakes.find((c) => c.id === id))
