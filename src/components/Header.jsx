import { useEffect, useMemo, useState } from 'react'
import { getTonight } from '../lib/programme.js'

export function Header({ venue }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const canOrder = Boolean(venue.ordering?.enabled)
  const tonight = useMemo(() => getTonight(venue.programme), [venue.programme])

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
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <a className="site-header__brand" href="#top" onClick={close}>
          {venue.name}
        </a>

        <a className="tonight-cue" href={tonight.href} onClick={close}>
          <span className="tonight-cue__label">{tonight.label}</span>
          <span className="tonight-cue__line">{tonight.short}</span>
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
            {canOrder ? (
              <>
                <a className="site-nav__ghost" href={venue.bookingUrl} onClick={close}>
                  Book a table
                </a>
                <a className="site-nav__primary" href="#order" onClick={close}>
                  Order pizza
                </a>
              </>
            ) : (
              <a className="site-nav__primary" href={venue.bookingUrl} onClick={close}>
                Book a table
              </a>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
