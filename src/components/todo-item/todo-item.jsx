import { useId } from 'react'
import { Check, Flag, Pencil, Trash2 } from 'lucide-react'
import { IconButton } from '@/components/icon-button'
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
    titleParts,
    isEditing,
    isToggling,
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

  const titleNodes = titleParts.map(({ start, text, isMatch }) =>
    isMatch ? (
      <mark key={start} className="todo-item-mark">
        {text}
      </mark>
    ) : (
      text
    ),
  )

  return (
    <li ref={rowRef} className="todo-item" data-toggling={isToggling}>
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

          <span className="todo-item-title">{titleNodes}</span>
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
