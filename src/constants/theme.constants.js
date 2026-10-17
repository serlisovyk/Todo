import { Monitor, Moon, Sun } from 'lucide-react'

export const THEME_STORAGE_KEY = 'todo:theme'

export const THEME_LIGHT = 'light'
export const THEME_DARK = 'dark'
export const THEME_SYSTEM = 'system'

export const THEMES = [
  { id: THEME_LIGHT, label: 'Light theme', Icon: Sun },
  { id: THEME_DARK, label: 'Dark theme', Icon: Moon },
  { id: THEME_SYSTEM, label: 'System theme', Icon: Monitor },
]

export const DEFAULT_THEME = THEME_SYSTEM

export const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)'
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

export const PAGE_COLOR_VARIABLE = '--color-page'
export const TRANSITION_DURATION_VARIABLE = '--duration-base'
export const TRANSITION_EASING_VARIABLE = '--ease-out'
export const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]'
export const CIRCLE_PSEUDO_ELEMENT = '::view-transition-new(root)'

export const SAVE_THEME_ERROR_MESSAGE =
  'Your theme could not be saved. The browser storage may be full or blocked.'

export const MISSING_THEME_PROVIDER_MESSAGE =
  'useTheme must be used inside ThemeProvider.'
