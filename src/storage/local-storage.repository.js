import { sanitizeTodo, sanitizeTodos } from '@/utils'
import {
  DATA_FORMAT_VERSION,
  DATA_STORAGE_KEY,
  INVALID_TODO_MESSAGE,
  MISSING_TODO_MESSAGE,
  SAVE_ERROR_MESSAGE,
} from '@/constants'
import { TodoRepository } from './todo.repository.js'

export class LocalStorageRepository extends TodoRepository {
  async list() {
    return this.#read()
  }

  async create(input) {
    const todos = this.#read()
    const now = new Date().toISOString()

    const todo = this.#validate({
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    })

    this.#write([...todos, todo])

    return todo
  }

  async update(id, patch) {
    const todos = this.#read()
    const current = todos.find((todo) => todo.id === id)

    if (!current) throw new Error(MISSING_TODO_MESSAGE)

    const updated = this.#validate({
      ...current,
      ...patch,
      id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    })

    this.#write(todos.map((todo) => (todo === current ? updated : todo)))

    return updated
  }

  async remove(ids) {
    const todos = this.#read()
    const remaining = todos.filter((todo) => !ids.includes(todo.id))

    const hasRemoved = remaining.length < todos.length
    if (!hasRemoved) return

    this.#write(remaining)
  }

  subscribe(onExternalChange) {
    const handleStorage = (event) => {
      if (event.key !== DATA_STORAGE_KEY) return

      onExternalChange()
    }

    window.addEventListener('storage', handleStorage)

    return () => window.removeEventListener('storage', handleStorage)
  }

  #validate(candidate) {
    const todo = sanitizeTodo(candidate)

    if (!todo) throw new Error(INVALID_TODO_MESSAGE)

    return todo
  }

  #read() {
    try {
      const data = JSON.parse(localStorage.getItem(DATA_STORAGE_KEY))

      if (data?.version !== DATA_FORMAT_VERSION) return []

      return sanitizeTodos(data.todos)
    } catch {
      return []
    }
  }

  #write(todos) {
    const data = { version: DATA_FORMAT_VERSION, todos }

    try {
      localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      throw new Error(SAVE_ERROR_MESSAGE, { cause: error })
    }
  }
}
