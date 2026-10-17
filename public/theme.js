;(() => {
  const readSavedTheme = () => {
    try {
      return localStorage.getItem('todo:theme')
    } catch {
      return null
    }
  }

  const savedTheme = readSavedTheme()
  const isSystemDark = matchMedia('(prefers-color-scheme: dark)').matches

  const isSavedDark = savedTheme === 'dark'
  const isSavedLight = savedTheme === 'light'
  const isDark = isSavedDark || (!isSavedLight && isSystemDark)
  const resolvedTheme = isDark ? 'dark' : 'light'

  document.documentElement.dataset.theme = resolvedTheme
})()
