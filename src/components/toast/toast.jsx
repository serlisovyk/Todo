import { CircleAlert } from 'lucide-react'
import { useToastExit, useToastShortcut, useToastTimer } from '@/hooks'
import { UNDO_ARIA_KEYSHORTCUTS } from '@/constants'
import './toast.css'

export function Toast({ toast, onDismiss }) {
  const { message, isError, actionLabel, onAction } = toast

  const { isLeaving, dismiss, handleTransitionEnd } = useToastExit(onDismiss)

  const { handleMouseEnter, handleMouseLeave, handleFocus, handleBlur } =
    useToastTimer(dismiss)

  const handleAction = () => {
    onAction()
    dismiss()
  }

  const canRunAction = Boolean(onAction) && !isLeaving
  const shortcutAction = canRunAction ? handleAction : null

  useToastShortcut(shortcutAction)

  const className = isLeaving ? 'toast is-leaving' : 'toast'

  return (
    <div
      className={className}
      inert={isLeaving}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onTransitionEnd={handleTransitionEnd}
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
