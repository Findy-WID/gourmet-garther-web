import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SECTIONS, getItem } from '../data/menu'
import { formatNaira } from '../config'
import { useCart } from '../context/CartContext'
import { useStatus } from '../lib/useStatus'
import FoodImage from '../components/FoodImage'
import QtyStepper from '../components/QtyStepper'
import NotFound from './NotFound'

export default function Product() {
  const { id } = useParams()
  const item = getItem(id)
  if (!item) return <NotFound />
  return <ProductView key={item.id} item={item} />
}

function ProductView({ item }) {
  const { addLine, openDrawer } = useCart()
  const status = useStatus()
  const minQty = item.minQty || 1
  const section = SECTIONS.find((s) => s.id === item.section)
  const backTo = item.section === 'corporate' ? '/workplace' : `/menu?tab=${item.section}`

  const [choices, setChoices] = useState(() =>
    Object.fromEntries((item.choices || []).map((c) => [c.id, c.options[0].id])),
  )
  const [extras, setExtras] = useState({})
  const [qty, setQty] = useState(minQty)
  const [added, setAdded] = useState(false)

  const extrasTotalCount = Object.values(extras).reduce((a, b) => a + b, 0)
  const extrasMax = item.extrasMax ?? 99

  const unitPrice = useMemo(() => {
    let p = item.price
    ;(item.choices || []).forEach((c) => {
      p += c.options.find((o) => o.id === choices[c.id])?.price || 0
    })
    ;(item.extras || []).forEach((e) => {
      p += (extras[e.id] || 0) * e.price
    })
    return p
  }, [item, choices, extras])

  function add() {
    const chosen = (item.choices || []).map((c) => {
      const o = c.options.find((o) => o.id === choices[c.id])
      return { group: c.label, label: o.label }
    })
    const ex = (item.extras || [])
      .filter((e) => extras[e.id])
      .map((e) => ({ label: e.label, qty: extras[e.id], price: e.price }))
    const key = [item.id, ...Object.values(choices), ...ex.map((e) => `${e.label}:${e.qty}`)].join('|')
    addLine({
      key,
      itemId: item.id,
      name: item.name,
      section: item.section,
      unitPrice,
      qty,
      minQty,
      choices: chosen,
      extras: ex,
    })
    setAdded(true)
  }

  return (
    <div className="page">
      <div className="container">
        <Link to={backTo} className="back-link">
          ← Back to {section.name.toLowerCase()}
        </Link>

        <div className="product">
          <div className="product__media">
            <FoodImage item={item} className="product__img" />
          </div>

          <div className="product__main">
            <p className="product__section">{section.name}</p>
            <h1 className="product__name">{item.name}</h1>
            <p className="product__unit">{item.unit}</p>
            <p className="product__desc">{item.description}</p>
            <p className="product__price">{formatNaira(item.price)}</p>
            {!status.isOpen && (
              <p className="notice">
                We’re closed now, so this will be a pre-order. We’ll confirm it on WhatsApp when we open{' '}
                {status.nextOpenLabel}.
              </p>
            )}

            {(item.choices || []).map((c) => (
              <fieldset key={c.id} className="option-group">
                <legend>{c.label}</legend>
                <div className="radio-list">
                  {c.options.map((o) => (
                    <label key={o.id} className={`radio-card ${choices[c.id] === o.id ? 'is-checked' : ''}`}>
                      <input
                        type="radio"
                        name={c.id}
                        value={o.id}
                        checked={choices[c.id] === o.id}
                        onChange={() => setChoices((s) => ({ ...s, [c.id]: o.id }))}
                      />
                      <span className="radio-card__label">{o.label}</span>
                      {o.price !== 0 && (
                        <span className="radio-card__price">
                          {o.price > 0 ? '+' : '−'}
                          {formatNaira(Math.abs(o.price))}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {item.extras?.length > 0 && (
              <fieldset className="option-group">
                <legend>
                  Add extras <span className="optional">optional</span>
                </legend>
                {item.extrasMax && (
                  <p className="option-hint">
                    Up to {item.extrasMax} pieces in total · {extrasTotalCount} added
                  </p>
                )}
                <ul className="extra-list">
                  {item.extras.map((e) => (
                    <li key={e.id} className="extra-row">
                      <div>
                        <span className="extra-row__label">{e.label}</span>
                        <span className="extra-row__price">
                          {formatNaira(e.price)}
                          {e.note ? ` ${e.note}` : ''}
                        </span>
                      </div>
                      <QtyStepper
                        small
                        value={extras[e.id] || 0}
                        min={0}
                        max={(extras[e.id] || 0) + Math.max(extrasMax - extrasTotalCount, 0)}
                        onChange={(v) => setExtras((s) => ({ ...s, [e.id]: v }))}
                        label={`Quantity of ${e.label}`}
                      />
                    </li>
                  ))}
                </ul>
              </fieldset>
            )}

            <div className="order-box">
              <div className="order-box__row">
                <span>
                  Quantity
                  {minQty > 1 && <small className="min-note">Minimum {minQty}</small>}
                </span>
                <QtyStepper value={qty} min={minQty} onChange={setQty} label="Quantity" />
              </div>
              <div className="order-box__row order-box__total">
                <span>Total</span>
                <strong>{formatNaira(unitPrice * qty)}</strong>
              </div>
              <button className="btn btn--primary btn--block btn--lg" onClick={add}>
                {status.isOpen ? 'Add to order' : 'Add to pre-order'} · {formatNaira(unitPrice * qty)}
              </button>
              {added && (
                <div className="added-row">
                  <span>Added.</span>
                  <button className="link-btn" onClick={openDrawer}>
                    View your order
                  </button>
                  <Link to={backTo} className="link-btn">
                    Keep browsing
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
