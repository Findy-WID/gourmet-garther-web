import { Link } from 'react-router-dom'
import { HOURS_SUMMARY, RESTAURANT } from '../config'
import Logo from './Logo'
import SocialIcon from './SocialIcon'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo onDark />
          <p className="footer-tag">{RESTAURANT.tagline}</p>
          {RESTAURANT.socials.length > 0 && (
            <ul className="socials" aria-label="Social media">
              {RESTAURANT.socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noreferrer" aria-label={`${s.label} ${s.handle}`}>
                    <SocialIcon name={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4>Menu</h4>
          <Link to="/menu?tab=plates">Plates</Link>
          <Link to="/menu?tab=buckets">Bowls & bulk orders</Link>
          <Link to="/workplace">Workplace & corporate</Link>
        </div>

        <div>
          <h4>Company</h4>
          <Link to="/about">About us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/#how-it-works">How ordering works</Link>
        </div>

        <div>
          <h4>Opening hours</h4>
          {HOURS_SUMMARY.map((h) => (
            <p key={h.days}>
              {h.days}
              <br />
              <strong>{h.time}</strong>
            </p>
          ))}
        </div>

        <div className="footer-contact">
          <h4>Talk to us</h4>
          <a href={`https://wa.me/${RESTAURANT.whatsapp}`} target="_blank" rel="noreferrer">
            <span className="footer-contact__label">WhatsApp</span>
            {RESTAURANT.whatsappDisplay}
          </a>
          {RESTAURANT.email && (
            <a href={`mailto:${RESTAURANT.email}`}>
              <span className="footer-contact__label">Email</span>
              {RESTAURANT.email}
            </a>
          )}
          {RESTAURANT.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              <span className="footer-contact__label">Visit or pick up</span>
              {RESTAURANT.address}
            </a>
          )}
        </div>
      </div>
      <div className="container footer-base">
        © {new Date().getFullYear()} {RESTAURANT.name}, {RESTAURANT.city}
      </div>
    </footer>
  )
}
