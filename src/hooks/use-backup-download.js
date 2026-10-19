import { buildBackup, getBackupFileName } from '@/utils'
import { BACKUP_MIME_TYPE, BACKUP_URL_LIFETIME } from '@/constants'

export function useBackupDownload() {
  const downloadBackup = (todos) => {
    const exportedAt = new Date()
    const backup = buildBackup(todos, exportedAt.toISOString())

    const blob = new Blob([JSON.stringify(backup)], { type: BACKUP_MIME_TYPE })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = getBackupFileName(exportedAt)
    link.click()

    setTimeout(() => URL.revokeObjectURL(url), BACKUP_URL_LIFETIME)
  }

  return downloadBackup
}
