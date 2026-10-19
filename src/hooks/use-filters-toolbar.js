import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { useTodos } from '@/context'
import { canResetFilters, getCategoryFilterOptions } from '@/utils'
import { RESET_DEFAULTS } from '@/constants'
import { useFilters } from './use-filters.js'

export function useFiltersToolbar() {
  const { todos } = useTodos()

  const { filters, changeFilters } = useFilters()

  const categorySelectRef = useRef(null)

  const { category, sort } = filters

  const categoryOptions = getCategoryFilterOptions(todos)
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
    categoryOptions,
    canReset,
    handleCategoryChange,
    handleSortChange,
    handleReset,
  }
}
