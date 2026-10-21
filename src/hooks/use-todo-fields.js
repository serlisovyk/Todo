import { useRef, useState } from 'react'
import { limitTitle } from '@/utils'

export function useTodoFields(initialFields) {
  const titleInputRef = useRef(null)

  const [title, setTitle] = useState(initialFields.title)
  const [category, setCategory] = useState(initialFields.category)
  const [priority, setPriority] = useState(initialFields.priority)

  const handleTitleChange = (event) => setTitle(limitTitle(event.target.value))

  return {
    titleInputRef,
    title,
    category,
    priority,
    setTitle,
    setCategory,
    setPriority,
    handleTitleChange,
  }
}
