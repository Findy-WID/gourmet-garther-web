import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { DELIVERY, formatNaira } from '../config'
import { lineDetail } from '../lib/order'
import QtyStepper from './QtyStepper'

export default function CartDrawer() {
  const { lines, subtotal, drawerOpen, closeDrawer, setQty, removeLine } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && closeDrawer()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen, closeDrawer])

  return (
    <div className={`drawer-root ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
      <div className="drawer-backdrop" onClick={closeDrawer} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your order">
        <div className="drawer__head">
          <h2>Your order</h2>
          <button className="icon-btn" onClick={closeDrawer} aria-label="Close your order">
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Nothing here yet. Pick a plate or a bucket to get started.</p>
            <button
              className="btn btn--primary"
              onClick={() => {
                closeDrawer()
                navigate('/menu')
              }}
            >
              Browse the menu
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__lines">
              {lines.map((l) => (
                <li key={l.key} className="cart-line">
                  <div className="cart-line__top">
                    <strong>{l.name}</strong>
                    <span>{formatNaira(l.unitPrice * l.qty)}</span>
                  </div>
                  {lineDetail(l) && <p className="cart-line__detail">{lineDetail(l)}</p>}
                  <div className="cart-line__controls">
                    <QtyStepper
                      value={l.qty}
                      min={l.minQty || 1}
                      onChange={(q) => setQty(l.key, q)}
                      label={`Quantity of ${l.name}`}
                    />
                    <button className="link-btn" onClick={() => removeLine(l.key)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="drawer__foot">
              <div className="drawer__total">
                <span>Subtotal</span>
                <strong>{formatNaira(subtotal)}</strong>
              </div>
              <p className="drawer__note">{DELIVERY.feeNote}</p>
              <button
                className="btn btn--primary btn--block"
                onClick={() => {
                  closeDrawer()
                  navigate('/checkout')
                }}
              >
                Continue to checkout
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
