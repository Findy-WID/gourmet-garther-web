// ─────────────────────────────────────────────────────────────
// Gourmet Gather — site settings
//
// WhatsApp number, opening hours, tagline and contact details are edited in
// the admin panel (/admin → Restaurant settings), which saves them to
// content/settings.json. Only the restaurant name lives here.
// ─────────────────────────────────────────────────────────────
import settings from '../content/settings.json'
import { formatHour } from './lib/format'

export const RESTAURANT = {
  name: 'Gourmet Gather',
  tagline: settings.tagline,
  city: settings.city || 'Lagos',
  whatsapp: String(settings.whatsapp).replace(/\D/g, ''),
  whatsappDisplay: settings.whatsappDisplay || settings.whatsapp,
  email: settings.email || '',
  instagram: settings.instagram || '',
  pickupAddress: settings.pickupAddress || '',
}

export const TIMEZONE = 'Africa/Lagos'

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// { 0: {open, close}, 1: …} — day numbers: 0 = Sunday … 6 = Saturday. Closed days are left out.
export const OPENING_HOURS = Object.fromEntries(
  DAY_KEYS.map((key, i) => {
    const h = settings.hours?.[key]
    return h && !h.closed && Number(h.close) > Number(h.open) ? [i, { open: Number(h.open), close: Number(h.close) }] : null
  }).filter(Boolean),
)

// Human summary, grouping neighbouring days with the same hours (Monday first).
export const HOURS_SUMMARY = (() => {
  const order = [1, 2, 3, 4, 5, 6, 0]
  const text = (d) => (OPENING_HOURS[d] ? `${formatHour(OPENING_HOURS[d].open)} – ${formatHour(OPENING_HOURS[d].close)}` : 'Closed')
  const rows = []
  order.forEach((d) => {
    const last = rows[rows.length - 1]
    if (last && last.time === text(d)) last.end = d
    else rows.push({ start: d, end: d, time: text(d) })
  })
  return rows.map((r) => ({
    days: r.start === r.end ? DAY_LABELS[r.start] : `${DAY_LABELS[r.start]} – ${DAY_LABELS[r.end]}`,
    time: r.time,
  }))
})()

export const formatNaira = (amount) => '₦' + Math.round(amount).toLocaleString('en-NG')
