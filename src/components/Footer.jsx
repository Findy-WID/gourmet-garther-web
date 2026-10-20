import { Link } from 'react-router-dom'
import { HOURS_SUMMARY, RESTAURANT } from '../config'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="wordmark wordmark--light">
            Gourmet<span>Gather</span>
          </p>
          <p className="footer-tag">{RESTAURANT.tagline}</p>
        </div>

        <div>
          <h4>Menu</h4>
          <Link to="/menu?tab=plates">Plates</Link>
          <Link to="/menu?tab=buckets">Buckets</Link>
          <Link to="/workplace">Workplace & corporate</Link>
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

        <div>
          <h4>Talk to us</h4>
          <a href={`https://wa.me/${RESTAURANT.whatsapp}`} target="_blank" rel="noreferrer">
            WhatsApp {RESTAURANT.whatsappDisplay}
          </a>
          {RESTAURANT.email && <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>}
          {RESTAURANT.instagram && (
            <a href={RESTAURANT.instagram} target="_blank" rel="noreferrer">
              Instagram
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
