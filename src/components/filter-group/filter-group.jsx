import './filter-group.css'

export function FilterGroup(props) {
  const { legendText, name, options, value, onChange, renderMark } = props

  const handleChange = (event) => onChange(event.target.value)

  return (
    <fieldset className="filter-group">
      <legend className="filter-group-legend">{legendText}</legend>

      <div className="filter-group-options">
        {options.map(({ id, label }) => (
          <label key={id} className="filter-group-option">
            <input
              className="filter-group-input"
              type="radio"
              name={name}
              value={id}
              checked={value === id}
              onChange={handleChange}
            />

            {renderMark?.(id)}
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
