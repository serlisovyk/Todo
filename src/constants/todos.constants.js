export const CATEGORIES = [
  { id: 'work', label: 'Work' },
  { id: 'personal', label: 'Personal' },
  { id: 'study', label: 'Study' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'health', label: 'Health' },
]

export const PRIORITIES = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
]

export const DEFAULT_CATEGORY = 'work'
export const DEFAULT_PRIORITY = 'medium'

export const TITLE_MAX_LENGTH = 200

export const EMPTY_TITLE_MESSAGE = 'Enter a task title.'
export const TODO_ADDED_MESSAGE = 'Task added'

export const INITIAL_FORM_RESULT = { attempt: 0 }

export const MISSING_TODOS_PROVIDER_MESSAGE =
  'useTodos must be used inside TodosProvider.'
