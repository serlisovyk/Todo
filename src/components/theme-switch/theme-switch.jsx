import { useTheme } from '@/context'
import { THEMES } from '@/constants'
import './theme-switch.css'

export function ThemeSwitch() {
  const { theme, changeTheme } = useTheme()

  const handleChange = (event) =>
    changeTheme(event.target.value, event.currentTarget)

  return (
    <fieldset className="theme-switch">
      <legend className="sr-only">Theme</legend>

      {THEMES.map(({ id, label, Icon }) => (
        <label key={id} className="theme-switch-option">
          <input
            className="theme-switch-input"
            type="radio"
            name="theme"
            value={id}
            checked={theme === id}
            onChange={handleChange}
          />

          <Icon className="theme-switch-icon" />

          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  )
}
