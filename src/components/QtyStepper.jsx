export default function QtyStepper({ value, onChange, min = 0, max = 999, label = 'Quantity', small = false }) {
  return (
    <div className={`qty ${small ? 'qty--small' : ''}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase">
        +
      </button>
    </div>
  )
}
