import { TextButton } from '@/components/text-button'
import { useTodoBackup } from '@/hooks'
import { BACKUP_FILE_ACCEPT } from '@/constants'
import './todo-backup.css'

export function TodoBackup() {
  const {
    fileInputRef,
    hasTodos,
    handleExport,
    handleImportClick,
    handleFileChange,
  } = useTodoBackup()

  return (
    <div className="todo-backup" role="group" aria-label="Backup">
      {hasTodos && <TextButton onClick={handleExport}>Export</TextButton>}

      <TextButton onClick={handleImportClick}>Import</TextButton>

      <input
        ref={fileInputRef}
        type="file"
        accept={BACKUP_FILE_ACCEPT}
        hidden
        onChange={handleFileChange}
      />
    </div>
  )
}
