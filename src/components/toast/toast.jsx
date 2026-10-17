import { CircleAlert } from 'lucide-react'
import { useToastShortcut, useToastTimer } from '@/hooks'
import { UNDO_ARIA_KEYSHORTCUTS } from '@/constants'
import './toast.css'

export function Toast({ toast, onDismiss }) {
  const { message, isError, actionLabel, onAction } = toast

  const { handleMouseEnter, handleMouseLeave, handleFocus, handleBlur } =
    useToastTimer(onDismiss)

  const handleAction = () => {
    onAction()
    onDismiss()
  }

  const shortcutAction = onAction ? handleAction : null

  useToastShortcut(shortcutAction)

  return (
    <div
      className="toast"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <p className="toast-message">
        {isError && <CircleAlert className="toast-icon" aria-hidden="true" />}
        {message}
      </p>

      {actionLabel && (
        <button
          className="toast-action"
          type="button"
          aria-keyshortcuts={UNDO_ARIA_KEYSHORTCUTS}
          onClick={handleAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
