import { Link } from 'react-router-dom'
import FoodImage from './FoodImage'
import { formatNaira } from '../config'
import { daysLabel } from '../data/menu'
import { useStatus } from '../lib/useStatus'

export default function ItemCard({ item }) {
  const { isOpen } = useStatus()
  // "from" only when choices or extras can raise the price
  const fromPrice = Boolean(item.choices?.some((c) => c.options.some((o) => o.price !== 0)) || item.extras?.length > 0)
  return (
    <Link to={`/menu/${item.id}`} className={`item-card ${item.available ? '' : 'is-soldout'}`}>
      <div className="item-card__media">
        <FoodImage item={item} />
        {!item.available && <span className="soldout-badge">Sold out</span>}
        {item.available && item.days.length > 0 && <span className="day-badge">{daysLabel(item.days)}</span>}
        {item.placeholder && <span className="sample-badge">Sample</span>}
      </div>
      <div className="item-card__body">
        <h3 className="item-card__name">{item.name}</h3>
        <p className="item-card__unit">{item.unit}</p>
        <div className="item-card__foot">
          <span className="item-card__price">
            {fromPrice && <small>from </small>}
            {formatNaira(item.price)}
          </span>
          <span className="item-card__cta">{!item.available ? 'Sold out' : isOpen ? 'Order' : 'Pre-order'}</span>
        </div>
      </div>
    </Link>
  )
}
