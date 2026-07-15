import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

function parsePrice(value) {
  const n = Number.parseFloat(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatEuro(amount) {
  return `€${amount.toFixed(2)}`
}

export function CartProvider({ children, venue }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const pizzas = useMemo(() => {
    const section = venue.menu.sections.find((s) => s.id === venue.ordering?.menuSectionId)
    return section?.items ?? []
  }, [venue])

  function addItem(pizza) {
    setItems((current) => {
      const existing = current.find((row) => row.name === pizza.name)
      if (existing) {
        return current.map((row) =>
          row.name === pizza.name ? { ...row, qty: row.qty + 1 } : row,
        )
      }
      return [
        ...current,
        {
          name: pizza.name,
          description: pizza.description,
          unitPrice: parsePrice(pizza.price),
          qty: 1,
        },
      ]
    })
    setOpen(true)
  }

  function setQty(name, qty) {
    setItems((current) => {
      if (qty <= 0) return current.filter((row) => row.name !== name)
      return current.map((row) => (row.name === name ? { ...row, qty } : row))
    })
  }

  function clear() {
    setItems([])
  }

  const count = items.reduce((sum, row) => sum + row.qty, 0)
  const total = items.reduce((sum, row) => sum + row.unitPrice * row.qty, 0)

  const value = {
    enabled: Boolean(venue.ordering?.enabled),
    ordering: venue.ordering,
    pizzas,
    items,
    count,
    total,
    totalLabel: formatEuro(total),
    open,
    setOpen,
    addItem,
    setQty,
    clear,
    formatEuro,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
