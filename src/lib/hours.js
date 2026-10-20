import { OPENING_HOURS, TIMEZONE } from '../config'
import { formatHour } from './format'

export { formatHour }

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Current day/hour/minute in Lagos, whatever the visitor's own timezone is.
export function lagosNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (t) => parts.find((p) => p.type === t)?.value
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    day: weekdayMap[get('weekday')],
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  }
}

// Returns { isOpen, closesAt, nextOpenLabel }
export function getStatus(date = new Date()) {
  const { day, hour, minute } = lagosNow(date)
  const mins = hour * 60 + minute
  const today = OPENING_HOURS[day]

  if (today && mins >= today.open * 60 && mins < today.close * 60) {
    return { isOpen: true, closesAt: formatHour(today.close) }
  }

  // Closed: still opening later today?
  if (today && mins < today.open * 60) {
    return { isOpen: false, nextOpenLabel: `today at ${formatHour(today.open)}` }
  }

  // Otherwise look ahead to the next day with hours
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7
    const h = OPENING_HOURS[d]
    if (h) {
      const when = i === 1 ? 'tomorrow' : DAY_NAMES[d]
      return { isOpen: false, nextOpenLabel: `${when} at ${formatHour(h.open)}` }
    }
  }
  return { isOpen: false, nextOpenLabel: 'soon' }
}
