import { useId } from 'react'
import { Flag } from 'lucide-react'
import { PillSelect } from '@/components/pill-select'
import { useTodoEdit } from '@/hooks'
import { CATEGORIES, PRIORITIES, TITLE_MAX_LENGTH } from '@/constants'
import './todo-edit-form.css'

export function TodoEditForm({ todo, onClose }) {
  const {
    titleInputRef,
    title,
    category,
    priority,
    setCategory,
    setPriority,
    handleTitleChange,
    saveAction,
    handleBlur,
  } = useTodoEdit(todo, onClose)

  const titleId = useId()

  return (
    <form className="todo-edit-form" action={saveAction} onBlur={handleBlur}>
      <label className="sr-only" htmlFor={titleId}>
        Task title
      </label>

      <input
        ref={titleInputRef}
        id={titleId}
        className="todo-edit-form-title"
        type="text"
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        autoComplete="off"
        onChange={handleTitleChange}
      />

      <PillSelect
        labelText="Category"
        options={CATEGORIES}
        value={category}
        onChange={setCategory}
      >
        <span className="todo-edit-form-dot" data-category={category} />
      </PillSelect>

      <PillSelect
        labelText="Priority"
        options={PRIORITIES}
        value={priority}
        onChange={setPriority}
      >
        <Flag className="todo-edit-form-flag" data-priority={priority} />
      </PillSelect>
    </form>
  )
}
