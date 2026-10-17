import { useEffect, useState } from 'react'
import { useToast } from '@/context/toast'
import { ThemeRepository } from '@/storage'
import { resolveTheme } from '@/utils'
import {
  DARK_SCHEME_QUERY,
  PAGE_COLOR_VARIABLE,
  THEME_COLOR_META_SELECTOR,
} from '@/constants'
import { ThemeContext } from './theme.context.js'
import { useCircleTransition } from './use-circle-transition.js'
import { useMediaQuery } from './use-media-query.js'

export function ThemeProvider({ children }) {
  const { showToast } = useToast()

  const isSystemDark = useMediaQuery(DARK_SCHEME_QUERY)
  const runCircleTransition = useCircleTransition()

  const [repository] = useState(() => new ThemeRepository())
  const [theme, setTheme] = useState(() => repository.read())

  const resolvedTheme = resolveTheme(theme, isSystemDark)

  useEffect(() => {
    const root = document.documentElement

    root.dataset.theme = resolvedTheme

    const pageColor = getComputedStyle(root).getPropertyValue(PAGE_COLOR_VARIABLE)

    document.querySelector(THEME_COLOR_META_SELECTOR).content = pageColor.trim()
  }, [resolvedTheme])

  const changeTheme = (nextTheme, origin) => {
    runCircleTransition(() => setTheme(nextTheme), origin)

    try {
      repository.save(nextTheme)
    } catch (saveError) {
      showToast({ message: saveError.message, isError: true })
    }
  }

  const value = { theme, changeTheme }

  return <ThemeContext value={value}>{children}</ThemeContext>
}
