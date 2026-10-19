import { ChevronDown } from 'lucide-react'
import './pill-select.css'

export function PillSelect(props) {
  const { ref, labelText, name, options, value, onChange, renderMark } = props

  const choices = options.map(({ id, label }) => ({
    id,
    label,
    mark: renderMark(id),
  }))

  return (
    <label className="pill-select" title={labelText}>
      <span className="sr-only">{labelText}</span>

      <span className="pill-select-indicator">{renderMark(value)}</span>

      <select
        ref={ref}
        className="pill-select-control"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {choices.map(({ id, label, mark }) => (
          <option key={id} value={id} title="">
            {mark && <span className="pill-select-mark">{mark}</span>}
            {label}
          </option>
        ))}
      </select>

      <ChevronDown className="pill-select-chevron" />

      <span className="pill-select-sizer" aria-hidden="true">
        {choices.map(({ id, label, mark }) => (
          <span key={id} className={mark ? 'is-marked' : undefined}>
            {label}
          </span>
        ))}
      </span>
    </label>
  )
}
