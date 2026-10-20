import { Link } from 'react-router-dom'
import { itemsIn } from '../data/menu'
import ItemCard from '../components/ItemCard'
import { RESTAURANT } from '../config'

const PERKS = [
  { title: 'Packed per person', body: 'Every lunch pack is sealed and labelled, so it’s easy to hand out.' },
  { title: 'Weekly or monthly', body: 'Choose a repeat schedule at checkout. Same day, same order, no reminders needed.' },
  { title: 'One invoice on WhatsApp', body: 'We confirm quantities, delivery time and payment with your admin on WhatsApp.' },
]

export default function Workplace() {
  const items = itemsIn('corporate')
  const message = encodeURIComponent(
    `Hello ${RESTAURANT.name}, I'd like to discuss a workplace / corporate catering plan.`,
  )

  return (
    <div className="page">
      <section className="work-hero">
        <div className="container">
          <h1>Lunch for the whole office, sorted.</h1>
          <p>
            Packed lunches, meeting trays and office party feasts, delivered to your workplace in {RESTAURANT.city}.
            Order once, or set it to repeat every week or month.
          </p>
          <div className="hero__actions">
            <a href="#work-menu" className="btn btn--light btn--lg">
              See the workplace menu
            </a>
            <a
              href={`https://wa.me/${RESTAURANT.whatsapp}?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn--outline-light btn--lg"
            >
              Ask about a custom plan
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        <ul className="perks">
          {PERKS.map((p) => (
            <li key={p.title}>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="section-head" id="work-menu">
          <div>
            <h2>Workplace menu</h2>
            <p>Lunch packs have a minimum of 10. Need something else? Message us.</p>
          </div>
          <Link to="/menu?tab=plates" className="text-link">
            Just ordering for yourself?
          </Link>
        </div>
        <div className="grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
