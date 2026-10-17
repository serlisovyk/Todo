import { useEffect, useRef, useState } from 'react'
import { useTodos } from '@/context'
import { isValidTitle } from '@/utils'
import { CANCEL_EDIT_KEY } from '@/constants'

export function useTodoEdit(todo, onClose) {
  const {
    id,
    title: savedTitle,
    category: savedCategory,
    priority: savedPriority,
  } = todo

  const { updateTodo } = useTodos()

  const titleInputRef = useRef(null)

  const [title, setTitle] = useState(savedTitle)
  const [category, setCategory] = useState(savedCategory)
  const [priority, setPriority] = useState(savedPriority)

  useEffect(() => {
    titleInputRef.current.focus()
    titleInputRef.current.select()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== CANCEL_EDIT_KEY) return

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
    if (!canSave) return

    updateTodo(id, { title: trimmedTitle, category, priority })
  }

  const handleTitleChange = (event) => setTitle(event.target.value)

  const saveAction = () => {
    saveChanges()
    onClose({ shouldFocusEditButton: true })
  }

  const handleCancel = () => onClose({ shouldFocusEditButton: true })

  const keepFocus = (event) => event.preventDefault()

  const handleBlur = (event) => {
    const isStillInside = event.currentTarget.contains(event.relatedTarget)
    if (isStillInside) return

    saveChanges()
    onClose({ shouldFocusEditButton: false })
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
