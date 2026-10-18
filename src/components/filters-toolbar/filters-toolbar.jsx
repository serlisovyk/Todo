import { ArrowDownUp, X } from 'lucide-react'
import { CategoryDot } from '@/components/category-dot'
import { IconButton } from '@/components/icon-button'
import { PillSelect } from '@/components/pill-select'
import { SearchField } from '@/components/search-field'
import { useFiltersToolbar } from '@/hooks'
import { CATEGORY_ALL, CATEGORY_FILTERS, SORTS } from '@/constants'
import './filters-toolbar.css'

export function FiltersToolbar() {
  const {
    categorySelectRef,
    category,
    sort,
    canReset,
    handleCategoryChange,
    handleSortChange,
    handleReset,
  } = useFiltersToolbar()

  return (
    <div className="filters-toolbar">
      <SearchField />

      <div className="filters-toolbar-filters">
        <PillSelect
          ref={categorySelectRef}
          labelText="Category"
          options={CATEGORY_FILTERS}
          value={category}
          onChange={handleCategoryChange}
          renderMark={(categoryId) =>
            categoryId !== CATEGORY_ALL && <CategoryDot categoryId={categoryId} />
          }
        />

        <PillSelect
          labelText="Sort"
          options={SORTS}
          value={sort}
          onChange={handleSortChange}
          renderMark={() => <ArrowDownUp className="filters-toolbar-sort-icon" />}
        />

        {canReset && (
          <IconButton Icon={X} labelText="Reset filters" onClick={handleReset} />
        )}
      </div>
    </div>
  )
}
