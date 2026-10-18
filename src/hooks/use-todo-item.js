import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useTodos, useToast } from '@/context'
import { getTodoCheckboxId, matchesFilters, splitByQuery } from '@/utils'
import {
  CHECKED_STATUS_SELECTOR,
  TODO_CHECKBOX_SELECTOR,
  TODO_DELETED_MESSAGE,
  UNDO_LABEL,
} from '@/constants'
import { useFilters } from './use-filters.js'

export function useTodoItem(todo) {
  const { id, title, completed } = todo

  const { toggleTodo, removeTodos, restoreTodos } = useTodos()
  const { showToast } = useToast()

  const { filters } = useFilters()

  const rowRef = useRef(null)
  const editButtonRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const titleParts = splitByQuery(title, filters.query)

  const startEditing = () => setIsEditing(true)

  const findFocusTarget = () => {
    const row = rowRef.current
    const neighbor = row.nextElementSibling ?? row.previousElementSibling
    const checkbox = neighbor?.querySelector(TODO_CHECKBOX_SELECTOR)

    const statusInput = document.querySelector(CHECKED_STATUS_SELECTOR)
    const focusTarget = checkbox ?? statusInput

    return focusTarget
  }

  const stopEditing = ({ shouldFocusEditButton, savedFields }) => {
    const editedTodo = { ...todo, ...savedFields }

    const isHiddenAfterEdit = !matchesFilters(editedTodo, filters)
    const fallbackTarget = findFocusTarget()

    flushSync(() => setIsEditing(false))

    if (!shouldFocusEditButton) return

    const focusTarget = isHiddenAfterEdit ? fallbackTarget : editButtonRef.current

    focusTarget.focus()
  }

  const handleToggle = () => {
    const toggledTodo = { ...todo, completed: !completed }

    const isHiddenAfterToggle = !matchesFilters(toggledTodo, filters)
    if (isHiddenAfterToggle) findFocusTarget().focus()

    setIsToggling(true)
    requestAnimationFrame(() => setIsToggling(false))

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
    titleParts,
    isEditing,
    isToggling,
    handleToggle,
    handleDelete,
    startEditing,
    stopEditing,
  }
}
