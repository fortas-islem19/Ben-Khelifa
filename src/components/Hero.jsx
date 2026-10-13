import logo from '../assets/logo-full.png'
import { cakes } from '../data/cakes'
import { useOrderContext } from '../hooks/OrderContext'

export default function Hero() {
  const { startOrder } = useOrderContext()
  const [a, b, c] = cakes

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <img className="hero__logo" src={logo} alt="Pâtisserie Benkhelifa — depuis 2009" width="220" />
          <h1>
            Le gâteau de vos <em>plus beaux</em> moments
          </h1>
          <p className="lead">
            Anniversaires, fiançailles, mariages, réussites : choisissez un modèle de notre collection ou imaginez le
            vôtre. Nous le réalisons à la main, dans notre atelier.
          </p>
          <div className="hero__cta">
            <button type="button" className="btn btn--dark" onClick={() => startOrder()}>
              Créer mon gâteau
            </button>
            <a className="btn btn--ghost" href="#collection">
              Voir la collection
            </a>
          </div>
        </div>

        <div className="hero__gallery" aria-hidden="true">
          {[a, b, c].filter(Boolean).map((cake, i) => (
            <figure key={cake.id} className={`hero__photo hero__photo--${i + 1}`}>
              <img src={cake.image} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
            </figure>
          ))}
          <span className="hero__badge">
            Depuis
            <strong>2009</strong>
          </span>
        </div>
      </div>
    </section>
  )
}
