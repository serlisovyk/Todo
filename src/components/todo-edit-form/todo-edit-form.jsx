import { useId } from 'react'
import { Check, Flag, X } from 'lucide-react'
import { CategoryDot } from '@/components/category-dot'
import { IconButton } from '@/components/icon-button'
import { PillSelect } from '@/components/pill-select'
import { TitleCounter } from '@/components/title-counter'
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
    handleCancel,
    keepFocus,
    handleBlur,
  } = useTodoEdit(todo, onClose)

  const titleId = useId()

  const counterId = `${titleId}-counter`

  return (
    <form className="todo-edit-form" action={saveAction} onBlur={handleBlur}>
      <div className="todo-edit-form-field">
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
          aria-describedby={counterId}
          onChange={handleTitleChange}
        />

        <TitleCounter id={counterId} length={title.length} />
      </div>

      <PillSelect
        labelText="Category"
        options={CATEGORIES}
        value={category}
        onChange={setCategory}
        renderMark={(categoryId) => <CategoryDot categoryId={categoryId} />}
      />

      <PillSelect
        labelText="Priority"
        options={PRIORITIES}
        value={priority}
        onChange={setPriority}
        renderMark={(priorityId) => (
          <Flag className="todo-edit-form-flag" data-priority={priorityId} />
        )}
      />

      <div className="todo-edit-form-actions">
        <IconButton
          Icon={Check}
          type="submit"
          labelText="Save"
          onMouseDown={keepFocus}
        />

        <IconButton
          Icon={X}
          labelText="Cancel"
          onMouseDown={keepFocus}
          onClick={handleCancel}
        />
      </div>
    </form>
  )
}
