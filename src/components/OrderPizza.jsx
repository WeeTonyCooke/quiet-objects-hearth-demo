import { useMemo, useState } from 'react'
import { useCart } from '../cart/CartContext.jsx'

function emptyDraft() {
  return { extras: [], removals: [], note: '' }
}

function toggleOption(list, option) {
  const exists = list.some((row) => row.id === option.id)
  if (exists) return list.filter((row) => row.id !== option.id)
  return [...list, option]
}

export function OrderPizza() {
  const { enabled, ordering, customizations, extraPrice, pizzas, addItem, formatEuro } = useCart()
  const [activeName, setActiveName] = useState(null)
  const [draft, setDraft] = useState(emptyDraft)

  const extras = customizations?.extras || []
  const removals = customizations?.removals || []
  const canCustomize = Boolean(customizations)

  const activePizza = useMemo(
    () => pizzas.find((pizza) => pizza.name === activeName) || null,
    [pizzas, activeName],
  )

  const draftPrice = useMemo(() => {
    if (!activePizza) return 0
    return Number.parseFloat(activePizza.price) + draft.extras.length * extraPrice
  }, [activePizza, draft.extras.length, extraPrice])

  if (!enabled || !ordering) return null

  function openCustomize(pizza) {
    setActiveName(pizza.name)
    setDraft(emptyDraft())
  }

  function closeCustomize() {
    setActiveName(null)
    setDraft(emptyDraft())
  }

  function confirmAdd() {
    if (!activePizza) return
    addItem(activePizza, draft)
    closeCustomize()
  }

  return (
    <section id="order" className="section order" data-reveal>
      <div className="section__intro">
        <p className="eyebrow">{ordering.eyebrow}</p>
        <h2 className="section__title">{ordering.title}</h2>
        <p className="section__body">{ordering.intro}</p>
        <p className="order__badge">Collection only · No delivery</p>
      </div>

      <ul className="order__list">
        {pizzas.map((pizza) => {
          const isOpen = activeName === pizza.name
          return (
            <li className={`order__item${isOpen ? ' is-open' : ''}`} key={pizza.name}>
              <div className="order__item-copy">
                <div className="order__item-main">
                  <h3 className="order__item-name">{pizza.name}</h3>
                  <span className="order__item-price">{formatEuro(Number.parseFloat(pizza.price))}</span>
                </div>
                {pizza.description ? <p className="order__item-desc">{pizza.description}</p> : null}
              </div>

              {canCustomize ? (
                <button
                  type="button"
                  className="btn btn--primary order__add"
                  aria-expanded={isOpen}
                  onClick={() => (isOpen ? closeCustomize() : openCustomize(pizza))}
                >
                  {isOpen ? 'Close' : 'Add'}
                </button>
              ) : (
                <button type="button" className="btn btn--primary order__add" onClick={() => addItem(pizza)}>
                  Add
                </button>
              )}

              {isOpen && canCustomize ? (
                <div className="order__customize">
                  <fieldset className="order__fieldset">
                    <legend>Leave off</legend>
                    <div className="order__options">
                      {removals.map((option) => {
                        const checked = draft.removals.some((row) => row.id === option.id)
                        return (
                          <label key={option.id} className="order__option">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setDraft((current) => ({
                                  ...current,
                                  removals: toggleOption(current.removals, option),
                                }))
                              }
                            />
                            <span>{option.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="order__fieldset">
                    <legend>Extra · +{formatEuro(extraPrice)} each</legend>
                    <div className="order__options">
                      {extras.map((option) => {
                        const checked = draft.extras.some((row) => row.id === option.id)
                        return (
                          <label key={option.id} className="order__option">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                setDraft((current) => ({
                                  ...current,
                                  extras: toggleOption(current.extras, option),
                                }))
                              }
                            />
                            <span>{option.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <label className="order__line-note">
                    Note <span className="optional">(optional)</span>
                    <input
                      type="text"
                      value={draft.note}
                      onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))}
                      placeholder={customizations.notePlaceholder || 'Anything else for this pizza?'}
                    />
                  </label>

                  <div className="order__customize-actions">
                    <p className="order__customize-total">
                      <span>This pizza</span>
                      <strong>{formatEuro(draftPrice)}</strong>
                    </p>
                    <button type="button" className="btn btn--primary" onClick={confirmAdd}>
                      Add to order
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      <p className="order__note">
        Ready from about {ordering.leadMinutes} minutes · Kitchen until {ordering.kitchenCloses} ·{' '}
        {ordering.payNote}
      </p>
    </section>
  )
}
