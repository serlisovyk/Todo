import { useRef } from 'react'
import { TodoItem } from '@/components/todo-item'
import { useTodos } from '@/context'
import { useFilters } from '@/hooks'
import { filterTodos, getEmptyListMessage, sortTodos } from '@/utils'
import './todo-list.css'

export function TodoList() {
  const { todos, isLoading } = useTodos()

  const { filters } = useFilters()

  const checkboxesRef = useRef(new Map())

  if (isLoading) return <p className="todo-list-message">Loading tasks…</p>

  const isEmpty = todos.length === 0
  if (isEmpty) {
    return (
      <p className="todo-list-message">No tasks yet. Add your first one above.</p>
    )
  }

  const visibleTodos = filterTodos(todos, filters)

  const hasVisible = visibleTodos.length > 0
  if (!hasVisible) {
    const emptyMessage = getEmptyListMessage(todos, filters)

    return <p className="todo-list-message">{emptyMessage}</p>
  }

  const sortedTodos = sortTodos(visibleTodos, filters.sort)

  const items = sortedTodos.map((todo, index) => {
    const neighbor = sortedTodos[index + 1] ?? sortedTodos[index - 1]

    return (
      <TodoItem
        key={todo.id}
        todo={todo}
        neighborId={neighbor?.id}
        checkboxesRef={checkboxesRef}
      />
    )
  })

  return <ul className="todo-list">{items}</ul>
}
