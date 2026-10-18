import { useSyncExternalStore } from 'react'
import { buildFiltersSearch, parseFilters } from '@/utils'
import { FILTERS_CHANGE_EVENT } from '@/constants'

export function useFilters() {
  const subscribe = (onChange) => {
    window.addEventListener('popstate', onChange)
    window.addEventListener(FILTERS_CHANGE_EVENT, onChange)

    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener(FILTERS_CHANGE_EVENT, onChange)
    }
  }

  const getSnapshot = () => window.location.search

  const search = useSyncExternalStore(subscribe, getSnapshot)

  const filters = parseFilters(search)

  const changeFilters = (patch) => {
    const url = new URL(window.location.href)
    const currentFilters = parseFilters(url.search)

    url.search = buildFiltersSearch({ ...currentFilters, ...patch })

    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new Event(FILTERS_CHANGE_EVENT))
  }

  return { filters, changeFilters }
}
