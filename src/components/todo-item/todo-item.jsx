import { useId } from 'react'
import { Check, Flag, Pencil, Trash2 } from 'lucide-react'
import { TodoEditForm } from '@/components/todo-edit-form'
import { useTodoItem } from '@/hooks'
import { getTodoCheckboxId } from '@/utils'
import { CATEGORIES, PRIORITIES } from '@/constants'
import './todo-item.css'

export function TodoItem({ todo }) {
  const { id, title, completed, category: categoryId, priority: priorityId } = todo

  const {
    rowRef,
    editButtonRef,
    isEditing,
    handleToggle,
    handleDelete,
    startEditing,
    stopEditing,
  } = useTodoItem(todo)

  const metaId = useId()

  if (isEditing) {
    return (
      <li ref={rowRef} className="todo-item">
        <TodoEditForm todo={todo} onClose={stopEditing} />
      </li>
    )
  }

  const category = CATEGORIES.find((candidate) => candidate.id === categoryId)
  const priority = PRIORITIES.find((candidate) => candidate.id === priorityId)

  return (
    <li ref={rowRef} className="todo-item">
      <div className="todo-item-body">
        <label className="todo-item-label">
          <input
            id={getTodoCheckboxId(id)}
            type="checkbox"
            className="todo-item-checkbox"
            checked={completed}
            aria-describedby={metaId}
            onChange={handleToggle}
          />

          <Check className="todo-item-check" aria-hidden="true" />

          <span className="todo-item-title">{title}</span>
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
        <button
          ref={editButtonRef}
          type="button"
          className="todo-item-action"
          aria-label={`Edit ${title}`}
          onClick={startEditing}
        >
          <Pencil className="todo-item-action-icon" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="todo-item-action todo-item-delete"
          aria-label={`Delete ${title}`}
          onClick={handleDelete}
        >
          <Trash2 className="todo-item-action-icon" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
