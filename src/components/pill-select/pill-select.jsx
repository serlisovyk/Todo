import { ChevronDown } from 'lucide-react'
import './pill-select.css'

export function PillSelect(props) {
  const { ref, labelText, name, options, value, onChange, renderMark } = props

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
        {options.map(({ id, label }) => (
          <option key={id} value={id}>
            <span className="pill-select-mark">{renderMark(id)}</span>
            {label}
          </option>
        ))}
      </select>

      <ChevronDown className="pill-select-chevron" />

      <span className="pill-select-sizer" aria-hidden="true">
        {options.map(({ id, label }) => (
          <span key={id}>{label}</span>
        ))}
      </span>
    </label>
  )
}
