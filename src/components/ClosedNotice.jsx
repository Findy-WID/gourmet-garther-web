import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStatus } from '../lib/useStatus'
import { HOURS_SUMMARY } from '../config'

const SEEN_KEY = 'gg-closed-notice-seen'

// Pop-up shown once per visit when the restaurant is closed.
export default function ClosedNotice() {
  const status = useStatus()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    if (status.isOpen) return
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      /* ignore */
    }
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 500)
      return () => clearTimeout(t)
    }
  }, [status.isOpen])

  useEffect(() => {
    if (!open) return
    btnRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <div
        className="closed-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="closed-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="closed-sign" aria-hidden="true">
          <span>Closed</span>
        </div>
        <h2 id="closed-title">We’re closed right now</h2>
        <p>
          The kitchen opens again <strong>{status.nextOpenLabel}</strong>. You can still browse the menu and place a
          pre-order. We’ll confirm it on WhatsApp as soon as we open.
        </p>
        <ul className="closed-hours">
          {HOURS_SUMMARY.map((h) => (
            <li key={h.days}>
              <span>{h.days}</span>
              <strong>{h.time}</strong>
            </li>
          ))}
        </ul>
        <div className="closed-actions">
          <button
            ref={btnRef}
            className="btn btn--primary btn--block"
            onClick={() => {
              close()
              navigate('/menu')
            }}
          >
            Browse the menu & pre-order
          </button>
          <button className="btn btn--ghost btn--block" onClick={close}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
