import { useMemo, useState } from 'react'
import { itemsIn, groupsIn } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useStatus } from '../lib/useStatus'
import { RESTAURANT, formatNaira } from '../config'
import QtyStepper from '../components/QtyStepper'
import page from '../../content/workplace.json'
import optionGroups from '../../content/option-groups.json'

// Workplace page: a one-page corporate menu (Jeun-style). Every dish is ordered right here —
// no separate dish pages and no dish photos. Dishes come from content/dishes (section "corporate"),
// the words on this page from content/workplace.json. Both are edited in the admin.

const ICONS = {
  convenience: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  packaging: (
    <>
      <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z" />
      <path d="M3 8.5 12 13l9-4.5M12 13v7" />
    </>
  ),
  variety: (
    <>
      <path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5" />
      <path d="M17 21V3c-2 1.5-3 4-3 7s1 4 3 4" />
    </>
  ),
  quality: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </>
  ),
}

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name] || ICONS.quality}
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

const PDF_NAME = 'Gourmet-Gather-Workplace-Menu.pdf'

function DownloadButton({ className = 'btn btn--primary btn--lg', children = 'Download Menu' }) {
  return (
    <a className={className} href={page.pdf} download={PDF_NAME}>
      <DownloadIcon /> {children}
    </a>
  )
}

// "Mighty Jollof – The Uyo Classic" → ["Mighty Jollof", "The Uyo Classic"]
const splitName = (name) => {
  const m = name.split(/\s+[–-]\s+/)
  return m.length > 1 ? [m[0], m.slice(1).join(' – ')] : [name, '']
}

function MenuRow({ item }) {
  const { addLine } = useCart()
  const { isOpen } = useStatus()
  const [open, setOpen] = useState(false)
  const [qty, setQty] = useState(item.minQty)
  const [picks, setPicks] = useState(() => Object.fromEntries(item.choices.map((c) => [c.id, c.options[0]?.id])))
  const [title, tagline] = splitName(item.name)

  const unitPrice =
    item.price + item.choices.reduce((s, c) => s + (c.options.find((o) => o.id === picks[c.id])?.price || 0), 0)

  function add() {
    const chosen = item.choices.map((c) => ({ group: c.label, label: c.options.find((o) => o.id === picks[c.id]).label }))
    addLine({
      key: [item.id, ...item.choices.map((c) => picks[c.id])].join('|'),
      itemId: item.id,
      name: item.name,
      unit: item.unit,
      section: item.section,
      unitPrice,
      qty,
      minQty: item.minQty,
      days: item.days,
      choices: chosen,
      extras: [],
    })
    setOpen(false)
    setQty(item.minQty)
  }

  const cta = !item.available ? 'Sold out' : isOpen ? 'Add' : 'Pre-order'

  return (
    <li className={`wm-row ${open ? 'is-open' : ''} ${item.available ? '' : 'is-soldout'}`}>
      <div className="wm-row__main">
        <div className="wm-row__text">
          <h4 className="wm-row__name">
            {title}
            {tagline && <span className="wm-row__tag"> – {tagline}</span>}
          </h4>
          {item.description && <p className="wm-row__desc">{item.description}</p>}
        </div>
        <div className="wm-row__side">
          <span className="wm-row__price">{item.pricePending ? 'Price soon' : formatNaira(item.price)}</span>
          {!item.pricePending && (
            <button
              type="button"
              className={`btn btn--sm ${open ? 'btn--ghost' : 'btn--primary'}`}
              disabled={!item.available}
              aria-expanded={item.choices.length ? open : undefined}
              onClick={() => (item.choices.length ? setOpen((v) => !v) : add())}
            >
              {open ? 'Close' : cta}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="wm-row__picker">
          {item.choices.map((c) => (
            <label key={c.id} className="wm-pick">
              <span>{c.label}</span>
              <select value={picks[c.id]} onChange={(e) => setPicks((p) => ({ ...p, [c.id]: e.target.value }))}>
                {c.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                    {o.price ? ` (+${formatNaira(o.price)})` : ''}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <div className="wm-pick wm-pick--qty">
            <span>How many?</span>
            <QtyStepper value={qty} min={item.minQty} onChange={setQty} label={`How many ${title}`} small />
          </div>
          <button type="button" className="btn btn--primary wm-pick__add" onClick={add}>
            Add to order · {formatNaira(unitPrice * qty)}
          </button>
        </div>
      )}
    </li>
  )
}

const listOf = (id) =>
  (optionGroups.choices || [])
    .find((c) => c.id === id)
    ?.options.map((o) => o.label)
    .join(', ')

export default function Workplace() {
  const items = itemsIn('corporate')
  const groups = groupsIn('corporate')
  const proteins = listOf('work-protein')
  const drinks = listOf('work-drink')
  const wa = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(
    `Hello ${RESTAURANT.name}, I'd like to set up meals for my team.`,
  )}`

  const headline = useMemo(() => {
    const h = page.headline || ''
    const hl = page.highlight
    if (!hl || !h.includes(hl)) return h
    const [a, b] = h.split(hl)
    return (
      <>
        {a}
        <span className="wk-hero__hl">{hl}</span>
        {b}
      </>
    )
  }, [])

  return (
    <div className="wk">
      <section className="wk-hero">
        <div className="container wk-hero__inner">
          {page.kicker && <p className="wk-hero__kicker">{page.kicker}</p>}
          <h1 className="wk-hero__title">{headline}</h1>
          {page.subline && <p className="wk-hero__sub">{page.subline}</p>}
          <div className="wk-hero__actions">
            <DownloadButton />
            <a href="#wk-menu" className="btn btn--ghost btn--lg">
              Order online
            </a>
          </div>

          <ul className="wk-points">
            {(page.points || []).map((p) => (
              <li key={p.title}>
                <span className="wk-points__icon">
                  <Icon name={p.icon} />
                </span>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container">
        {page.photos?.length > 0 && (
          <div className="wk-photos">
            {page.photos.slice(0, 3).map((p) => (
              <img key={p.src} src={p.src} alt={p.alt || ''} loading="lazy" />
            ))}
          </div>
        )}

        {(page.intro || page.hashtag) && (
          <div className="wk-intro">
            {page.intro && <p>{page.intro}</p>}
            {page.hashtag && <p className="wk-intro__tag">{page.hashtag}</p>}
          </div>
        )}

        <section className="wk-menu" id="wk-menu" aria-labelledby="wk-menu-title">
          <h2 id="wk-menu-title">Your Menu</h2>
          {page.menuNote && <p className="wk-menu__note">{page.menuNote}</p>}

          {groups.map((g) => (
            <div key={g} className="wm-card">
              <h3 className="wm-card__title">{g}</h3>
              <ul className="wm-list">
                {items
                  .filter((m) => m.group === g)
                  .map((item) => (
                    <MenuRow key={item.id} item={item} />
                  ))}
              </ul>
            </div>
          ))}

          <div className="wm-options">
            {proteins && (
              <p>
                <span>Protein options:</span> <strong>{proteins}</strong>
              </p>
            )}
            {drinks && (
              <p>
                <span>Drink options:</span> <strong>{drinks}</strong>
              </p>
            )}
          </div>

          {page.orderingNote && (
            <div className="wk-ordering">
              {page.orderingTitle && <h3>{page.orderingTitle}</h3>}
              <p>{page.orderingNote}</p>
            </div>
          )}

          <div className="wk-center">
            <DownloadButton className="btn btn--ghost">Download Full Menu (PDF)</DownloadButton>
          </div>
        </section>

        <section className="wk-how" aria-labelledby="wk-how-title">
          <h2 id="wk-how-title">How it works</h2>
          <ol>
            <li>
              <span>1</span>
              <strong>Choose</strong>
              <p>Pick meals for the team, here or from the PDF</p>
            </li>
            <li>
              <span>2</span>
              <strong>We cook</strong>
              <p>Freshly prepared in our Uyo kitchen</p>
            </li>
            <li>
              <span>3</span>
              <strong>Delivered</strong>
              <p>Packed warm and brought to your office</p>
            </li>
          </ol>
        </section>
      </div>

      <section className="wk-cta">
        <div className="container">
          <h2>{page.ctaTitle || 'Ready to feed your team?'}</h2>
          {page.ctaText && <p>{page.ctaText}</p>}
          <div className="wk-cta__actions">
            <a className="btn btn--whatsapp btn--lg" href={wa} target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
            {RESTAURANT.email && (
              <a className="btn btn--ghost btn--lg" href={`mailto:${RESTAURANT.email}?subject=${encodeURIComponent('Team meals')}`}>
                Email us
              </a>
            )}
            <a className="btn btn--ghost btn--lg" href={`tel:+${RESTAURANT.whatsapp}`}>
              Call us
            </a>
          </div>
          <p className="wk-cta__links">
            <a href={page.pdf} download={PDF_NAME}>
              Download the menu (PDF)
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
