import careers from '../../content/careers.json'
import { RESTAURANT } from '../config'

// Content comes from content/careers.json (editable later in the admin panel).
// Set "open": false on a position to hide it without deleting it.
export default function Careers() {
  // Open roles first, closed ones after. A role is shown as Closed when "open" is false.
  const roles = [...(careers.positions || [])].sort((a, b) => (b.open !== false) - (a.open !== false))
  const email = careers.applyEmail || RESTAURANT.email
  const whatsapp = careers.applyWhatsapp || RESTAURANT.whatsapp

  const emailLink = (title) => `mailto:${email}?subject=${encodeURIComponent(`Application: ${title}`)}`
  const whatsappLink = (title) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      title
        ? `Hello ${RESTAURANT.name}, I'd like to apply for the ${title} position. My CV is attached.`
        : `Hello ${RESTAURANT.name}, I'd like to apply for a role. My CV is attached.`,
    )}`

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1>Work with us</h1>
          <p>{careers.intro}</p>
        </header>

        {roles.length > 0 && !roles.some((r) => r.open !== false) && (
          <div className="no-roles">
            <h2>We’re not hiring right now</h2>
            <p>All our roles below have been filled. Check back soon, or send us your CV and we’ll keep it on file.</p>
          </div>
        )}

        {roles.length > 0 ? (
          <ul className="roles">
            {roles.map((r) => (
              <li key={r.title} className={`role ${r.open === false ? 'is-closed' : ''}`}>
                <div className="role__head">
                  <div>
                    <h3>{r.title}</h3>
                    <p className="role__meta">
                      {[r.location, r.type, r.note].filter(Boolean).join(', ')}
                    </p>
                  </div>
                  <span className={`status-pill ${r.open === false ? 'is-closed' : 'is-open'}`}>
                    {r.open === false ? 'Closed' : 'Open'}
                  </span>
                </div>

                {r.summary?.map((p) => (
                  <p key={p.slice(0, 20)}>{p}</p>
                ))}

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

                {r.schedule && (
                  <p className="role__schedule">
                    <strong>Work schedule:</strong> {r.schedule}
                  </p>
                )}

                <div className="role__actions">
                  {r.jdLink && (
                    <a className="btn btn--ghost" href={r.jdLink} target="_blank" rel="noreferrer">
                      Read the job description
                    </a>
                  )}
                  {r.open !== false && email && (
                    <a className="btn btn--primary" href={emailLink(r.title)}>
                      Apply by email
                    </a>
                  )}
                  {r.open !== false && whatsapp && (
                    <a className="link-btn role__wa" href={whatsappLink(r.title)} target="_blank" rel="noreferrer">
                      or send your CV on WhatsApp
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no-roles">
            <h2>No open roles at the moment</h2>
            <p>We’re not hiring right now, but we’re always glad to meet people who love food and good service. Check back soon, or send us your CV and we’ll keep it on file.</p>
          </div>
        )}

        <div className="visit-card visit-card--apply">
          <div>
            <h2>How to apply</h2>
            <p>{careers.howToApply}</p>
            {careers.generalRequirements?.length > 0 && (
              <ul className="role__reqs">
                {careers.generalRequirements.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            )}
            {careers.openToAll && <p className="muted">{careers.openToAll}</p>}
          </div>
          <div className="apply-contacts">
            {email && (
              <a className="btn btn--ghost" href={emailLink('General application')}>
                {email}
              </a>
            )}
            {whatsapp && (
              <a className="btn btn--whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer">
                WhatsApp {careers.applyWhatsappDisplay || RESTAURANT.whatsappDisplay}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
