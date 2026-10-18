import { CategoryDot } from '@/components/category-dot'
import { FilterGroup } from '@/components/filter-group'
import { TextButton } from '@/components/text-button'
import { useFiltersPanel } from '@/hooks'
import {
  CATEGORY_ALL,
  CATEGORY_FILTERS,
  CATEGORY_INPUT_NAME,
  SORT_INPUT_NAME,
  SORTS,
} from '@/constants'
import './filters-panel.css'

export function FiltersPanel({ ref, id, isOpen }) {
  const {
    category,
    sort,
    hasChoice,
    handleCategoryChange,
    handleSortChange,
    handleReset,
  } = useFiltersPanel()

  return (
    <div ref={ref} id={id} className="filters-panel" hidden={!isOpen}>
      <FilterGroup
        legendText="Category"
        name={CATEGORY_INPUT_NAME}
        options={CATEGORY_FILTERS}
        value={category}
        onChange={handleCategoryChange}
        renderMark={(categoryId) =>
          categoryId !== CATEGORY_ALL && <CategoryDot categoryId={categoryId} />
        }
      />

      <FilterGroup
        legendText="Sort by"
        name={SORT_INPUT_NAME}
        options={SORTS}
        value={sort}
        onChange={handleSortChange}
      />

      {hasChoice && <TextButton onClick={handleReset}>Reset filters</TextButton>}
    </div>
  )
}
