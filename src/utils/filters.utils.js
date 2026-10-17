import {
  DEFAULT_STATUS,
  STATUS_ACTIVE,
  STATUS_COMPLETED,
  STATUS_PARAM,
  STATUSES,
} from '@/constants'

function isStatus(value) {
  return STATUSES.some(({ id }) => id === value)
}

function matchesStatus(todo, status) {
  if (status === STATUS_ACTIVE) return !todo.completed
  if (status === STATUS_COMPLETED) return todo.completed

  return true
}

export function matchesFilters(todo, filters) {
  return matchesStatus(todo, filters.status)
}

export function filterTodos(todos, filters) {
  const filtered = todos.filter((todo) => matchesFilters(todo, filters))

  return filtered
}

export function parseFilters(search) {
  const params = new URLSearchParams(search)
  const queryStatus = params.get(STATUS_PARAM)

  const status = isStatus(queryStatus) ? queryStatus : DEFAULT_STATUS

  return { status }
}

export function buildFiltersSearch(filters) {
  const params = new URLSearchParams()

  if (filters.status !== DEFAULT_STATUS) params.set(STATUS_PARAM, filters.status)

  return params.toString()
}
