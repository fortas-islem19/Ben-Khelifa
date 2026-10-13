import { motion } from 'motion/react'

import { ease } from './variants'

/** Fades/slides its children in when they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, as = 'div', className, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Splits a sentence into words that rise one after another. */
export function WordsReveal({ text, className, delay = 0 }) {
  const words = text.split(' ')
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="word-mask" aria-hidden="true">
            <motion.span
              className="word"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease, delay: delay + i * 0.07 }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}
