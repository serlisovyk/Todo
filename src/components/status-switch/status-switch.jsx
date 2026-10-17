import { useFilters } from '@/hooks'
import { STATUS_INPUT_NAME, STATUSES } from '@/constants'
import './status-switch.css'

export function StatusSwitch() {
  const { filters, changeFilters } = useFilters()

  const handleChange = (event) => changeFilters({ status: event.target.value })

  return (
    <fieldset className="status-switch">
      <legend className="sr-only">Filter by status</legend>

      {STATUSES.map(({ id, label }) => (
        <label key={id} className="status-switch-option">
          <input
            className="status-switch-input"
            type="radio"
            name={STATUS_INPUT_NAME}
            value={id}
            checked={filters.status === id}
            onChange={handleChange}
          />

          <span className="status-switch-label">{label}</span>
        </label>
      ))}
    </fieldset>
  )
}
