import { Link } from 'react-router-dom'
import FoodImage from './FoodImage'
import { formatNaira } from '../config'
import { useStatus } from '../lib/useStatus'

export default function ItemCard({ item }) {
  const { isOpen } = useStatus()
  const fromPrice = item.choices?.some((c) => c.options.some((o) => o.price !== 0)) || item.extras?.length
  return (
    <Link to={`/menu/${item.id}`} className={`item-card ${item.available ? '' : 'is-soldout'}`}>
      <div className="item-card__media">
        <FoodImage item={item} />
        {!item.available && <span className="soldout-badge">Sold out</span>}
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
