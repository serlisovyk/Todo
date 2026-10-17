import { useEffect, useRef } from 'react'
import {
  CLEAR_SEARCH_KEY,
  DEFAULT_QUERY,
  EDITABLE_FIELD_SELECTOR,
  SEARCH_SHORTCUT_KEY,
} from '@/constants'
import { useFilters } from './use-filters.js'

export function useSearchField() {
  const { filters, changeFilters } = useFilters()

  const searchInputRef = useRef(null)

  const { query } = filters

  const hasQuery = query !== DEFAULT_QUERY

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.key !== SEARCH_SHORTCUT_KEY) return

      const hasModifier = event.ctrlKey || event.metaKey || event.altKey
      if (hasModifier) return

      const editableField = event.target.closest(EDITABLE_FIELD_SELECTOR)
      if (editableField) return

      event.preventDefault()
      searchInputRef.current.focus()
    }

    document.addEventListener('keydown', handleShortcut)

    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  const clearQuery = () => changeFilters({ query: DEFAULT_QUERY })

  const handleChange = (event) => changeFilters({ query: event.target.value })

  const handleKeyDown = (event) => {
    if (event.key === CLEAR_SEARCH_KEY) clearQuery()
  }

  const handleClear = () => {
    searchInputRef.current.focus()
    clearQuery()
  }

  return {
    searchInputRef,
    query,
    hasQuery,
    handleChange,
    handleKeyDown,
    handleClear,
  }
}
