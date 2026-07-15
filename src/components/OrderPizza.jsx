import { useCart } from '../cart/CartContext.jsx'

export function OrderPizza({ venue }) {
  const { enabled, ordering, pizzas, addItem, formatEuro } = useCart()

  if (!enabled || !ordering) return null

  return (
    <section id="order" className="section order" data-reveal>
      <div className="section__intro">
        <p className="eyebrow">{ordering.eyebrow}</p>
        <h2 className="section__title">{ordering.title}</h2>
        <p className="section__body">{ordering.intro}</p>
        <p className="order__badge">Collection only · No delivery</p>
      </div>

      <ul className="order__list">
        {pizzas.map((pizza) => (
          <li className="order__item" key={pizza.name}>
            <div className="order__item-copy">
              <div className="order__item-main">
                <h3 className="order__item-name">{pizza.name}</h3>
                <span className="order__item-price">{formatEuro(Number.parseFloat(pizza.price))}</span>
              </div>
              {pizza.description ? <p className="order__item-desc">{pizza.description}</p> : null}
            </div>
            <button
              type="button"
              className="btn btn--primary order__add"
              onClick={() => addItem(pizza)}
            >
              Add
            </button>
          </li>
        ))}
      </ul>

      <p className="order__note">
        Ready from about {ordering.leadMinutes} minutes · Kitchen until {ordering.kitchenCloses} ·{' '}
        {ordering.payNote}
      </p>
    </section>
  )
}
