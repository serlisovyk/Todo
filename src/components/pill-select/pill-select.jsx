import { ChevronDown } from 'lucide-react'
import './pill-select.css'

export function PillSelect(props) {
  const { labelText, name, options, value, onChange, children } = props

  return (
    <label className="pill-select">
      <span className="sr-only">{labelText}</span>

      <span className="pill-select-indicator">{children}</span>

      <select
        className="pill-select-control"
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>

      <ChevronDown className="pill-select-chevron" />
    </label>
  )
}
