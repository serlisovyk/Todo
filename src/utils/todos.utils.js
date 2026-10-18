import {
  CATEGORIES,
  NO_MATCHES_MESSAGE,
  PLURAL_LOCALE,
  PRIORITIES,
  SORT_OLDEST,
  SORT_PRIORITY,
  TASK_NOUNS,
  TITLE_MAX_LENGTH,
} from '@/constants'
import { isIsoDate, isKnownId, isPlainObject } from './validation.utils.js'

export function formatTaskCount(count) {
  const pluralForm = new Intl.PluralRules(PLURAL_LOCALE).select(count)
  const noun = TASK_NOUNS[pluralForm]

  return `${count} ${noun}`
}

export function getTodoCheckboxId(todoId) {
  return `todo-checkbox-${todoId}`
}

export function isValidTitle(title) {
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

export function countActiveTodos(todos) {
  const active = todos.filter((todo) => !todo.completed)

  return active.length
}

export function setAllCompleted(todos, isCompleted) {
  const updated = todos.map((todo) => ({ ...todo, completed: isCompleted }))

  return updated
}

function compareCompletion(first, second) {
  if (first.completed && !second.completed) return 1
  if (!first.completed && second.completed) return -1

  return 0
}

function compareNewestFirst(first, second) {
  const newestFirst = Date.parse(second.createdAt) - Date.parse(first.createdAt)

  return newestFirst
}

function compareOldestFirst(first, second) {
  const oldestFirst = Date.parse(first.createdAt) - Date.parse(second.createdAt)

  return oldestFirst
}

function getPriorityRank(priorityId) {
  return PRIORITIES.findIndex(({ id }) => id === priorityId)
}

function comparePriority(first, second) {
  const firstRank = getPriorityRank(first.priority)
  const secondRank = getPriorityRank(second.priority)

  const highestFirst = secondRank - firstRank
  if (highestFirst !== 0) return highestFirst

  return compareNewestFirst(first, second)
}

function getSortComparator(sort) {
  if (sort === SORT_OLDEST) return compareOldestFirst
  if (sort === SORT_PRIORITY) return comparePriority

  return compareNewestFirst
}

export function sortTodos(todos, sort) {
  const compareBySort = getSortComparator(sort)

  const compareTodos = (first, second) => {
    const completionOrder = compareCompletion(first, second)
    if (completionOrder !== 0) return completionOrder

    return compareBySort(first, second)
  }

  const sorted = todos.toSorted(compareTodos)

  return sorted
}

export function getTasksLeftMessage(count) {
  const taskCount = formatTaskCount(count)

  return `${taskCount} left`
}

export function getTasksClearedMessage(count) {
  const taskCount = formatTaskCount(count)

  return `${taskCount} cleared`
}

export function getTasksShownMessage(count) {
  if (count === 0) return NO_MATCHES_MESSAGE

  const taskCount = formatTaskCount(count)

  return `${taskCount} shown`
}
