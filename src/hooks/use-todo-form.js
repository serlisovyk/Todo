import { useActionState, useState } from 'react'
import { useTodos } from '@/context'
import { isValidTitle } from '@/utils'
import {
  EMPTY_TITLE_MESSAGE,
  INITIAL_FORM_FIELDS,
  INITIAL_FORM_RESULT,
  TODO_ADDED_MESSAGE,
} from '@/constants'
import { useTodoFields } from './use-todo-fields.js'

export function useTodoForm() {
  const { addTodo } = useTodos()

  const {
    titleInputRef,
    title,
    category,
    priority,
    setTitle,
    setCategory,
    setPriority,
    handleTitleChange: updateTitle,
  } = useTodoFields(INITIAL_FORM_FIELDS)

  const [hasEdited, setHasEdited] = useState(false)

  const submitTodo = async (previous, formData) => {
    const attempt = previous.attempt + 1

    const submitted = {
      title: formData.get('title'),
      category: formData.get('category'),
      priority: formData.get('priority'),
    }

    setHasEdited(false)
    titleInputRef.current.focus()

    const hasTitle = isValidTitle(submitted.title)
    if (!hasTitle) return { error: EMPTY_TITLE_MESSAGE, attempt }

    const todo = await addTodo(submitted)
    if (!todo) return { attempt }

    setTitle('')

    return { status: TODO_ADDED_MESSAGE, attempt }
  }

  const [result, submitAction] = useActionState(submitTodo, INITIAL_FORM_RESULT)

  const isInvalid = Boolean(result.error) && !hasEdited
  const resultMessage = result.error ?? result.status
  const message = hasEdited ? '' : resultMessage
  const messageKey = result.attempt

  const handleTitleChange = (event) => {
    updateTitle(event)
    setHasEdited(true)
  }

  const preventReset = (event) => event.preventDefault()

  return {
    titleInputRef,
    title,
    category,
    priority,
    message,
    messageKey,
    isInvalid,
    submitAction,
    setCategory,
    setPriority,
    handleTitleChange,
    preventReset,
  }
}
