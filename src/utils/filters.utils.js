import {
  CATEGORY_ALL,
  CATEGORY_FILTERS,
  CATEGORY_PARAM,
  DEFAULT_CATEGORY_FILTER,
  DEFAULT_QUERY,
  DEFAULT_SORT,
  DEFAULT_STATUS,
  QUERY_PARAM,
  SORT_PARAM,
  SORTS,
  STATUS_ACTIVE,
  STATUS_COMPLETED,
  STATUS_PARAM,
  STATUSES,
} from '@/constants'
import { isKnownId } from './validation.utils.js'

function matchesStatus(todo, status) {
  if (status === STATUS_ACTIVE) return !todo.completed
  if (status === STATUS_COMPLETED) return todo.completed

  return true
}

function matchesCategory(todo, category) {
  if (category === CATEGORY_ALL) return true

  const isSameCategory = todo.category === category

  return isSameCategory
}

function matchesQuery(todo, query) {
  const normalizedQuery = query.trim().toLowerCase()
  const normalizedTitle = todo.title.toLowerCase()

  return normalizedTitle.includes(normalizedQuery)
}

export function matchesFilters(todo, filters) {
  const isStatusMatch = matchesStatus(todo, filters.status)
  const isCategoryMatch = matchesCategory(todo, filters.category)
  const isQueryMatch = matchesQuery(todo, filters.query)

  return isStatusMatch && isCategoryMatch && isQueryMatch
}

export function filterTodos(todos, filters) {
  const filtered = todos.filter((todo) => matchesFilters(todo, filters))

  return filtered
}

export function canResetFilters(filters) {
  const isCategoryChosen = filters.category !== DEFAULT_CATEGORY_FILTER
  const isSortChosen = filters.sort !== DEFAULT_SORT

  return isCategoryChosen || isSortChosen
}

export function parseFilters(search) {
  const params = new URLSearchParams(search)
  const queryStatus = params.get(STATUS_PARAM)
  const queryCategory = params.get(CATEGORY_PARAM)
  const querySort = params.get(SORT_PARAM)

  const isStatusKnown = isKnownId(STATUSES, queryStatus)
  const isCategoryKnown = isKnownId(CATEGORY_FILTERS, queryCategory)
  const isSortKnown = isKnownId(SORTS, querySort)

  const status = isStatusKnown ? queryStatus : DEFAULT_STATUS
  const category = isCategoryKnown ? queryCategory : DEFAULT_CATEGORY_FILTER
  const sort = isSortKnown ? querySort : DEFAULT_SORT
  const query = params.get(QUERY_PARAM) ?? DEFAULT_QUERY

  return { status, category, sort, query }
}

export function buildFiltersSearch(filters) {
  const params = new URLSearchParams()

  if (filters.status !== DEFAULT_STATUS) params.set(STATUS_PARAM, filters.status)

  if (filters.category !== DEFAULT_CATEGORY_FILTER) {
    params.set(CATEGORY_PARAM, filters.category)
  }

  if (filters.sort !== DEFAULT_SORT) params.set(SORT_PARAM, filters.sort)

  const hasQuery = filters.query.trim() !== DEFAULT_QUERY
  if (hasQuery) params.set(QUERY_PARAM, filters.query)

  return params.toString()
}

export function getFiltersKey(filters) {
  const trimmedFilters = { ...filters, query: filters.query.trim() }

  return buildFiltersSearch(trimmedFilters)
}
