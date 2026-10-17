import { CATEGORIES, PRIORITIES, TITLE_MAX_LENGTH } from '@/constants'
import { isIsoDate, isPlainObject } from './validation.utils.js'

function isKnownId(options, value) {
  return options.some((option) => option.id === value)
}

function isValidTitle(title) {
  if (typeof title !== 'string') return false

  const trimmedLength = title.trim().length
  const isWithinLimits = trimmedLength > 0 && trimmedLength <= TITLE_MAX_LENGTH

  return isWithinLimits
}

export function sanitizeTodo(value) {
  if (!isPlainObject(value)) return null

  const { id, title, category, priority, completed, createdAt, updatedAt } = value

  if (typeof id !== 'string' || id === '') return null
  if (!isValidTitle(title)) return null
  if (!isKnownId(CATEGORIES, category)) return null
  if (!isKnownId(PRIORITIES, priority)) return null
  if (typeof completed !== 'boolean') return null
  if (!isIsoDate(createdAt) || !isIsoDate(updatedAt)) return null

  return {
    id,
    title: title.trim(),
    category,
    priority,
    completed,
    createdAt,
    updatedAt,
  }
}

export function sanitizeTodos(values) {
  if (!Array.isArray(values)) return []

  const todos = values.map(sanitizeTodo)

  return todos.filter(Boolean)
}

export function replaceTodos(todos, updatedTodos) {
  const replaced = todos.map((todo) => {
    const updated = updatedTodos.find((candidate) => candidate.id === todo.id)

    if (!updated) return todo

    return updated
  })

  return replaced
}

export function patchTodo(todos, todoId, patch) {
  const patched = todos.map((todo) => {
    if (todo.id !== todoId) return todo

    return { ...todo, ...patch }
  })

  return patched
}

export function splitTodosByIds(todos, ids) {
  const removed = todos.filter((todo) => ids.includes(todo.id))
  const remaining = todos.filter((todo) => !ids.includes(todo.id))

  return { removed, remaining }
}

export function appendMissingTodos(todos, restoredTodos) {
  const listedIds = todos.map((todo) => todo.id)
  const missing = restoredTodos.filter((todo) => !listedIds.includes(todo.id))
  const appended = [...todos, ...missing]

  return appended
}

export function setAllCompleted(todos, isCompleted) {
  const updated = todos.map((todo) => ({ ...todo, completed: isCompleted }))

  return updated
}

function compareTodos(first, second) {
  if (first.completed && !second.completed) return 1
  if (!first.completed && second.completed) return -1

  const newestFirst = Date.parse(second.createdAt) - Date.parse(first.createdAt)

  return newestFirst
}

export function sortTodos(todos) {
  const sorted = todos.toSorted(compareTodos)

  return sorted
}
