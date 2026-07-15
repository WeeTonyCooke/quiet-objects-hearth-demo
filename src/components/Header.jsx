import { useEffect, useMemo, useState } from 'react'
import { getTonight } from '../lib/programme.js'

function useRollingEvents(programme) {
  const items = useMemo(() => {
    const lineup = Array.isArray(programme?.lineup) ? programme.lineup : []
    if (!lineup.length) {
      const tonight = getTonight(programme)
      return tonight.short
        ? [{ dayLabel: tonight.label, cue: tonight.short, href: tonight.href }]
        : []
    }
    return lineup.map((row) => ({
      dayLabel: row.dayLabel || 'On',
      cue: row.cue || [row.name, row.time].filter(Boolean).join(' · '),
      href: row.href || '#whats-on',
    }))
  }, [programme])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length < 2) return undefined
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length)
    }, 3400)
    return () => window.clearInterval(id)
  }, [items.length])

  return items[index] || null
}

export function Header({ venue }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const canOrder = Boolean(venue.ordering?.enabled)
  const event = useRollingEvents(venue.programme)

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

  const close = () => setOpen(false)

  return (
    <>
      <header
        className={`site-header${scrolled ? ' is-scrolled' : ''}${canOrder ? ' has-order-fab' : ''}`}
      >
        <div className="site-header__inner">
          <a className="site-header__brand" href="#top" onClick={close}>
            {venue.name}
          </a>

          {event ? (
            <a className="tonight-cue" href={event.href} onClick={close}>
              <span className="tonight-cue__label">{event.dayLabel}</span>
              <span className="tonight-cue__line" key={`${event.dayLabel}-${event.cue}`}>
                {event.cue}
              </span>
            </a>
          ) : null}

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

            {/* Book only when scrolled (or in the open mobile menu) — hero owns first-viewport Book */}
            <div className="site-nav__actions">
              <a className="site-nav__primary" href={venue.bookingUrl} onClick={close}>
                Book a table
              </a>
            </div>
          </nav>
        </div>
      </header>

      {canOrder ? (
        <a className="order-fab" href="#order" aria-label="Order pizza for collection">
          <span className="order-fab__text">Order pizza</span>
        </a>
      ) : null}
    </>
  )
}
