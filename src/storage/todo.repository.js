import { NOT_IMPLEMENTED_MESSAGE } from '@/constants'

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

  subscribe() {
    this.#throwNotImplemented()
  }

  #throwNotImplemented() {
    throw new Error(NOT_IMPLEMENTED_MESSAGE)
  }
}
