/**
 * Visual of a cake theme: the photo when one is set in `src/data/options.js`,
 * otherwise a card in the theme colours (stripes + crest for the football clubs,
 * gradient + emoji for the characters).
 */
export default function ThemeArt({ theme, className = '' }) {
  const [a, b] = theme.colors

  if (theme.image) {
    return (
      <span className={`theme-art theme-art--photo ${className}`}>
        <img src={theme.image} alt="" loading="lazy" />
      </span>
    )
  }

  if (theme.club) {
    return (
      <span
        className={`theme-art theme-art--club ${className}`}
        style={{ background: `repeating-linear-gradient(90deg, ${a} 0 16px, ${b} 16px 32px)` }}
      >
        <span className="theme-art__crest" style={{ color: a, borderColor: a }}>
          {theme.badge}
          <small>⚽</small>
        </span>
      </span>
    )
  }

  return (
    <span className={`theme-art ${className}`} style={{ background: `radial-gradient(circle at 28% 22%, ${b}, ${a} 72%)` }}>
      <span className="theme-art__emoji">{theme.emoji}</span>
    </span>
  )
}
