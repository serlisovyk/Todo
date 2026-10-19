export const BACKUP_APP_NAME = 'todo'
export const BACKUP_FILE_NAME_PREFIX = 'todo-backup'
export const BACKUP_FILE_EXTENSION = '.json'
export const BACKUP_MIME_TYPE = 'application/json'
export const BACKUP_FILE_ACCEPT = `${BACKUP_FILE_EXTENSION},${BACKUP_MIME_TYPE}`

const BYTES_PER_MEGABYTE = 1024 * 1024
const BACKUP_MAX_MEGABYTES = 1

export const BACKUP_MAX_BYTES = BACKUP_MAX_MEGABYTES * BYTES_PER_MEGABYTE

export const BACKUP_DATE_LOCALE = 'en-CA'
export const BACKUP_URL_LIFETIME = 10000

export const INITIAL_EXPORT_RESULT = { attempt: 0 }

export const NOT_BACKUP_MESSAGE = "That file isn't a Todo backup"
export const UNREADABLE_BACKUP_MESSAGE = 'That file could not be read'
export const EMPTY_BACKUP_MESSAGE = 'That backup has no tasks'
export const OVERSIZED_BACKUP_MESSAGE = `That file is too large to import (over ${BACKUP_MAX_MEGABYTES} MB)`
export const NOTHING_NEW_PREFIX = 'Nothing new: '
export const NOTHING_TO_EXPORT_MESSAGE = 'There are no tasks to export'
