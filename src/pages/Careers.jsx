import careers from '../../content/careers.json'
import { RESTAURANT } from '../config'

// Content comes from content/careers.json (editable later in the admin panel).
// Set "open": false on a position to hide it without deleting it.
export default function Careers() {
  const roles = (careers.positions || []).filter((p) => p.open !== false)

  const applyLink = (title) =>
    `mailto:${RESTAURANT.email}?subject=${encodeURIComponent(`Application: ${title}`)}`

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1>Work with us</h1>
          <p>{careers.intro}</p>
        </header>

        <h2 className="careers-count">
          {roles.length ? `${roles.length} open ${roles.length === 1 ? 'role' : 'roles'}` : 'No open roles right now'}
        </h2>

        {roles.length > 0 ? (
          <ul className="roles">
            {roles.map((r) => (
              <li key={r.title} className="role">
                <div className="role__head">
                  <div>
                    <h3>{r.title}</h3>
                    <p className="role__meta">
                      {r.type}
                      {r.location ? `, ${r.location}` : ''}
                    </p>
                  </div>
                  {r.placeholder && <span className="tag">Sample</span>}
                </div>
                <p>{r.summary}</p>
                {r.requirements?.length > 0 && (
                  <>
                    <h4>What you’ll need</h4>
                    <ul className="role__reqs">
                      {r.requirements.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </>
                )}
                {RESTAURANT.email && (
                  <a className="btn btn--primary" href={applyLink(r.title)}>
                    Apply by email
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Check back soon, or send us your CV below.</p>
        )}

        <div className="visit-card">
          <div>
            <h2>How to apply</h2>
            <p>{careers.howToApply}</p>
            <p className="muted">{careers.openToAll}</p>
          </div>
          {RESTAURANT.email && (
            <div className="visit-card__actions">
              <a className="btn btn--ghost" href={applyLink('General application')}>
                {RESTAURANT.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
