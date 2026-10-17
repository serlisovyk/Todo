import { TextButton } from '@/components/text-button'
import { useTodoFooter } from '@/hooks'
import './todo-footer.css'

export function TodoFooter() {
  const {
    markAllDoneButtonRef,
    markAllActiveButtonRef,
    clearCompletedButtonRef,
    isEmpty,
    hasActive,
    hasCompleted,
    tasksLeftMessage,
    handleMarkAllDone,
    handleMarkAllActive,
    handleClearCompleted,
  } = useTodoFooter()

  if (isEmpty) return null

  return (
    <footer className="todo-footer">
      <p className="todo-footer-counter" aria-live="polite" aria-atomic="true">
        {tasksLeftMessage}
      </p>

      {hasActive && (
        <TextButton ref={markAllDoneButtonRef} onClick={handleMarkAllDone}>
          Mark all as done
        </TextButton>
      )}

      {hasCompleted && (
        <TextButton ref={markAllActiveButtonRef} onClick={handleMarkAllActive}>
          Mark all as active
        </TextButton>
      )}

      {hasCompleted && (
        <TextButton ref={clearCompletedButtonRef} onClick={handleClearCompleted}>
          Clear completed
        </TextButton>
      )}
    </footer>
  )
}
