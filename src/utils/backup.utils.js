import {
  BACKUP_APP_NAME,
  BACKUP_DATE_LOCALE,
  BACKUP_FILE_EXTENSION,
  BACKUP_FILE_NAME_PREFIX,
  DATA_FORMAT_VERSION,
  EMPTY_BACKUP_MESSAGE,
  NOTHING_NEW_PREFIX,
} from '@/constants'
import { parseJson } from './json.utils.js'
import { formatTaskCount, sanitizeTodos } from './todos.utils.js'
import { isPlainObject } from './validation.utils.js'

export function buildBackup(todos, exportedAt) {
  return { app: BACKUP_APP_NAME, version: DATA_FORMAT_VERSION, exportedAt, todos }
}

export function getBackupFileName(date) {
  const day = date.toLocaleDateString(BACKUP_DATE_LOCALE)

  return `${BACKUP_FILE_NAME_PREFIX}-${day}${BACKUP_FILE_EXTENSION}`
}

export function parseBackup(text) {
  const backup = parseJson(text)

  if (!isPlainObject(backup)) return null
  if (backup.app !== BACKUP_APP_NAME) return null
  if (backup.version !== DATA_FORMAT_VERSION) return null
  if (!Array.isArray(backup.todos)) return null

  return backup.todos
}

export function splitBackupTodos(values, storedTodos) {
  const knownIds = new Set(storedTodos.map((todo) => todo.id))
  const validTodos = sanitizeTodos(values)
  const newTodos = []

  for (const todo of validTodos) {
    if (knownIds.has(todo.id)) continue

    knownIds.add(todo.id)
    newTodos.push(todo)
  }

  const existingCount = validTodos.length - newTodos.length
  const skippedCount = values.length - validTodos.length

  return { newTodos, existingCount, skippedCount }
}

export function getImportMessage({ importedCount, existingCount, skippedCount }) {
  const hasImported = importedCount > 0
  const parts = []

  if (hasImported) parts.push(`Imported ${formatTaskCount(importedCount)}`)
  if (existingCount > 0) parts.push(`${existingCount} already there`)
  if (skippedCount > 0) parts.push(`${skippedCount} skipped`)

  const hasParts = parts.length > 0
  if (!hasParts) return EMPTY_BACKUP_MESSAGE

  const summary = parts.join(', ')

  if (hasImported) return summary

  return `${NOTHING_NEW_PREFIX}${summary}`
}
