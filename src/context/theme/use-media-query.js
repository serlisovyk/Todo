import { useSyncExternalStore } from 'react'

export function useMediaQuery(query) {
  const subscribe = (onChange) => {
    const mediaQuery = window.matchMedia(query)

    mediaQuery.addEventListener('change', onChange)

    return () => mediaQuery.removeEventListener('change', onChange)
  }

  const getSnapshot = () => window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot)
}
