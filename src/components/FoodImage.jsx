// Shows the dish photo if one is set in menu.js, otherwise a drawn placeholder.
const TINTS = {
  plates: { bg: '#FFE9E6', plate: '#FFFFFF', food: '#E60000', accent: '#F19100' },
  buckets: { bg: '#FFF3E0', plate: '#FFFFFF', food: '#E60000', accent: '#F19100' },
  corporate: { bg: '#EAF7EC', plate: '#FFFFFF', food: '#1AA32E', accent: '#F19100' },
}

export default function FoodImage({ item, className = '' }) {
  if (item.image) {
    return <img className={`food-img ${className}`} src={item.image} alt={item.name} loading="lazy" />
  }
  const t = TINTS[item.section] || TINTS.plates
  const isBucket = item.section === 'buckets'
  return (
    <div className={`food-img food-img--placeholder ${className}`} style={{ background: t.bg }} role="img" aria-label={`${item.name} (photo coming soon)`}>
      <svg viewBox="0 0 200 150" aria-hidden="true">
        {isBucket ? (
          <g>
            <ellipse cx="100" cy="128" rx="58" ry="8" fill="rgba(0,0,0,.07)" />
            <path d="M52 52 L62 124 Q100 134 138 124 L148 52 Z" fill={t.plate} />
            <ellipse cx="100" cy="52" rx="48" ry="12" fill={t.food} />
            <ellipse cx="100" cy="50" rx="40" ry="8" fill={t.accent} opacity=".55" />
            <rect x="60" y="78" width="80" height="22" rx="11" fill={t.food} opacity=".12" />
          </g>
        ) : (
          <g>
            <ellipse cx="100" cy="122" rx="70" ry="10" fill="rgba(0,0,0,.07)" />
            <circle cx="100" cy="75" r="56" fill={t.plate} />
            <circle cx="100" cy="75" r="44" fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="2" />
            <circle cx="88" cy="70" r="24" fill={t.food} />
            <circle cx="118" cy="86" r="14" fill={t.accent} />
            <circle cx="118" cy="60" r="9" fill={t.food} opacity=".5" />
          </g>
        )}
      </svg>
      <span className="food-img__label">Photo coming soon</span>
    </div>
  )
}
