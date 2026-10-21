import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useTodos, useToast } from '@/context'
import { isRepeatedClick, matchesFilters } from '@/utils'
import {
  CHECKED_STATUS_SELECTOR,
  TODO_DELETED_MESSAGE,
  UNDO_LABEL,
} from '@/constants'
import { useFilters } from './use-filters.js'

export function useTodoItem(todo, neighborId, checkboxesRef) {
  const { id, completed } = todo

  const { toggleTodo, removeTodos, restoreTodos } = useTodos()
  const { showToast } = useToast()

  const { filters } = useFilters()

  const editButtonRef = useRef(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const { query } = filters

  const registerCheckbox = (checkbox) => {
    checkboxesRef.current.set(id, checkbox)

    return () => checkboxesRef.current.delete(id)
  }

  const startEditing = () => setIsEditing(true)

  const findFocusTarget = () => {
    const neighborCheckbox = checkboxesRef.current.get(neighborId)
    const statusInput = document.querySelector(CHECKED_STATUS_SELECTOR)

    const focusTarget = neighborCheckbox ?? statusInput

    return focusTarget
  }

  const stopEditing = ({ shouldFocusEditButton, savedFields }) => {
    if (!shouldFocusEditButton) {
      flushSync(() => setIsEditing(false))
      return
    }

    const editedTodo = { ...todo, ...savedFields }

    const isHiddenAfterEdit = !matchesFilters(editedTodo, filters)
    const fallbackTarget = findFocusTarget()

    flushSync(() => setIsEditing(false))

    const focusTarget = isHiddenAfterEdit ? fallbackTarget : editButtonRef.current

    focusTarget.focus()
  }

  const ignoreRepeatedClick = (event) => {
    if (!isRepeatedClick(event)) return

    event.preventDefault()
    event.stopPropagation()
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

    checkboxesRef.current.get(id)?.focus()
  }

  const handleDelete = async (event) => {
    if (isRepeatedClick(event)) return

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
    editButtonRef,
    query,
    isEditing,
    isToggling,
    registerCheckbox,
    ignoreRepeatedClick,
    handleToggle,
    handleDelete,
    startEditing,
    stopEditing,
  }
}
