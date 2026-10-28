import { Link } from 'react-router-dom'
import about from '../../content/about.json'
import { RESTAURANT } from '../config'
import PhotoRotator from '../components/PhotoRotator'

// Content comes from content/about.json (editable later in the admin panel).
export default function About() {
  const { story, cook, who, values, different, gallery } = about
  const quoteLink = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(
    `Hello ${RESTAURANT.name}, I'd like a catering quote.\n\nType of event / plan:\nDate:\nNumber of guests:\nLocation:`,
  )}`

  return (
    <div className="page page--flush">
      <section className="about-hero">
        <div className="container about-hero__grid">
          <div>
            <p className="kicker">{RESTAURANT.tagline}</p>
            <h1>{about.title}</h1>
            <p className="about-hero__intro">{about.intro}</p>
          </div>
          <div className="about-hero__media">
            {about.heroImages?.length ? (
              <PhotoRotator images={about.heroImages} />
            ) : about.image ? (
              <img src={about.image} alt={`Guests dining at ${RESTAURANT.name}`} />
            ) : (
              <div className="photo-slot" role="img" aria-label="Restaurant photo coming soon">
                <span>Restaurant photo coming soon</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container">
        {about.placeholder && (
          <p className="notice notice--draft">
            Draft text. The final About copy from {RESTAURANT.name} will replace this.
          </p>
        )}

        {story && (
          <section className="story" aria-labelledby="story-title">
            <h2 id="story-title">{story.heading}</h2>
            <div className="story__body">
              {story.paragraphs.slice(0, -1).map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              {story.milestone && (
                <p className="story__milestone">
                  <span>{story.milestone.date}</span>
                  {story.milestone.text}
                </p>
              )}
              {story.paragraphs.length > 0 && <p>{story.paragraphs.at(-1)}</p>}
            </div>
          </section>
        )}

        {gallery?.length > 0 && (
          <div className="gallery">
            {gallery.map((g) => (
              <img key={g.src} src={g.src} alt={g.alt} loading="lazy" />
            ))}
          </div>
        )}

        {cook && (
          <section className="cook" aria-labelledby="cook-title">
            <h2 id="cook-title">{cook.heading}</h2>
            <p className="cook__intro">{cook.intro}</p>
            <ul className="highlights">
              {cook.highlights.map((h) => (
                <li key={h.title} className="highlight">
                  <h3>{h.title}</h3>
                  <p>{h.body}</p>
                  {h.link && (
                    <Link to={h.link} className="text-link">
                      {h.link.startsWith('/menu/') ? 'Order this' : 'See the menu'}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {who && (
          <section className="who" aria-labelledby="who-title">
            <h2 id="who-title">{who.heading}</h2>
            <ul className="who__list">
              {who.groups.map((g) => (
                <li key={g.title}>
                  <h3>{g.title}</h3>
                  <p>{g.body}</p>
                </li>
              ))}
            </ul>
            <div className="who__cta">
              <p>{who.cta}</p>
              <div className="visit-card__actions">
                <a className="btn btn--primary" href={quoteLink} target="_blank" rel="noreferrer">
                  Request a catering quote
                </a>
                <Link to="/menu" className="btn btn--ghost">
                  Place an order
                </Link>
              </div>
            </div>
          </section>
        )}

        {values?.length > 0 && (
          <ul className="perks perks--about">
            {values.map((v) => (
              <li key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ul>
        )}

        {different && (
          <section className="different">
            <h2>{different.heading}</h2>
            <p>{different.body}</p>
          </section>
        )}

        <div className="visit-card">
          <div>
            <h2>Come and see us</h2>
            <p>{RESTAURANT.address}</p>
          </div>
          <div className="visit-card__actions">
            <a
              className="btn btn--ghost"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(RESTAURANT.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
            </a>
            <Link to="/menu" className="btn btn--primary">
              Order from the menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
