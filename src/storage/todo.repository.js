import { sanitizeTodo } from '@/utils'
import { INVALID_TODO_MESSAGE, NOT_IMPLEMENTED_MESSAGE } from '@/constants'

export class TodoRepository {
  async list() {
    this.#throwNotImplemented()
  }

  async create() {
    this.#throwNotImplemented()
  }

  async update() {
    this.#throwNotImplemented()
  }

  async remove() {
    this.#throwNotImplemented()
  }

  async restore() {
    this.#throwNotImplemented()
  }

  subscribe() {
    this.#throwNotImplemented()
  }

  requireValidTodo(candidate) {
    const todo = sanitizeTodo(candidate)

    if (!todo) throw new Error(INVALID_TODO_MESSAGE)

    return todo
  }

  buildTodo(input) {
    const now = new Date().toISOString()

    const candidate = {
      ...input,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    }

    return this.requireValidTodo(candidate)
  }

  applyPatch(current, patch) {
    const candidate = {
      ...current,
      ...patch,
      id: current.id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    }

    return this.requireValidTodo(candidate)
  }

  #throwNotImplemented() {
    throw new Error(NOT_IMPLEMENTED_MESSAGE)
  }
}
