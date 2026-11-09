import { Link, Navigate, NavLink, useParams } from 'react-router-dom'
import legal from '../../content/legal.json'

// Content comes from content/legal.json (editable in the admin under “Legal pages”).
// The body supports a small, safe subset of Markdown: ## headings, - bullets, **bold** and [links](/path).

function inline(text, keyBase) {
  const parts = []
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g
  let last = 0
  let m
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) parts.push(<strong key={`${keyBase}-${i++}`}>{m[1]}</strong>)
    else {
      const href = m[3]
      parts.push(
        href.startsWith('/') ? (
          <Link key={`${keyBase}-${i++}`} to={href}>
            {m[2]}
          </Link>
        ) : (
          <a key={`${keyBase}-${i++}`} href={href} target="_blank" rel="noreferrer">
            {m[2]}
          </a>
        ),
      )
    }
    last = re.lastIndex
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderBody(body) {
  const blocks = []
  const lines = String(body || '').split('\n')
  let para = []
  let list = []
  const flush = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{inline(para.join(' '), blocks.length)}</p>)
    if (list.length)
      blocks.push(
        <ul key={blocks.length}>
          {list.map((li, i) => (
            <li key={i}>{inline(li, `${blocks.length}-${i}`)}</li>
          ))}
        </ul>,
      )
    para = []
    list = []
  }
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    const h = line.match(/^#{2,3}\s+(.*)$/)
    if (h) {
      flush()
      blocks.push(<h2 key={blocks.length}>{h[1]}</h2>)
      continue
    }
    const b = line.match(/^[-*]\s+(.*)$/)
    if (b) {
      if (para.length) {
        const p = para
        para = []
        blocks.push(<p key={blocks.length}>{inline(p.join(' '), blocks.length)}</p>)
      }
      list.push(b[1])
      continue
    }
    if (list.length) flush()
    para.push(line)
  }
  flush()
  return blocks
}

export default function Legal() {
  const { slug } = useParams()
  const page = legal.pages.find((p) => p.slug === slug)
  if (!page) return <Navigate to={`/legal/${legal.pages[0].slug}`} replace />

  return (
    <div className="page">
      <div className="container legal">
        <header className="page-head">
          <p className="kicker">Legal</p>
          <h1>{page.title}</h1>
          {legal.updated && <p>Last updated {legal.updated}</p>}
        </header>

        <nav className="tabs legal__tabs" aria-label="Legal pages">
          {legal.pages.map((p) => (
            <NavLink key={p.slug} to={`/legal/${p.slug}`} className={({ isActive }) => `tab ${isActive ? 'is-active' : ''}`}>
              {p.short || p.title}
            </NavLink>
          ))}
        </nav>

        <article className="legal__body">{renderBody(page.body)}</article>
      </div>
    </div>
  )
}
