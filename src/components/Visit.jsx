import { useState } from 'react'

export function Visit({ venue }) {
  const [sent, setSent] = useState(false)
  const { visit, address, hours, phone, email, bookingNote, mapEmbedUrl, directionsUrl } = venue

  function onBook(event) {
    event.preventDefault()
    setSent(true)
    window.setTimeout(() => setSent(false), 3200)
  }

  return (
    <section id="visit" className="section visit" data-reveal>
      <div className="section__intro">
        <p className="eyebrow">{visit.eyebrow}</p>
        <h2 className="section__title">{visit.title}</h2>
        <p className="section__body">{address.landmark}</p>
      </div>

      <div className="visit__grid">
        <div className="visit__details">
          <div className="visit__block">
            <h3>Address</h3>
            <p>
              {address.street}
              <br />
              {address.locality}, {address.region}
              <br />
              {address.postalCode}
            </p>
            <a className="text-link" href={directionsUrl} target="_blank" rel="noreferrer">
              Get directions
            </a>
          </div>

          <div className="visit__block">
            <h3>Hours</h3>
            <ul className="hours-list">
              {hours.map((row) => (
                <li key={row.days}>
                  <span>{row.days}</span>
                  <span>{row.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="visit__block">
            <h3>Contact</h3>
            <p>
              <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              <br />
              <a href={`mailto:${email}`}>{email}</a>
            </p>
            <p className="visit__tip">{visit.parkingTip}</p>
            {venue.giftCards?.url ? (
              <p className="visit__tip">
                <a href={venue.giftCards.url} target="_blank" rel="noreferrer">
                  {venue.giftCards.label || 'Gift cards'}
                </a>
              </p>
            ) : null}
          </div>
        </div>

        <div className="visit__book">
          <h3>Book a table</h3>
          <p className="visit__note">{bookingNote}</p>

          <form className="book-form" onSubmit={onBook}>
            <label>
              Date
              <input type="date" name="date" required />
            </label>
            <label>
              Time
              <input type="time" name="time" defaultValue="19:00" required />
            </label>
            <label>
              Guests
              <input type="number" name="guests" min="1" max="12" defaultValue="2" required />
            </label>
            <label className="book-form__full">
              Name
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="book-form__full">
              Phone
              <input type="tel" name="phone" autoComplete="tel" required />
            </label>
            <button className="btn btn--primary book-form__full" type="submit">
              Request table
            </button>
            <p
              className={`book-form__confirm${sent ? ' is-visible' : ''}`}
              role="status"
              aria-live="polite"
            >
              {sent ? 'Request noted — we’ll confirm by phone.' : '\u00a0'}
            </p>
          </form>
        </div>
      </div>

      <div className="visit__map">
        <iframe
          title={`Map showing ${venue.name}`}
          src={mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  )
}
