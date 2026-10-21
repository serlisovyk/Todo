import { useId } from 'react'
import { Check, Flag, Pencil, Trash2 } from 'lucide-react'
import { HighlightedText } from '@/components/highlighted-text'
import { IconButton } from '@/components/icon-button'
import { TodoEditForm } from '@/components/todo-edit-form'
import { useTodoItem } from '@/hooks'
import { CATEGORIES, PRIORITIES } from '@/constants'
import './todo-item.css'

export function TodoItem({ todo, neighborId, checkboxesRef }) {
  const { title, completed, category: categoryId, priority: priorityId } = todo

  const {
    editButtonRef,
    query,
    isEditing,
    isToggling,
    registerCheckbox,
    ignoreRepeatedClick,
    handleToggle,
    handleDelete,
    startEditing,
    stopEditing,
  } = useTodoItem(todo, neighborId, checkboxesRef)

  const metaId = useId()

  if (isEditing) {
    return (
      <li className="todo-item">
        <TodoEditForm todo={todo} onClose={stopEditing} />
      </li>
    )
  }

  const category = CATEGORIES.find((candidate) => candidate.id === categoryId)
  const priority = PRIORITIES.find((candidate) => candidate.id === priorityId)

  return (
    <li className="todo-item" data-toggling={isToggling}>
      <div className="todo-item-body">
        <label className="todo-item-label" onClickCapture={ignoreRepeatedClick}>
          <input
            ref={registerCheckbox}
            type="checkbox"
            className="todo-item-checkbox"
            checked={completed}
            aria-describedby={metaId}
            onChange={handleToggle}
          />

          <Check className="todo-item-check" aria-hidden="true" />

          <span className="todo-item-title">
            <HighlightedText text={title} query={query} />
          </span>
        </label>

        <div className="todo-item-meta" id={metaId}>
          <span className="todo-item-category" data-category={categoryId}>
            {category.label}
          </span>

          <span className="todo-item-priority" data-priority={priorityId}>
            <Flag className="todo-item-flag" aria-hidden="true" />
            {priority.label}
          </span>
        </div>
      </div>

      <div className="todo-item-actions">
        <IconButton
          ref={editButtonRef}
          Icon={Pencil}
          labelText={`Edit ${title}`}
          onClick={startEditing}
        />

        <IconButton
          Icon={Trash2}
          tone="danger"
          labelText={`Delete ${title}`}
          onClick={handleDelete}
        />
      </div>
    </li>
  )
}
