import { THEME_DARK, THEME_LIGHT, THEME_SYSTEM, THEMES } from '@/constants'

export function isTheme(value) {
  return THEMES.some(({ id }) => id === value)
}

export function resolveTheme(theme, isSystemDark) {
  if (theme !== THEME_SYSTEM) return theme
  if (isSystemDark) return THEME_DARK

  return THEME_LIGHT
}
