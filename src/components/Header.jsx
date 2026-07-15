import { useEffect, useMemo, useState } from 'react'
import { getTickerItems } from '../lib/programme.js'

const KIND_ICON = {
  music: '♪',
  quiz: '?',
  poker: '♠',
  open: '✦',
  other: '·',
}

function TickerIcon({ kind }) {
  return (
    <span className="events-ticker__icon" aria-hidden="true">
      {KIND_ICON[kind] || KIND_ICON.other}
    </span>
  )
}

export function Header({ venue }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const canOrder = Boolean(venue.ordering?.enabled)

  const events = useMemo(() => getTickerItems(venue.programme, now), [venue.programme, now])
  const tickerItems = events.length ? [...events, ...events, ...events] : []

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolled(!(entry.isIntersecting && entry.intersectionRatio > 0.4))
      },
      { threshold: [0, 0.4, 0.7, 1] },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', open)
    return () => document.body.classList.remove('nav-open')
  }, [open])

  useEffect(() => {
    if (!scrolled && open) setOpen(false)
  }, [scrolled, open])

  // Refresh ribbon content when the calendar day rolls over
  useEffect(() => {
    const tick = () => {
      const next = new Date()
      setNow((prev) => (prev.getDay() === next.getDay() ? prev : next))
    }
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={`site-header${scrolled ? ' is-scrolled' : ''}${canOrder ? ' has-order-fab' : ''}`}
      >
        {tickerItems.length ? (
          <a className="events-ticker" href="#whats-on" onClick={close} aria-label="What’s on this week">
            <span className="events-ticker__track">
              {tickerItems.map((item, index) => (
                <span
                  className={`events-ticker__item${item.highlight ? ' is-today' : ''}`}
                  key={`${item.label}-${item.text}-${index}`}
                >
                  <TickerIcon kind={item.kind} />
                  <span className="events-ticker__label">{item.label}</span>
                  <span className="events-ticker__sep" aria-hidden="true">
                    /
                  </span>
                  <span className="events-ticker__text">{item.text}</span>
                  <span className="events-ticker__diamond" aria-hidden="true">
                    ◇
                  </span>
                </span>
              ))}
            </span>
          </a>
        ) : null}

        {/* Landing: ticker only — hamburger/nav appear after scroll */}
        <div className="site-header__bar">
          <div className="site-header__inner">
            <a className="site-header__brand" href="#top" onClick={close}>
              {venue.name}
            </a>

            <button
              className="site-header__toggle"
              type="button"
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>

            <nav id="site-nav" className={`site-nav${open ? ' is-open' : ''}`}>
              <div className="site-nav__links">
                <a href="#menu" onClick={close}>
                  Menu
                </a>
                <a href="#whats-on" onClick={close}>
                  What’s on
                </a>
                <a href="#visit" onClick={close}>
                  Visit
                </a>
              </div>

              <div className="site-nav__actions">
                <a className="site-nav__primary" href={venue.bookingUrl} onClick={close}>
                  Book a table
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {canOrder ? (
        <a className="order-fab" href="#order" aria-label="Order pizza for collection">
          <span className="order-fab__text">
            Order
            <br />
            pizza
          </span>
        </a>
      ) : null}
    </>
  )
}
