import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { RESTAURANT } from '../config'
import { useCart } from '../context/CartContext'
import { useStatus } from '../lib/useStatus'
import Logo from './Logo'

const LINKS = [
  { to: '/menu?tab=plates', label: 'Plates' },
  { to: '/menu?tab=buckets', label: 'Bowls & Bulk' },
  { to: '/workplace', label: 'Workplace' },
  { to: '/about', label: 'About' },
  { to: '/careers', label: 'Careers' },
]

export default function Header() {
  const { count, openDrawer } = useCart()
  const status = useStatus()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMenuOpen(false), [location])

  return (
    <header className="site-header">
      <div className={`status-strip ${status.isOpen ? 'is-open' : 'is-closed'}`}>
        <span className="status-dot" aria-hidden="true" />
        {status.isOpen ? (
          <span>Open now, taking orders until {status.closesAt}</span>
        ) : (
          <span>Closed now. Pre-orders are open, and we open {status.nextOpenLabel}.</span>
        )}
      </div>
      <div className="header-bar container">
        <Link to="/" className="logo-link" aria-label={`${RESTAURANT.name} home`}>
          <Logo />
        </Link>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className="main-nav__link">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <button className="cart-btn" onClick={openDrawer} aria-label={`Open your order, ${count} items`}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            <span className="cart-btn__label">Your order</span>
            {count > 0 && <span className="cart-btn__count">{count}</span>}
          </button>
          <button
            className="burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
