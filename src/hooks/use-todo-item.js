import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useTodos, useToast } from '@/context'
import { getTodoCheckboxId, matchesFilters } from '@/utils'
import {
  CHECKED_STATUS_SELECTOR,
  TODO_CHECKBOX_SELECTOR,
  TODO_DELETED_MESSAGE,
  UNDO_LABEL,
} from '@/constants'
import { useFilters } from './use-filters.js'

export function useTodoItem(todo) {
  const { id, completed } = todo

  const { toggleTodo, removeTodos, restoreTodos } = useTodos()
  const { showToast } = useToast()

  const { filters } = useFilters()

  const rowRef = useRef(null)
  const editButtonRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)

  const startEditing = () => setIsEditing(true)

  const stopEditing = ({ shouldFocusEditButton }) => {
    flushSync(() => setIsEditing(false))

    if (shouldFocusEditButton) editButtonRef.current.focus()
  }

  const findFocusTarget = () => {
    const row = rowRef.current
    const neighbor = row.nextElementSibling ?? row.previousElementSibling
    const checkbox = neighbor?.querySelector(TODO_CHECKBOX_SELECTOR)

    const statusInput = document.querySelector(CHECKED_STATUS_SELECTOR)
    const focusTarget = checkbox ?? statusInput

    return focusTarget
  }

  const handleToggle = () => {
    const toggledTodo = { ...todo, completed: !completed }

    const isHiddenAfterToggle = !matchesFilters(toggledTodo, filters)
    if (isHiddenAfterToggle) findFocusTarget().focus()

    toggleTodo(id)
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

  return {
    rowRef,
    editButtonRef,
    isEditing,
    handleToggle,
    handleDelete,
    startEditing,
    stopEditing,
  }
}
