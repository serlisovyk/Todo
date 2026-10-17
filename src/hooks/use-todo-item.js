import { useRef } from 'react'
import { flushSync } from 'react-dom'
import { useTodos, useToast } from '@/context'
import { getTodoCheckboxId } from '@/utils'
import {
  TITLE_INPUT_ID,
  TODO_CHECKBOX_SELECTOR,
  TODO_DELETED_MESSAGE,
  UNDO_LABEL,
} from '@/constants'

export function useTodoItem(todo) {
  const { id } = todo

  const { toggleTodo, removeTodos, restoreTodos } = useTodos()
  const { showToast } = useToast()

  const rowRef = useRef(null)

  const handleToggle = () => toggleTodo(id)

  const findFocusTarget = () => {
    const row = rowRef.current
    const neighbor = row.nextElementSibling ?? row.previousElementSibling
    const checkbox = neighbor?.querySelector(TODO_CHECKBOX_SELECTOR)

    const titleInput = document.getElementById(TITLE_INPUT_ID)
    const focusTarget = checkbox ?? titleInput

    return focusTarget
  }

  const undoDelete = (removed) => {
    flushSync(() => restoreTodos(removed))

    document.getElementById(getTodoCheckboxId(id))?.focus()
  }

  const handleDelete = async () => {
    findFocusTarget().focus()

    const removed = await removeTodos([id])

    const hasRemoved = removed.length > 0
    if (!hasRemoved) return

    showToast({
      message: TODO_DELETED_MESSAGE,
      actionLabel: UNDO_LABEL,
      onAction: () => undoDelete(removed),
    })
  }

  return { rowRef, handleToggle, handleDelete }
}
