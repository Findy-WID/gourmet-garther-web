import { Link } from 'react-router-dom'
import { MENU, SECTIONS } from '../data/menu'
import ItemCard from '../components/ItemCard'
import FoodImage from '../components/FoodImage'
import { useStatus } from '../lib/useStatus'
import { HOURS_SUMMARY, RESTAURANT } from '../config'

// Photos for the "What are you ordering for?" cards. Leave empty to show the drawn placeholder.
const SECTION_PHOTOS = {
  plates: '/images/site/rice-and-pasta-spread.webp',
  buckets: '',
  corporate: '/images/site/catering.webp',
}

const STEPS = [
  { title: 'Pick your food', body: 'Choose plates, buckets or a workplace pack, with your protein and extras.' },
  { title: 'Tell us how and when', body: 'One-time, weekly or monthly. Delivery to your address, or pick it up yourself.' },
  { title: 'Send it on WhatsApp', body: 'Your full order lands in our WhatsApp. We confirm it there and send payment details.' },
]

export default function Home() {
  const status = useStatus()
  const popular = MENU.filter((m) => m.popular && m.available)

  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 className="hero__title">
              {RESTAURANT.tagline}
            </h1>
            <p className="hero__lede">
              {RESTAURANT.intro} Order here, then confirm and pay on WhatsApp.
            </p>
            <div className="hero__actions">
              <Link to="/menu" className="btn btn--light btn--lg">
                {status.isOpen ? 'Order now' : 'Pre-order now'}
              </Link>
              <Link to="/workplace" className="btn btn--outline-light btn--lg">
                Order for your office
              </Link>
            </div>
          </div>

          <div className={`open-sign ${status.isOpen ? 'is-open' : 'is-closed'}`} aria-live="polite">
            <div className="open-sign__board">
              <span className="open-sign__word">{status.isOpen ? 'Open' : 'Closed'}</span>
              <span className="open-sign__sub">
                {status.isOpen ? `Until ${status.closesAt} today` : `Opens ${status.nextOpenLabel}`}
              </span>
            </div>
            <ul className="open-sign__hours">
              {HOURS_SUMMARY.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Start with these</h2>
              <p>A few favourites from the {RESTAURANT.city} kitchen.</p>
            </div>
            <Link to="/menu" className="text-link">
              See the full menu
            </Link>
          </div>
          <div className="rail">
            {popular.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section-head section-head--center">
            <div>
              <h2>What are you ordering for?</h2>
              <p>Three ways to eat with us.</p>
            </div>
          </div>
          <div className="ways">
            {SECTIONS.map((s) => {
              const sample = MENU.find((m) => m.section === s.id)
              const to = s.id === 'corporate' ? '/workplace' : `/menu?tab=${s.id}`
              return (
                <Link key={s.id} to={to} className={`way way--${s.id}`}>
                  {SECTION_PHOTOS[s.id] ? (
                    <img className="food-img way__img" src={SECTION_PHOTOS[s.id]} alt="" loading="lazy" />
                  ) : (
                    <FoodImage item={sample} className="way__img" />
                  )}
                  <div className="way__body">
                    <h3>{s.name}</h3>
                    <p>{s.long}</p>
                    <span className="way__cta">View {s.name.toLowerCase()}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section--tint visit">
        <div className="container visit__grid">
          <div className="visit__photos">
            <img src="/images/site/diners-mural.webp" alt="Guests eating together in the Gourmet Gather dining room" loading="lazy" />
            <img src="/images/site/storefront.webp" alt="The Gourmet Gather storefront" loading="lazy" />
          </div>
          <div className="visit__copy">
            <h2>Eat in with us</h2>
            <p>
              Our dining room is open every day for lunch, dinner and get-togethers. Come in, or order ahead and pick
              up on your way.
            </p>
            <p className="visit__address">{RESTAURANT.address}</p>
            <div className="hero__actions">
              <a
                className="btn btn--primary"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT.address)}`}
                target="_blank"
                rel="noreferrer"
              >
                Get directions
              </a>
              <Link to="/about" className="btn btn--ghost">
                About us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>How ordering works</h2>
              <p>No card payments on the site. Everything is confirmed with a real person.</p>
            </div>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="office-band">
            <div>
              <h2>Feeding a team?</h2>
              <p>
                Packed lunches from 10 people, small chops for meetings and feasts for office parties. Set it up once,
                weekly or monthly, and we handle the rest.
              </p>
            </div>
            <Link to="/workplace" className="btn btn--primary btn--lg">
              See the workplace menu
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
