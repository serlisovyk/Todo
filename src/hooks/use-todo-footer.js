import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { useTodos, useToast } from '@/context'
import {
  countActiveTodos,
  getTasksClearedMessage,
  getTasksLeftMessage,
  isRepeatedClick,
} from '@/utils'
import { CHECKED_STATUS_SELECTOR, UNDO_LABEL } from '@/constants'

export function useTodoFooter() {
  const { todos, markAll, clearCompleted, restoreTodos } = useTodos()
  const { showToast } = useToast()

  const markAllDoneButtonRef = useRef(null)
  const markAllActiveButtonRef = useRef(null)
  const clearCompletedButtonRef = useRef(null)

  const activeCount = countActiveTodos(todos)
  const isEmpty = todos.length === 0
  const hasActive = activeCount > 0
  const hasCompleted = activeCount < todos.length
  const tasksLeftMessage = getTasksLeftMessage(activeCount)

  const handleMarkAllDone = (event) => {
    if (isRepeatedClick(event)) return

    flushSync(() => markAll(true))

    markAllActiveButtonRef.current.focus()
  }

  const handleMarkAllActive = (event) => {
    if (isRepeatedClick(event)) return

    flushSync(() => markAll(false))

    markAllDoneButtonRef.current.focus()
  }

  const undoClear = (removed) => {
    flushSync(() => restoreTodos(removed))

    clearCompletedButtonRef.current?.focus()
  }

  const handleClearCompleted = async (event) => {
    if (isRepeatedClick(event)) return

    document.querySelector(CHECKED_STATUS_SELECTOR).focus()

    const removed = await clearCompleted()

    const hasRemoved = removed.length > 0
    if (!hasRemoved) return

    showToast({
      message: getTasksClearedMessage(removed.length),
      actionLabel: UNDO_LABEL,
      onAction: () => undoClear(removed),
    })
  }

  return {
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
  }
}
