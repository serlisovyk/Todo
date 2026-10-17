import {
  DEFAULT_QUERY,
  DEFAULT_STATUS,
  QUERY_PARAM,
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

function matchesQuery(todo, query) {
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedTitle = todo.title.toLowerCase()

  return normalizedTitle.includes(normalizedQuery)
}

export function matchesFilters(todo, filters) {
  const isStatusMatch = matchesStatus(todo, filters.status)
  const isQueryMatch = matchesQuery(todo, filters.query)

  return isStatusMatch && isQueryMatch
}

export function filterTodos(todos, filters) {
  const filtered = todos.filter((todo) => matchesFilters(todo, filters))

  return filtered
}

export function parseFilters(search) {
  const params = new URLSearchParams(search)
  const queryStatus = params.get(STATUS_PARAM)

  const status = isStatus(queryStatus) ? queryStatus : DEFAULT_STATUS
  const query = params.get(QUERY_PARAM) ?? DEFAULT_QUERY

  return { status, query }
}

export function buildFiltersSearch(filters) {
  const params = new URLSearchParams()

  if (filters.status !== DEFAULT_STATUS) params.set(STATUS_PARAM, filters.status)

  const hasQuery = filters.query.trim() !== DEFAULT_QUERY
  if (hasQuery) params.set(QUERY_PARAM, filters.query)

  return params.toString()
}

export function getFiltersKey(filters) {
  const trimmedFilters = { ...filters, query: filters.query.trim() }

  return buildFiltersSearch(trimmedFilters)
}
