import { useRef } from 'react'
import { useTodos, useToast } from '@/context'
import { getImportMessage, parseBackup, splitBackupTodos } from '@/utils'
import {
  BACKUP_MAX_BYTES,
  NOT_BACKUP_MESSAGE,
  OVERSIZED_BACKUP_MESSAGE,
  UNREADABLE_BACKUP_MESSAGE,
} from '@/constants'
import { useBackupDownload } from './use-backup-download.js'

export function useTodoBackup() {
  const { todos, restoreTodos } = useTodos()
  const { showToast } = useToast()

  const fileInputRef = useRef(null)

  const downloadBackup = useBackupDownload()

  const hasTodos = todos.length > 0

  const showError = (message) => showToast({ message, isError: true })

  const handleExport = () => downloadBackup(todos)

  const handleImportClick = () => fileInputRef.current.click()

  const importFile = async (file) => {
    const isTooLarge = file.size > BACKUP_MAX_BYTES
    if (isTooLarge) {
      showError(OVERSIZED_BACKUP_MESSAGE)
      return
    }

    const text = await file.text().catch(() => null)

    if (text === null) {
      showError(UNREADABLE_BACKUP_MESSAGE)
      return
    }

    const values = parseBackup(text)

    if (!values) {
      showError(NOT_BACKUP_MESSAGE)
      return
    }

    const { newTodos, existingCount, skippedCount } = splitBackupTodos(values, todos)

    const isSaved = await restoreTodos(newTodos)
    if (!isSaved) return

    const importedCount = newTodos.length
    const message = getImportMessage({ importedCount, existingCount, skippedCount })

    showToast({ message })
  }

  const handleFileChange = (event) => {
    const input = event.currentTarget

    const [file] = input.files

    input.value = ''

    if (!file) return

    importFile(file)
  }

  return {
    fileInputRef,
    hasTodos,
    handleExport,
    handleImportClick,
    handleFileChange,
  }
}
