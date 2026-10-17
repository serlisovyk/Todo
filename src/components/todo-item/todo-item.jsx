import { useId } from 'react'
import { Check, Flag } from 'lucide-react'
import { useTodos } from '@/context'
import { CATEGORIES, PRIORITIES } from '@/constants'
import './todo-item.css'

export function TodoItem({ todo }) {
  const { id, title, completed, category: categoryId, priority: priorityId } = todo

  const { toggleTodo } = useTodos()

  const metaId = useId()

  const category = CATEGORIES.find((candidate) => candidate.id === categoryId)
  const priority = PRIORITIES.find((candidate) => candidate.id === priorityId)

  return (
    <li className="todo-item">
      <label className="todo-item-label">
        <input
          type="checkbox"
          className="todo-item-checkbox"
          checked={completed}
          aria-describedby={metaId}
          onChange={() => toggleTodo(id)}
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
    </li>
  )
}
