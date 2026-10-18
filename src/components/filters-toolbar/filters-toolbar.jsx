import { SlidersHorizontal } from 'lucide-react'
import { FiltersPanel } from '@/components/filters-panel'
import { SearchField } from '@/components/search-field'
import { useFiltersToolbar } from '@/hooks'
import './filters-toolbar.css'

export function FiltersToolbar() {
  const { buttonRef, panelRef, panelId, isOpen, hasChoice, handleToggle } =
    useFiltersToolbar()

  return (
    <div className="filters-toolbar">
      <SearchField />

      <button
        ref={buttonRef}
        type="button"
        className="filters-toolbar-button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleToggle}
      >
        <SlidersHorizontal className="filters-toolbar-icon" aria-hidden="true" />
        Filters
        {hasChoice && (
          <span className="filters-toolbar-dot">
            <span className="sr-only">(applied)</span>
          </span>
        )}
      </button>

      <FiltersPanel ref={panelRef} id={panelId} isOpen={isOpen} />
    </div>
  )
}
