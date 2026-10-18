import { Flag, Plus } from 'lucide-react'
import { CategoryDot } from '@/components/category-dot'
import { PillSelect } from '@/components/pill-select'
import { useTodoForm } from '@/hooks'
import {
  CATEGORIES,
  PRIORITIES,
  TITLE_INPUT_ID,
  TITLE_MAX_LENGTH,
} from '@/constants'
import './todo-form.css'

export function TodoForm() {
  const {
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
  } = useTodoForm()

  const errorId = `${TITLE_INPUT_ID}-error`

  return (
    <form className="todo-form" action={submitAction} onReset={preventReset}>
      <div className="todo-form-field">
        <label className="sr-only" htmlFor={TITLE_INPUT_ID}>
          Task title
        </label>

        <input
          ref={titleInputRef}
          id={TITLE_INPUT_ID}
          className="todo-form-title"
          type="text"
          name="title"
          value={title}
          placeholder="What needs to be done?"
          maxLength={TITLE_MAX_LENGTH}
          autoComplete="off"
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          onChange={handleTitleChange}
        />

        {isInvalid && (
          <p id={errorId} className="todo-form-error">
            {message}
          </p>
        )}
      </div>

      <PillSelect
        labelText="Category"
        name="category"
        options={CATEGORIES}
        value={category}
        onChange={setCategory}
        renderMark={(categoryId) => <CategoryDot categoryId={categoryId} />}
      />

      <PillSelect
        labelText="Priority"
        name="priority"
        options={PRIORITIES}
        value={priority}
        onChange={setPriority}
        renderMark={(priorityId) => (
          <Flag className="todo-form-flag" data-priority={priorityId} />
        )}
      />

      <button className="todo-form-submit" type="submit">
        <Plus className="todo-form-submit-icon" />
        Add task
      </button>

      <p className="sr-only" role="status">
        {message && <span key={messageKey}>{message}</span>}
      </p>
    </form>
  )
}
