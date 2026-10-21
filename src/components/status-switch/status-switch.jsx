import { useTodos } from '@/context'
import { useFilters } from '@/hooks'
import { getStatusFilterOptions } from '@/utils'
import { STATUS_INPUT_NAME } from '@/constants'
import './status-switch.css'

export function StatusSwitch() {
  const { todos } = useTodos()

  const { filters, changeFilters } = useFilters()

  const statusOptions = getStatusFilterOptions(todos)

  const handleChange = (event) => changeFilters({ status: event.target.value })

  return (
    <fieldset className="status-switch">
      <legend className="sr-only">Filter by status</legend>

      {statusOptions.map(({ id, label }) => (
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
