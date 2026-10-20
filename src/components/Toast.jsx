import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast, openDrawer } = useCart()
  if (!toast) return null
  return (
    <div className="toast" role="status">
      <span>{toast}</span>
      <button className="toast__btn" onClick={openDrawer}>
        View order
      </button>
    </div>
  )
}
