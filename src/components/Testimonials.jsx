import { useCallback, useEffect, useRef, useState } from 'react'
import data from '../../content/testimonials.json'

// Real customer messages (content/testimonials.json, editable in the admin under “Reviews”).
// A sliding row: moves on by one review every 5 seconds, can be swiped on phones,
// pauses while someone is touching or hovering it, and picks up where the visitor left off.
const DELAY = 5000
const KEY = 'gg-review-index'

const readStart = (n) => {
  try {
    const v = parseInt(localStorage.getItem(KEY), 10)
    return Number.isFinite(v) ? (v + 1) % n : 0
  } catch {
    return 0
  }
}

export default function Testimonials() {
  const items = (data.items || []).filter((t) => t.quote?.trim())
  const n = items.length
  const track = useRef(null)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useRef(false)

  const goTo = useCallback(
    (i, smooth = true) => {
      const el = track.current
      if (!el || !n) return
      const next = ((i % n) + n) % n
      const card = el.children[next]
      if (!card) return
      el.scrollTo({ left: card.offsetLeft, behavior: smooth && !reduce.current ? 'smooth' : 'auto' })
      setIndex(next)
      try {
        localStorage.setItem(KEY, String(next))
      } catch {
        /* storage unavailable: just don't remember */
      }
    },
    [n],
  )

  // Continue from the review after the one this visitor last saw
  useEffect(() => {
    reduce.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (n) goTo(readStart(n), false)
  }, [n, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused || n < 2 || reduce.current) return
    const t = setTimeout(() => {
      const el = track.current
      // When the last cards are already in view, loop back to the start
      const atEnd = el && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
      goTo(atEnd ? 0 : index + 1)
    }, DELAY)
    return () => clearTimeout(t)
  }, [index, paused, n, goTo])

  // Keep the dots in step when the visitor swipes by hand
  const onScroll = () => {
    const el = track.current
    if (!el) return
    const left = el.scrollLeft
    let best = 0
    let dist = Infinity
    ;[...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - left)
      if (d < dist) {
        dist = d
        best = i
      }
    })
    if (best !== index) setIndex(best)
  }

  if (!n) return null

  return (
    <section className="section section--tint reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 id="reviews-title">{data.title || 'What our customers say'}</h2>
            {data.intro && <p>{data.intro}</p>}
          </div>
          <div className="reviews__arrows">
            <button className="icon-btn" onClick={() => goTo(index - 1)} aria-label="Previous review">
              ‹
            </button>
            <button className="icon-btn" onClick={() => goTo(index + 1)} aria-label="Next review">
              ›
            </button>
          </div>
        </div>

        <ul
          ref={track}
          className="reviews__track"
          onScroll={onScroll}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setTimeout(() => setPaused(false), 3000)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-roledescription="carousel"
        >
          {items.map((t, i) => (
            <li key={i} className="tmonial" aria-roledescription="slide" aria-label={`Review ${i + 1} of ${n}`}>
              <blockquote className="tmonial__bubble">
                <p>{t.quote}</p>
              </blockquote>
              <p className="tmonial__meta">
                <span className="tmonial__who">A customer</span>
                {[t.dish, t.source && `via ${t.source}`].filter(Boolean).map((x) => (
                  <span key={x}> · {x}</span>
                ))}
              </p>
            </li>
          ))}
        </ul>

        <div className="reviews__dots" aria-hidden="true">
          {items.map((_, i) => (
            <span key={i} className={i === index ? 'is-on' : ''} />
          ))}
        </div>
      </div>
    </section>
  )
}
