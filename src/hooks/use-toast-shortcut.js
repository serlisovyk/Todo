import { useEffect } from 'react'
import {
  EDITABLE_FIELD_SELECTOR,
  UNDO_SHORTCUT_CODE,
  UNDO_SHORTCUT_KEY,
} from '@/constants'

export function useToastShortcut(onAction) {
  useEffect(() => {
    if (!onAction) return

    const handleKeyDown = (event) => {
      const hasModifier = event.ctrlKey || event.metaKey
      if (!hasModifier) return

      const isUndoKey =
        event.key.toLowerCase() === UNDO_SHORTCUT_KEY ||
        event.code === UNDO_SHORTCUT_CODE

      const isUndoShortcut = isUndoKey && !event.shiftKey && !event.altKey
      if (!isUndoShortcut) return

      const editableField = event.target.closest(EDITABLE_FIELD_SELECTOR)
      if (editableField) return

      event.preventDefault()
      onAction()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onAction])
}
