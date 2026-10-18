import { flushSync } from 'react-dom'
import { hasPanelChoice } from '@/utils'
import { CHECKED_CATEGORY_SELECTOR, PANEL_DEFAULTS } from '@/constants'
import { useFilters } from './use-filters.js'

export function useFiltersPanel() {
  const { filters, changeFilters } = useFilters()

  const { category, sort } = filters

  const hasChoice = hasPanelChoice(filters)

  const handleCategoryChange = (categoryId) =>
    changeFilters({ category: categoryId })

  const handleSortChange = (sortId) => changeFilters({ sort: sortId })

  const handleReset = () => {
    flushSync(() => changeFilters(PANEL_DEFAULTS))

    document.querySelector(CHECKED_CATEGORY_SELECTOR).focus()
  }

  return {
    category,
    sort,
    hasChoice,
    handleCategoryChange,
    handleSortChange,
    handleReset,
  }
}
