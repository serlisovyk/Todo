import { useEffect } from 'react'
import { useTodos } from '@/context'
import { isValidTitle } from '@/utils'
import { CANCEL_EDIT_KEY, PICKER_OPTION_SELECTOR } from '@/constants'
import { useMousePressed } from './use-mouse-pressed.js'
import { useTodoFields } from './use-todo-fields.js'

export function useTodoEdit(todo, onClose) {
  const {
    id,
    title: savedTitle,
    category: savedCategory,
    priority: savedPriority,
  } = todo

  const { updateTodo } = useTodos()

  const isMousePressedRef = useMousePressed()

  const {
    titleInputRef,
    title,
    category,
    priority,
    setCategory,
    setPriority,
    handleTitleChange,
  } = useTodoFields(todo)

  useEffect(() => {
    titleInputRef.current.focus()
    titleInputRef.current.select()
  }, [titleInputRef])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== CANCEL_EDIT_KEY) return

      const pickerOption = event.target.closest(PICKER_OPTION_SELECTOR)
      if (pickerOption) return

      onClose({ shouldFocusEditButton: true })
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const saveChanges = () => {
    const trimmedTitle = title.trim()

    const isTitleChanged = trimmedTitle !== savedTitle
    const isCategoryChanged = category !== savedCategory
    const isPriorityChanged = priority !== savedPriority
    const isChanged = isTitleChanged || isCategoryChanged || isPriorityChanged

    const canSave = isValidTitle(title) && isChanged
    if (!canSave) return {}

    const savedFields = { title: trimmedTitle, category, priority }

    updateTodo(id, savedFields)

    return savedFields
  }

  const saveAction = () => {
    const savedFields = saveChanges()

    onClose({ shouldFocusEditButton: true, savedFields })
  }

  const handleCancel = () => onClose({ shouldFocusEditButton: true })

  const keepFocus = (event) => event.preventDefault()

  const closeForm = () => onClose({ shouldFocusEditButton: false })

  const handleBlur = (event) => {
    const isStillInside = event.currentTarget.contains(event.relatedTarget)
    if (isStillInside) return

    saveChanges()

    const isPressed = isMousePressedRef.current
    if (!isPressed) {
      closeForm()
      return
    }

    document.addEventListener('click', closeForm, { once: true })
  }

  return {
    titleInputRef,
    title,
    category,
    priority,
    setCategory,
    setPriority,
    handleTitleChange,
    saveAction,
    handleCancel,
    keepFocus,
    handleBlur,
  }
}
