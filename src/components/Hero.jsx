import { useMemo } from 'react'
import { getTonight } from '../lib/programme.js'

export function Hero({ venue }) {
  const hasPhoto = Boolean(venue.hero?.image)
  const tonight = useMemo(() => getTonight(venue.programme), [venue.programme])

  return (
    <section
      id="top"
      className={`hero${hasPhoto ? ' hero--photo' : ' hero--paint'}`}
      aria-label="Welcome"
    >
      {hasPhoto ? (
        <div className="hero__media" aria-hidden="true">
          <img
            src={venue.hero.image}
            alt=""
            width="1854"
            height="1854"
            fetchPriority="high"
          />
          <div className="hero__veil" />
        </div>
      ) : null}

      <div className="hero__content">
        <p className="hero__place hero__reveal">{venue.place}</p>
        <h1 className="hero__name hero__reveal">{venue.name}</h1>
        <p className="hero__tagline hero__reveal">{venue.taglineShort}</p>
        {tonight.short ? (
          <a className="hero__tonight hero__reveal" href={tonight.href}>
            <span className="hero__tonight-label">{tonight.label}</span>
            <span className="hero__tonight-line">{tonight.short}</span>
          </a>
        ) : null}
        <div className="hero__actions hero__reveal">
          <a className="btn btn--on-hero" href={venue.bookingUrl}>
            Book a table
          </a>
        </div>
      </div>
    </section>
  )
}
