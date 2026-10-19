import { useEffect, useRef, useState } from 'react'
import { createRepository } from '@/storage'
import {
  INITIAL_EXPORT_RESULT,
  LOAD_ERROR_MESSAGE,
  NOTHING_TO_EXPORT_MESSAGE,
} from '@/constants'
import { useBackupDownload } from './use-backup-download.js'

export function useErrorScreen() {
  const headingRef = useRef(null)

  const downloadBackup = useBackupDownload()

  const [exportResult, setExportResult] = useState(INITIAL_EXPORT_RESULT)

  const { message, attempt } = exportResult

  useEffect(() => {
    headingRef.current.focus()
  }, [])

  const showMessage = (nextMessage) =>
    setExportResult((current) => ({
      message: nextMessage,
      attempt: current.attempt + 1,
    }))

  const readTodos = async () => {
    try {
      return await createRepository().list()
    } catch {
      return null
    }
  }

  const handleExport = async () => {
    const todos = await readTodos()

    if (!todos) {
      showMessage(LOAD_ERROR_MESSAGE)
      return
    }

    const isEmpty = todos.length === 0
    if (isEmpty) {
      showMessage(NOTHING_TO_EXPORT_MESSAGE)
      return
    }

    downloadBackup(todos)
  }

  const handleReload = () => location.reload()

  return { headingRef, message, attempt, handleExport, handleReload }
}
