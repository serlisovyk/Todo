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
        <button
          ref={markAllDoneButtonRef}
          type="button"
          className="todo-footer-action"
          onClick={handleMarkAllDone}
        >
          Mark all as done
        </button>
      )}

      {hasCompleted && (
        <button
          ref={markAllActiveButtonRef}
          type="button"
          className="todo-footer-action"
          onClick={handleMarkAllActive}
        >
          Mark all as active
        </button>
      )}

      {hasCompleted && (
        <button
          ref={clearCompletedButtonRef}
          type="button"
          className="todo-footer-action"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  )
}
