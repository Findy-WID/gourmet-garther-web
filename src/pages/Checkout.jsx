import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useStatus } from '../lib/useStatus'
import { DELIVERY, ETA, OPENING_HOURS, PROMO, RESTAURANT, TIMEZONE, formatNaira } from '../config'
import { formatHour, nigeriaNow } from '../lib/hours'
import {
  ORDER_TYPES,
  WEEKDAYS,
  buildWhatsAppMessage,
  lineDetail,
  makeReference,
  scheduleText,
  whatsappLink,
} from '../lib/order'
import { checkPromo, discountFor, hasOrderedBefore, markOrdered, promoScope } from '../lib/promo'
import { daysLabel } from '../data/menu'

const DETAILS_KEY = 'gg-checkout-details'

const EMPTY = {
  orderType: 'once',
  timing: 'asap',
  date: '',
  time: '',
  weekday: 'Monday',
  fulfilment: 'delivery',
  address: '',
  area: '',
  landmark: '',
  name: '',
  phone: '',
  email: '',
  company: '',
  notes: '',
}

function todayInNigeria() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(new Date())
}

function dayOfWeek(iso) {
  return new Date(iso + 'T12:00:00').getDay()
}

// Half-hour slots inside opening hours for a given weekday (0 = Sunday)
function slotsFor(day) {
  const h = OPENING_HOURS[day]
  if (!h) return []
  const out = []
  for (let m = h.open * 60; m <= h.close * 60 - 60; m += 30) {
    const hh = Math.floor(m / 60)
    const mm = m % 60
    const value = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
    out.push({ value, label: `${formatHour(hh).replace(/(am|pm)/, mm ? `:${mm}$1` : '$1')}` })
  }
  return out
}

function loadDetails() {
  try {
    const raw = sessionStorage.getItem(DETAILS_KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

export default function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const status = useStatus()
  const [d, setD] = useState(loadDetails)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('details') // details → review → sent
  const [sent, setSent] = useState(null)
  const [promoInput, setPromoInput] = useState(d.promoCode || '')
  const [promoFeedback, setPromoFeedback] = useState(null)
  const promo = useMemo(() => checkPromo(d.promoCode), [d.promoCode])
  const discount = discountFor(lines, promo)
  const promoNoEffect = promo.valid && discount === 0
  const total = subtotal - discount

  function applyPromo(e) {
    e.preventDefault()
    const result = checkPromo(promoInput)
    setPromoFeedback(result)
    setD((s) => ({ ...s, promoCode: result.valid ? result.code : '' }))
  }

  function removePromo() {
    setD((s) => ({ ...s, promoCode: '' }))
    setPromoInput('')
    setPromoFeedback(null)
  }

  const hasCorporate = lines.some((l) => l.section === 'corporate')
  const etaMinutes = lines.some((l) => l.section !== 'plates') ? ETA.buckets : ETA.plates
  const etaText = etaMinutes % 60 === 0 ? `${etaMinutes / 60} hour${etaMinutes > 60 ? 's' : ''}` : `${etaMinutes / 60} hours`
  const today = todayInNigeria()
  const timing = status.isOpen ? d.timing : 'later'

  useEffect(() => {
    try {
      sessionStorage.setItem(DETAILS_KEY, JSON.stringify(d))
    } catch {
      /* ignore */
    }
  }, [d])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const slotDay = useMemo(() => {
    if (d.orderType === 'weekly') return (WEEKDAYS.indexOf(d.weekday) + 1) % 7
    return d.date ? dayOfWeek(d.date) : null
  }, [d.orderType, d.weekday, d.date])
  const slots = useMemo(() => {
    if (slotDay === null) return []
    const all = slotsFor(slotDay)
    if (d.date !== today) return all
    // For today, only offer times at least an hour from now
    const { hour, minute } = nigeriaNow()
    const cutoff = hour * 60 + minute + 60
    return all.filter((s) => {
      const [h, m] = s.value.split(':').map(Number)
      return h * 60 + m >= cutoff
    })
  }, [slotDay, d.date, today])

  const set = (field) => (e) => {
    const value = e?.target ? e.target.value : e
    setD((s) => ({ ...s, [field]: value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const needsDate = d.orderType !== 'once' || timing === 'later'

  function validate() {
    const er = {}
    if (!d.name.trim()) er.name = 'Enter your name.'
    if (d.phone.replace(/\D/g, '').length < 10) er.phone = 'Enter a phone number we can reach on WhatsApp.'
    if (d.fulfilment === 'delivery' && !d.address.trim()) er.address = 'Enter the delivery address.'
    if (needsDate && !d.date) er.date = d.orderType === 'once' ? 'Pick a date.' : 'Pick a start date.'
    if (needsDate && d.date && d.date < today) er.date = 'Pick today or a later date.'
    if (d.orderType === 'weekly' && d.date && dayOfWeek(d.date) !== (WEEKDAYS.indexOf(d.weekday) + 1) % 7)
      er.date = `The start date should be a ${d.weekday}.`
    if (needsDate && !d.time) er.time = 'Pick a time.'
    // Dishes only cooked on certain days (e.g. Mushroom Soup on Fridays)
    const orderDay =
      d.orderType === 'weekly'
        ? (WEEKDAYS.indexOf(d.weekday) + 1) % 7
        : timing === 'asap' && d.orderType === 'once'
          ? nigeriaNow().day
          : d.date
            ? dayOfWeek(d.date)
            : null
    if (orderDay !== null) {
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][orderDay]
      const clash = lines.find((l) => l.days?.length && !l.days.includes(dayName))
      if (clash) {
        const msg = `${clash.name} is only cooked on ${daysLabel(clash.days).replace(/ only$/, '')}. Pick one of those days, or remove it from your order.`
        if (timing === 'asap' && d.orderType === 'once') er.timing = msg
        else er.date = msg
      }
    }
    setErrors(er)
    return Object.keys(er).length === 0
  }

  function goToReview(e) {
    e.preventDefault()
    if (validate()) setStep('review')
    else setTimeout(() => document.querySelector('.field--error input, .field--error select')?.focus(), 0)
  }

  const finalDetails = { ...d, timing }

  function send() {
    const reference = makeReference()
    const message = buildWhatsAppMessage({
      details: finalDetails,
      lines,
      subtotal,
      reference,
      isPreorder: !status.isOpen,
      promo,
      discount,
      repeatDevice: hasOrderedBefore(),
    })
    const link = whatsappLink(message)
    window.open(link, '_blank', 'noopener')
    setSent({ reference, link, total })
    setStep('sent')
    markOrdered()
    setD((s) => ({ ...s, promoCode: '' }))
    clear()
  }

  if (step === 'sent' && sent) {
    return (
      <div className="page">
        <div className="container narrow sent">
          <div className="sent__badge" aria-hidden="true">✓</div>
          <h1>Your order is ready to send</h1>
          <p>
            WhatsApp should have opened with your order filled in. <strong>Press send in WhatsApp</strong> so it
            reaches us. We’ll confirm your order and share payment details there.
          </p>
          <p className="sent__ref">
            Order reference <strong>{sent.reference}</strong>
          </p>
          <a href={sent.link} target="_blank" rel="noreferrer" className="btn btn--whatsapp btn--lg btn--block">
            Open WhatsApp again
          </a>
          <Link to="/" className="btn btn--ghost btn--block">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="page">
        <div className="container narrow empty empty--page">
          <h1>Your order is empty</h1>
          <p>Add a plate, a bucket or a workplace pack, then come back to check out.</p>
          <Link to="/menu" className="btn btn--primary">
            Browse the menu
          </Link>
        </div>
      </div>
    )
  }

  const Summary = (
    <aside className="summary">
      <h2>Your order</h2>
      <ul>
        {lines.map((l) => (
          <li key={l.key}>
            <div className="summary__row">
              <span>
                {l.name} <span className="muted">x{l.qty}</span>
              </span>
              <span>{formatNaira(l.unitPrice * l.qty)}</span>
            </div>
            {lineDetail(l) && <p className="summary__detail">{lineDetail(l)}</p>}
          </li>
        ))}
      </ul>
      <div className="summary__row summary__sub">
        <span>Subtotal</span>
        <span>{formatNaira(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="summary__row summary__discount">
          <span>
            Discount ({promo.code}, {promo.percent}%{promoScope() ? `, ${promoScope()}` : ''})
          </span>
          <span>−{formatNaira(discount)}</span>
        </div>
      )}
      <div className="summary__row summary__total">
        <span>{discount > 0 ? 'Estimated total' : 'Total'}</span>
        <strong>{formatNaira(total)}</strong>
      </div>
      {step === 'details' && PROMO.enabled && (
        <div className="promo-box">
          {promo.valid ? (
            <div className="promo-box__applied">
              <span>
                Code <strong>{promo.code}</strong> applied
              </span>
              <button type="button" className="link-btn" onClick={removePromo}>
                Remove
              </button>
            </div>
          ) : (
            <form className="promo-box__form" onSubmit={applyPromo}>
              <label htmlFor="promo" className="visually-hidden">
                Promo code
              </label>
              <input
                id="promo"
                type="text"
                placeholder="Promo code"
                autoCapitalize="characters"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
              />
              <button type="submit" className="btn btn--ghost">
                Apply
              </button>
            </form>
          )}
          {promoNoEffect && (
            <p className="promo-box__msg is-error" role="status">
              {promo.code} works on {PROMO.appliesTo.join(' and ')} only. Add a plate to use it.
            </p>
          )}
          {promoFeedback?.message && !promoNoEffect && (
            <p className={`promo-box__msg ${promoFeedback.valid ? 'is-ok' : 'is-error'}`} role="status">
              {promoFeedback.message}
            </p>
          )}
        </div>
      )}
      <p className="summary__note">
        {d.fulfilment === 'delivery'
          ? DELIVERY.feeNote
          : 'No delivery fee for pickup.'}
      </p>
    </aside>
  )

  if (step === 'review') {
    const type = ORDER_TYPES.find((t) => t.id === d.orderType)
    return (
      <div className="page">
        <div className="container">
          <Steps current={2} />
          <div className="checkout">
            <div className="checkout__main">
              <h1 className="checkout__title">Check your order</h1>
              <p className="checkout__lede">
                When you press the button below, WhatsApp opens with all of this filled in. Send the message and
                we’ll confirm your order and payment there.
              </p>
              {!status.isOpen && (
                <p className="notice">This is a pre-order. We’ll reply on WhatsApp when we open {status.nextOpenLabel}.</p>
              )}

              <dl className="review">
                <div>
                  <dt>Order type</dt>
                  <dd>
                    {type.label}
                    <br />
                    <span className="muted">{scheduleText(finalDetails)}</span>
                  </dd>
                </div>
                <div>
                  <dt>{d.fulfilment === 'delivery' ? 'Delivery to' : 'Pickup'}</dt>
                  <dd>
                    {d.fulfilment === 'delivery' ? (
                      <>
                        {d.address}
                        {d.area && <>, {d.area}</>}
                        {d.landmark && (
                          <>
                            <br />
                            <span className="muted">Landmark: {d.landmark}</span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        You’ll pick it up from us at {RESTAURANT.address || 'our kitchen'}.
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Your details</dt>
                  <dd>
                    {d.name}
                    <br />
                    {d.phone}
                    {d.email && (
                      <>
                        <br />
                        {d.email}
                      </>
                    )}
                    {d.company && (
                      <>
                        <br />
                        {d.company}
                      </>
                    )}
                  </dd>
                </div>
                {d.notes && (
                  <div>
                    <dt>Notes</dt>
                    <dd>{d.notes}</dd>
                  </div>
                )}
              </dl>

              <div className="review-actions">
                <button className="btn btn--whatsapp btn--lg btn--block" onClick={send}>
                  <WhatsAppIcon /> Send order on WhatsApp
                </button>
                <button className="btn btn--ghost btn--block" onClick={() => setStep('details')}>
                  Edit details
                </button>
              </div>
              <p className="fine">
                Orders go to {RESTAURANT.name} on WhatsApp ({RESTAURANT.whatsappDisplay}). No payment is taken on
                this website.
              </p>
            </div>
            {Summary}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        <Steps current={1} />
        <div className="checkout">
          <form className="checkout__main" onSubmit={goToReview} noValidate>
            <h1 className="checkout__title">Checkout</h1>

            <section className="form-block">
              <h2>How often?</h2>
              <div className="seg seg--3" role="radiogroup" aria-label="Order type">
                {ORDER_TYPES.map((t) => (
                  <label key={t.id} className={`seg__opt ${d.orderType === t.id ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="orderType"
                      value={t.id}
                      checked={d.orderType === t.id}
                      onChange={set('orderType')}
                    />
                    <strong>{t.label}</strong>
                    <span>{t.hint}</span>
                  </label>
                ))}
              </div>

              {d.orderType === 'once' && status.isOpen && (
                <div className="seg seg--2" role="radiogroup" aria-label="When">
                  {[
                    { id: 'asap', label: 'As soon as possible', hint: `Usually ready within ${etaText}` },
                    { id: 'later', label: 'Schedule for later', hint: 'Pick a date and time' },
                  ].map((o) => (
                    <label key={o.id} className={`seg__opt ${d.timing === o.id ? 'is-checked' : ''}`}>
                      <input type="radio" name="timing" value={o.id} checked={d.timing === o.id} onChange={set('timing')} />
                      <strong>{o.label}</strong>
                      <span>{o.hint}</span>
                    </label>
                  ))}
                </div>
              )}

              {errors.timing && <p className="field__error field__error--block">{errors.timing}</p>}

              {d.orderType === 'once' && !status.isOpen && (
                <p className="notice">We’re closed now, so pick when you’d like your pre-order.</p>
              )}

              {needsDate && (
                <div className="field-row">
                  {d.orderType === 'weekly' && (
                    <Field label="Delivery day" error={errors.weekday}>
                      <select value={d.weekday} onChange={set('weekday')}>
                        {WEEKDAYS.map((w) => (
                          <option key={w}>{w}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                  <Field label={d.orderType === 'once' ? 'Date' : 'Start date'} error={errors.date}>
                    <input type="date" min={today} value={d.date} onChange={set('date')} />
                  </Field>
                  <Field label="Time" error={errors.time}>
                    <select value={d.time} onChange={set('time')} disabled={!slots.length}>
                      <option value="">{slots.length ? 'Choose a time' : 'Pick a date first'}</option>
                      {slots.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}
              {d.orderType !== 'once' && (
                <p className="hint">
                  You’ll pay for each delivery as it comes. We’ll confirm the schedule on WhatsApp, and you can pause or cancel
                  any time by messaging us.
                </p>
              )}
            </section>

            <section className="form-block">
              <h2>Delivery or pickup?</h2>
              <div className="seg seg--2" role="radiogroup" aria-label="Delivery or pickup">
                {[
                  { id: 'delivery', label: 'Deliver to me', hint: 'Fee depends on distance' },
                  { id: 'pickup', label: 'I’ll pick it up', hint: `From our kitchen in ${RESTAURANT.city}` },
                ].map((o) => (
                  <label key={o.id} className={`seg__opt ${d.fulfilment === o.id ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="fulfilment"
                      value={o.id}
                      checked={d.fulfilment === o.id}
                      onChange={set('fulfilment')}
                    />
                    <strong>{o.label}</strong>
                    <span>{o.hint}</span>
                  </label>
                ))}
              </div>

              {d.fulfilment === 'delivery' && (
                <>
                  <Field label="Delivery address" error={errors.address}>
                    <input
                      type="text"
                      autoComplete="street-address"
                      placeholder="House number, street"
                      value={d.address}
                      onChange={set('address')}
                    />
                  </Field>
                  <div className="field-row">
                    <Field label="Area" optional>
                      <input type="text" placeholder="e.g. Ewet Housing" value={d.area} onChange={set('area')} />
                    </Field>
                    <Field label="Nearest landmark" optional>
                      <input type="text" placeholder="e.g. near Ibom Plaza" value={d.landmark} onChange={set('landmark')} />
                    </Field>
                  </div>
                </>
              )}
            </section>

            <section className="form-block">
              <h2>Your details</h2>
              <div className="field-row">
                <Field label="Full name" error={errors.name}>
                  <input type="text" autoComplete="name" value={d.name} onChange={set('name')} />
                </Field>
                <Field label="WhatsApp phone number" error={errors.phone}>
                  <input type="tel" autoComplete="tel" placeholder="080..." value={d.phone} onChange={set('phone')} />
                </Field>
              </div>
              <div className="field-row">
                <Field label="Email" optional>
                  <input type="email" autoComplete="email" value={d.email} onChange={set('email')} />
                </Field>
                {hasCorporate && (
                  <Field label="Company or organisation" optional>
                    <input type="text" autoComplete="organization" value={d.company} onChange={set('company')} />
                  </Field>
                )}
              </div>
              <Field label="Notes for the kitchen or rider" optional>
                <textarea
                  rows="3"
                  placeholder="Allergies, spice level, gate code…"
                  value={d.notes}
                  onChange={set('notes')}
                />
              </Field>
            </section>

            <button type="submit" className="btn btn--primary btn--lg btn--block">
              Review order
            </button>
          </form>
          {Summary}
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, optional, children }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">
        {label} {optional && <span className="optional">optional</span>}
      </span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  )
}

function Steps({ current }) {
  const items = ['Your details', 'Check & send']
  return (
    <ol className="checkout-steps" aria-label="Checkout progress">
      {items.map((s, i) => (
        <li key={s} className={i + 1 === current ? 'is-current' : i + 1 < current ? 'is-done' : ''}>
          <span>{i + 1}</span> {s}
        </li>
      ))}
    </ol>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"
      />
    </svg>
  )
}
