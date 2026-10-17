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
export const TITLE_INPUT_ID = 'todo-title'
export const TODO_CHECKBOX_SELECTOR = 'input[type="checkbox"]'
export const CANCEL_EDIT_KEY = 'Escape'

export const EMPTY_TITLE_MESSAGE = 'Enter a task title.'
export const TODO_ADDED_MESSAGE = 'Task added'
export const TODO_DELETED_MESSAGE = 'Task deleted'
export const UNDO_LABEL = 'Undo'

export const PLURAL_LOCALE = 'en'
export const TASK_NOUNS = { one: 'task', other: 'tasks' }

export const INITIAL_FORM_RESULT = { attempt: 0 }

export const MISSING_TODOS_PROVIDER_MESSAGE =
  'useTodos must be used inside TodosProvider.'
