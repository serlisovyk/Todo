export const STATUS_ALL = 'all'
export const STATUS_ACTIVE = 'active'
export const STATUS_COMPLETED = 'completed'

export const STATUSES = [
  { id: STATUS_ALL, label: 'All' },
  { id: STATUS_ACTIVE, label: 'Active' },
  { id: STATUS_COMPLETED, label: 'Completed' },
]

export const DEFAULT_STATUS = STATUS_ALL
export const DEFAULT_QUERY = ''

export const STATUS_PARAM = 'status'
export const QUERY_PARAM = 'q'
export const FILTERS_CHANGE_EVENT = 'todo:filters'

export const SEARCH_SHORTCUT_KEY = '/'
export const CLEAR_SEARCH_KEY = 'Escape'

export const NO_MATCHES_MESSAGE = 'No tasks match your filters'

export const REGEXP_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g
export const REGEXP_ESCAPE_REPLACEMENT = '\\$&'
export const MATCH_FLAGS = 'gi'

export const STATUS_INPUT_NAME = 'status'
export const CHECKED_STATUS_SELECTOR = `input[name="${STATUS_INPUT_NAME}"]:checked`
