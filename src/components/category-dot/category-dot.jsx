import './category-dot.css'

export function CategoryDot({ categoryId }) {
  return (
    <span className="category-dot" data-category={categoryId} aria-hidden="true" />
  )
}
