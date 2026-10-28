import { PROMO } from '../config'

// We can't know who someone is without a database, so the website only remembers
// whether THIS device has sent an order before. The cashier confirms the first order
// on WhatsApp using the customer's phone number.
const ORDERED_KEY = 'gg-has-ordered'

export function hasOrderedBefore() {
  try {
    return localStorage.getItem(ORDERED_KEY) === '1'
  } catch {
    return false
  }
}

export function markOrdered() {
  try {
    localStorage.setItem(ORDERED_KEY, '1')
  } catch {
    /* ignore */
  }
}

// Returns { valid, code, percent, message }
export function checkPromo(input) {
  const code = String(input || '').trim().toUpperCase()
  if (!code) return { valid: false, code: '', message: '' }
  if (!PROMO.enabled || code !== PROMO.code) {
    return { valid: false, code, message: 'That code isn’t valid. Check the spelling and try again.' }
  }
  return {
    valid: true,
    code,
    percent: PROMO.percent,
    message: hasOrderedBefore()
      ? `Applied. This code is for first orders only, so we’ll confirm it on WhatsApp.`
      : `${PROMO.percent}% off applied. It’s for first orders and we’ll confirm it on WhatsApp.`,
  }
}

export const discountFor = (subtotal, promo) => (promo?.valid ? Math.round((subtotal * promo.percent) / 100) : 0)
