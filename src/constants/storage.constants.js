export const DATA_STORAGE_KEY = 'todo:data'
export const DATA_FORMAT_VERSION = 1

export const STORAGE_MODE_INDEXED_DB = 'indexeddb'
export const INDEXED_DB_NAME = 'todo'
export const INDEXED_DB_VERSION = 1
export const INDEXED_DB_STORE_NAME = 'todos'
export const INDEXED_DB_KEY_PATH = 'id'
export const BROADCAST_CHANNEL_NAME = 'todo'

export const INVALID_TODO_MESSAGE = 'The task has an invalid field.'
export const MISSING_TODO_MESSAGE = 'The task no longer exists.'
export const SAVE_ERROR_MESSAGE =
  'Your tasks could not be saved. The browser storage may be full or blocked.'
export const LOAD_ERROR_MESSAGE =
  'Your tasks could not be loaded. The browser storage may be blocked or unavailable.'
export const OPEN_ERROR_MESSAGE =
  'The browser storage could not be opened. It may be blocked or unavailable in private browsing.'
export const NOT_IMPLEMENTED_MESSAGE = 'Not implemented'
