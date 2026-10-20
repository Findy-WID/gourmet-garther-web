import { RESTAURANT, formatNaira } from '../config'

export const ORDER_TYPES = [
  { id: 'once', label: 'One-time order', hint: 'A single order for one day.' },
  { id: 'weekly', label: 'Weekly', hint: 'The same order delivered every week.' },
  { id: 'monthly', label: 'Monthly', hint: 'The same order delivered once a month.' },
]

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function makeReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `GG-${s}`
}

function prettyDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function prettyTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}:${String(m).padStart(2, '0')}${suffix}`
}

export function scheduleText(d) {
  if (d.orderType === 'weekly') {
    return `Every ${d.weekday}, starting ${prettyDate(d.date)}${d.time ? `, around ${prettyTime(d.time)}` : ''}`
  }
  if (d.orderType === 'monthly') {
    return `Monthly, starting ${prettyDate(d.date)}${d.time ? `, around ${prettyTime(d.time)}` : ''}`
  }
  if (d.timing === 'asap') return 'As soon as possible (today)'
  return `${prettyDate(d.date)}${d.time ? `, ${prettyTime(d.time)}` : ''}`
}

export function lineDetail(line) {
  const parts = line.choices.map((c) => c.label)
  line.extras.forEach((e) => parts.push(`${e.label} x${e.qty}`))
  return parts.join(', ')
}

// Builds the WhatsApp message the cashier receives.
export function buildWhatsAppMessage({ details, lines, subtotal, reference, isPreorder }) {
  const type = ORDER_TYPES.find((t) => t.id === details.orderType)?.label
  const out = []
  out.push(`*New order — ${RESTAURANT.name}*`)
  out.push(`Ref: ${reference}${isPreorder ? ' (pre-order, placed while closed)' : ''}`)
  out.push('')
  out.push('*Items*')
  lines.forEach((l, i) => {
    out.push(`${i + 1}. ${l.name} x${l.qty} — ${formatNaira(l.unitPrice * l.qty)}`)
    const detail = lineDetail(l)
    if (detail) out.push(`   ${detail}`)
  })
  out.push('')
  out.push(`*Subtotal: ${formatNaira(subtotal)}*`)
  if (details.fulfilment === 'delivery') out.push('Delivery fee: to be confirmed')
  out.push('')
  out.push('*Order type*')
  out.push(type)
  out.push(scheduleText(details))
  out.push('')
  if (details.fulfilment === 'delivery') {
    out.push('*Delivery*')
    out.push(details.address)
    if (details.area) out.push(`Area: ${details.area}`)
    if (details.landmark) out.push(`Landmark: ${details.landmark}`)
  } else {
    out.push('*Pickup*')
    out.push('Customer will pick up')
  }
  out.push('')
  out.push('*Customer*')
  out.push(details.name)
  out.push(details.phone)
  if (details.email) out.push(details.email)
  if (details.company) out.push(`Company: ${details.company}`)
  if (details.notes) {
    out.push('')
    out.push('*Notes*')
    out.push(details.notes)
  }
  out.push('')
  out.push('Please confirm my order and send payment details.')
  return out.join('\n')
}

export function whatsappLink(message) {
  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`
}
