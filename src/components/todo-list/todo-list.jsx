import { TodoItem } from '@/components/todo-item'
import { useTodos } from '@/context'
import { sortTodos } from '@/utils'
import './todo-list.css'

export function TodoList() {
  const { todos, isLoading } = useTodos()

  if (isLoading) return <p className="todo-list-message">Loading tasks…</p>

  const isEmpty = todos.length === 0
  if (isEmpty) {
    return (
      <p className="todo-list-message">No tasks yet. Add your first one above.</p>
    )
  }

  const sortedTodos = sortTodos(todos)
  const items = sortedTodos.map((todo) => <TodoItem key={todo.id} todo={todo} />)

  return <ul className="todo-list">{items}</ul>
}
