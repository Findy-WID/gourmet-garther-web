import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PROMO } from '../config'
import { hasOrderedBefore } from '../lib/promo'

const DISMISS_KEY = 'gg-promo-dismissed'

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

// First-order banner. Hidden once this device has sent an order, or after the visitor closes it.
export default function PromoBar() {
  const [hidden, setHidden] = useState(() => !PROMO.enabled || hasOrderedBefore() || wasDismissed())
  if (hidden) return null

  function dismiss() {
    setHidden(true)
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="promo-bar" role="region" aria-label="First order offer">
      <div className="container promo-bar__inner">
        <p>
          {PROMO.banner} <span className="promo-code">{PROMO.code}</span>
        </p>
        <Link to="/menu" className="promo-bar__cta">
          Browse the menu
        </Link>
        <button className="promo-bar__close" onClick={dismiss} aria-label="Hide this offer">
          ✕
        </button>
      </div>
    </div>
  )
}
