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
