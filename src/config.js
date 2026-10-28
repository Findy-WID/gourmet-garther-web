// ─────────────────────────────────────────────────────────────
// Gourmet Gather — site settings
//
// Address, WhatsApp, email, socials, promo code, opening hours and tagline
// live in content/settings.json. Only the restaurant name lives here.
// ─────────────────────────────────────────────────────────────
import settings from '../content/settings.json'
import { formatHour } from './lib/format'

export const RESTAURANT = {
  name: 'Gourmet Gather',
  tagline: settings.tagline || 'Where Taste Meets Tradition',
  intro: settings.intro || '',
  city: settings.city || 'Uyo',
  address: settings.address || '',
  whatsapp: String(settings.whatsapp).replace(/\D/g, ''),
  whatsappDisplay: settings.whatsappDisplay || settings.whatsapp,
  email: settings.email || '',
  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@gourmetgather', url: settings.socials?.instagram },
    { id: 'tiktok', label: 'TikTok', handle: '@gourmetgather', url: settings.socials?.tiktok },
    { id: 'facebook', label: 'Facebook', handle: 'Gourmet Gather', url: settings.socials?.facebook },
  ].filter((s) => s.url),
}

// Usual preparation + delivery time, in minutes (shown at checkout)
export const ETA = {
  plates: Number(settings.eta?.platesMinutes) || 60,
  buckets: Number(settings.eta?.bucketsMinutes) || 90,
}

// First-order discount. The code is checked on the website and confirmed by the cashier on WhatsApp.
export const PROMO = {
  enabled: !!settings.promo?.enabled && !!settings.promo?.code,
  code: String(settings.promo?.code || '').toUpperCase(),
  percent: Number(settings.promo?.percent) || 0,
  banner: settings.promo?.banner || 'First time here? Get a discount on your first order with code',
}

// Nigeria is one timezone (WAT). Its official name in software is "Africa/Lagos", but it covers Uyo too.
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
