import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'gg-cart-v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// A cart line looks like:
// { key, itemId, name, section, unitPrice, qty, minQty, choices: [{group, label}], extras: [{label, qty, price}] }
export function CartProvider({ children }) {
  const [lines, setLines] = useState(load)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable — cart still works for this visit */
    }
  }, [lines])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0)

    return {
      lines,
      count,
      subtotal,
      drawerOpen,
      toast,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      addLine(line) {
        setLines((prev) => {
          const existing = prev.find((l) => l.key === line.key)
          if (existing) {
            return prev.map((l) => (l.key === line.key ? { ...l, qty: l.qty + line.qty } : l))
          }
          return [...prev, line]
        })
        setToast(`${line.name} added to your order`)
      },
      setQty(key, qty) {
        setLines((prev) =>
          prev
            .map((l) => (l.key === key ? { ...l, qty: Math.max(qty, l.minQty || 1) } : l))
            .filter((l) => l.qty > 0),
        )
      },
      removeLine(key) {
        setLines((prev) => prev.filter((l) => l.key !== key))
      },
      clear() {
        setLines([])
      },
    }
  }, [lines, drawerOpen, toast])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
