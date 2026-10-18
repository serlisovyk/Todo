import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { canResetFilters } from '@/utils'
import { RESET_DEFAULTS } from '@/constants'
import { useFilters } from './use-filters.js'

export function useFiltersToolbar() {
  const { filters, changeFilters } = useFilters()

  const categorySelectRef = useRef(null)

  const { category, sort } = filters

  const canReset = canResetFilters(filters)

  const handleCategoryChange = (categoryId) =>
    changeFilters({ category: categoryId })

  const handleSortChange = (sortId) => changeFilters({ sort: sortId })

  const handleReset = () => {
    flushSync(() => changeFilters(RESET_DEFAULTS))

    categorySelectRef.current.focus()
  }

  return {
    categorySelectRef,
    category,
    sort,
    canReset,
    handleCategoryChange,
    handleSortChange,
    handleReset,
  }
}
