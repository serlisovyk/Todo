import { isTheme } from '@/utils'
import {
  DEFAULT_THEME,
  SAVE_THEME_ERROR_MESSAGE,
  THEME_STORAGE_KEY,
} from '@/constants'

export class ThemeRepository {
  read() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)

      if (!isTheme(stored)) return DEFAULT_THEME

      return stored
    } catch {
      return DEFAULT_THEME
    }
  }

  save(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      throw new Error(SAVE_THEME_ERROR_MESSAGE, { cause: error })
    }
  }
}
