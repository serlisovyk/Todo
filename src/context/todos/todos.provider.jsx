import { useEffect, useState } from 'react'
import { useToast } from '@/context/toast'
import { createRepository } from '@/storage'
import {
  appendMissingTodos,
  patchTodo,
  replaceTodos,
  setAllCompleted,
  splitTodosByIds,
} from '@/utils'
import { TodosContext } from './todos.context.js'

export function TodosProvider({ children }) {
  const { showToast } = useToast()

  const [repository] = useState(createRepository)
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loaded = await repository.list()

        setTodos(loaded)
      } catch (loadError) {
        setTodos([])
        showToast({ message: loadError.message, isError: true })
      }

      setIsLoading(false)
    }

    loadTodos()

    return repository.subscribe(loadTodos)
  }, [repository, showToast])

  const saveChange = async (rollback, write) => {
    try {
      const result = await write()

      return { isSaved: true, result }
    } catch (writeError) {
      setTodos(rollback)
      showToast({ message: writeError.message, isError: true })

      return { isSaved: false, result: null }
    }
  }

  const addTodo = async (input) => {
    try {
      const todo = await repository.create(input)

      setTodos((current) => [...current, todo])

      return todo
    } catch (createError) {
      showToast({ message: createError.message, isError: true })

      return null
    }
  }

  const updateTodo = async (todoId, patch) => {
    const snapshot = todos

    setTodos((current) => patchTodo(current, todoId, patch))

    const { isSaved, result: updated } = await saveChange(snapshot, () =>
      repository.update(todoId, patch),
    )

    if (!isSaved) return

    setTodos((current) => replaceTodos(current, [updated]))
  }

  const toggleTodo = async (todoId) => {
    const todo = todos.find((candidate) => candidate.id === todoId)

    if (!todo) return

    await updateTodo(todoId, { completed: !todo.completed })
  }

  const removeTodos = async (todoIds) => {
    const snapshot = todos

    const { removed } = splitTodosByIds(todos, todoIds)

    setTodos((current) => splitTodosByIds(current, todoIds).remaining)

    const { isSaved } = await saveChange(snapshot, () => repository.remove(todoIds))
    if (!isSaved) return []

    return removed
  }

  const restoreTodos = async (restoredTodos) => {
    const restoredIds = restoredTodos.map((todo) => todo.id)

    const removeRestored = (current) =>
      splitTodosByIds(current, restoredIds).remaining

    setTodos((current) => appendMissingTodos(current, restoredTodos))

    const { isSaved } = await saveChange(removeRestored, () =>
      repository.restore(restoredTodos),
    )

    return isSaved
  }

  const markAll = async (isCompleted) => {
    const snapshot = todos
    const changed = todos.filter((todo) => todo.completed !== isCompleted)

    setTodos((current) => setAllCompleted(current, isCompleted))

    const { isSaved, result: updated } = await saveChange(snapshot, () =>
      Promise.all(
        changed.map((todo) =>
          repository.update(todo.id, { completed: isCompleted }),
        ),
      ),
    )

    if (!isSaved) return

    setTodos((current) => replaceTodos(current, updated))
  }

  const clearCompleted = async () => {
    const completed = todos.filter((todo) => todo.completed)
    const completedIds = completed.map((todo) => todo.id)

    return removeTodos(completedIds)
  }

  const value = {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodos,
    restoreTodos,
    markAll,
    clearCompleted,
  }

  return <TodosContext value={value}>{children}</TodosContext>
}
