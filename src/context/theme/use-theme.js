import { use } from 'react'
import { MISSING_THEME_PROVIDER_MESSAGE } from '@/constants'
import { ThemeContext } from './theme.context.js'

export function useTheme() {
  const context = use(ThemeContext)

  if (!context) throw new Error(MISSING_THEME_PROVIDER_MESSAGE)

  return context
}
