/**
 * Hero pictures: one main photo, and two smaller frames that cycle through theme photos
 * (ids from `themes` in options.js).
 */
export const hero = {
  main: { src: '/images/hero/birthday-cake.jpg', alt: 'Gâteau d’anniversaire rectangulaire aux couleurs pastel et bougies' },
  rotations: [
    ['spider-man', 'mouloudia', 'reine-des-neiges', 'batman', 'stitch-angel'],
    ['barbie', 'usma', 'baby-boss', 'crb'],
  ],
  /** Seconds between two photos in the small frames. */
  interval: 3.5,
}

/** The five steps of the order form, in order. */
export const steps = ['Thème', 'Dimension', 'Date & heure', 'Goût', 'Écriture']
