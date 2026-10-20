// ─────────────────────────────────────────────────────────────
// Gourmet Gather — site settings
// Change these values to update the whole site in one place.
// ─────────────────────────────────────────────────────────────

export const RESTAURANT = {
  name: 'Gourmet Gather',
  tagline: 'Hearty Nigerian plates, buckets and office meals, made fresh in Lagos.',
  city: 'Lagos',
  // WhatsApp number in international format, digits only (no +, spaces or dashes)
  whatsapp: '2349034013321',
  whatsappDisplay: '+234 903 401 3321',
  email: '', // e.g. 'hello@gourmetgather.ng' — leave empty to hide
  instagram: '', // e.g. 'https://instagram.com/gourmetgather' — leave empty to hide
  pickupAddress: 'Pickup address to be confirmed',
}

// Opening hours, in Lagos time (Africa/Lagos).
// Day numbers: 0 = Sunday, 1 = Monday … 6 = Saturday. Hours use the 24-hour clock.
export const TIMEZONE = 'Africa/Lagos'

export const OPENING_HOURS = {
  0: { open: 13, close: 21 }, // Sunday 1pm – 9pm
  1: { open: 9, close: 21 }, // Monday 9am – 9pm
  2: { open: 9, close: 21 },
  3: { open: 9, close: 21 },
  4: { open: 9, close: 21 },
  5: { open: 9, close: 21 },
  6: { open: 9, close: 21 }, // Saturday 9am – 9pm
}

export const HOURS_SUMMARY = [
  { days: 'Monday – Saturday', time: '9am – 9pm' },
  { days: 'Sunday', time: '1pm – 9pm' },
]

// Currency formatting
export const formatNaira = (amount) =>
  '₦' + Math.round(amount).toLocaleString('en-NG')
