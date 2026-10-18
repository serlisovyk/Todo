import { CATEGORIES } from './todos.constants.js'

export const STATUS_ALL = 'all'
export const STATUS_ACTIVE = 'active'
export const STATUS_COMPLETED = 'completed'

export const STATUSES = [
  { id: STATUS_ALL, label: 'All' },
  { id: STATUS_ACTIVE, label: 'Active' },
  { id: STATUS_COMPLETED, label: 'Completed' },
]

export const CATEGORY_ALL = 'all'

export const CATEGORY_FILTERS = [
  { id: CATEGORY_ALL, label: 'All categories' },
  ...CATEGORIES,
]

export const SORT_NEWEST = 'newest'
export const SORT_OLDEST = 'oldest'
export const SORT_PRIORITY = 'priority'

export const SORTS = [
  { id: SORT_NEWEST, label: 'Newest first' },
  { id: SORT_OLDEST, label: 'Oldest first' },
  { id: SORT_PRIORITY, label: 'Priority' },
]

export const DEFAULT_STATUS = STATUS_ALL
export const DEFAULT_CATEGORY_FILTER = CATEGORY_ALL
export const DEFAULT_SORT = SORT_NEWEST
export const DEFAULT_QUERY = ''

export const PANEL_DEFAULTS = {
  category: DEFAULT_CATEGORY_FILTER,
  sort: DEFAULT_SORT,
}

export const STATUS_PARAM = 'status'
export const CATEGORY_PARAM = 'category'
export const SORT_PARAM = 'sort'
export const QUERY_PARAM = 'q'
export const FILTERS_CHANGE_EVENT = 'todo:filters'

export const SEARCH_SHORTCUT_KEY = '/'
export const CLEAR_SEARCH_KEY = 'Escape'
export const CLOSE_FILTERS_KEY = 'Escape'

export const NO_MATCHES_MESSAGE = 'No tasks match your filters'

export const REGEXP_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g
export const REGEXP_ESCAPE_REPLACEMENT = '\\$&'
export const MATCH_FLAGS = 'gi'

export const STATUS_INPUT_NAME = 'status'
export const CATEGORY_INPUT_NAME = 'category'
export const SORT_INPUT_NAME = 'sort'
export const CHECKED_STATUS_SELECTOR = `input[name="${STATUS_INPUT_NAME}"]:checked`
export const CHECKED_CATEGORY_SELECTOR = `input[name="${CATEGORY_INPUT_NAME}"]:checked`
