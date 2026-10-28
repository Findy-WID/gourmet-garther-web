import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SECTIONS, groupsIn, itemsIn } from '../data/menu'
import ItemCard from '../components/ItemCard'

export default function Menu() {
  const [params, setParams] = useSearchParams()
  const tab = SECTIONS.some((s) => s.id === params.get('tab')) ? params.get('tab') : 'plates'
  const [group, setGroup] = useState('All')
  const [query, setQuery] = useState('')

  const section = SECTIONS.find((s) => s.id === tab)
  const groups = ['All', ...groupsIn(tab)]

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return itemsIn(tab).filter(
      (m) =>
        (group === 'All' || m.group === group) &&
        (!q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)),
    )
  }, [tab, group, query])

  function switchTab(id) {
    setGroup('All')
    setQuery('')
    setParams({ tab: id })
  }

  return (
    <div className="page">
      <div className="container">
        <header className="page-head">
          <h1>The menu</h1>
          <p>Plates for one, buckets for the house, and packs for the office.</p>
        </header>

        <div className="tabs" role="tablist" aria-label="Menu sections">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={tab === s.id}
              className={`tab ${tab === s.id ? 'is-active' : ''}`}
              onClick={() => switchTab(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <p className="tab-intro">{section.long}</p>

        <div className="menu-tools">
          <label className="search">
            <span className="visually-hidden">Search {section.name.toLowerCase()}</span>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder={`Search ${section.name.toLowerCase()}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="chips" aria-label="Filter">
            {groups.map((g) => (
              <button key={g} className={`chip ${group === g ? 'is-active' : ''}`} onClick={() => setGroup(g)}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {items.length && group === 'All' && !query.trim() ? (
          groups.slice(1).map((g) => (
            <section key={g} className="menu-group" aria-labelledby={`grp-${g}`}>
              <h2 id={`grp-${g}`} className="menu-group__title">
                {g}
              </h2>
              <div className="grid">
                {items
                  .filter((m) => m.group === g)
                  .map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
              </div>
            </section>
          ))
        ) : items.length ? (
          <div className="grid">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>Nothing matches “{query}”. Try another word, or clear the search.</p>
            <button className="btn btn--ghost" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
