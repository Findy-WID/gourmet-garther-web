import { useEffect, useState } from 'react'

// Cross-fades between a few photos every `interval` ms.
// Pauses on hover/focus and when the tab is hidden; stays on the first photo
// for visitors who have "reduce motion" switched on.
export default function PhotoRotator({ images, interval = 5000, className = '' }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (images.length < 2 || paused) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % images.length)
    }, interval)
    return () => clearInterval(t)
  }, [images.length, interval, paused])

  return (
    <div
      className={`rotator ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={i === index ? 'is-active' : ''}
          aria-hidden={i !== index}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
      {images.length > 1 && (
        <div className="rotator__dots" role="group" aria-label="Choose photo">
          {images.map((img, i) => (
            <button
              key={img.src}
              className={i === index ? 'is-active' : ''}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
