import { useId } from 'react'
import { Search, X } from 'lucide-react'
import { IconButton } from '@/components/icon-button'
import { useSearchField } from '@/hooks'
import { SEARCH_SHORTCUT_KEY } from '@/constants'
import './search-field.css'

export function SearchField() {
  const {
    searchInputRef,
    query,
    hasQuery,
    handleChange,
    handleKeyDown,
    handleClear,
  } = useSearchField()

  const inputId = useId()

  return (
    <div className="search-field">
      <label className="sr-only" htmlFor={inputId}>
        Search tasks
      </label>

      <Search className="search-field-icon" aria-hidden="true" />

      <input
        ref={searchInputRef}
        id={inputId}
        className="search-field-input"
        type="search"
        value={query}
        placeholder={`Search tasks (press ${SEARCH_SHORTCUT_KEY})`}
        autoComplete="off"
        aria-keyshortcuts={SEARCH_SHORTCUT_KEY}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {hasQuery && (
        <IconButton Icon={X} labelText="Clear search" onClick={handleClear} />
      )}
    </div>
  )
}
