import { openDB } from 'idb'
import { sanitizeTodo, sanitizeTodos } from '@/utils'
import {
  BROADCAST_CHANNEL_NAME,
  INDEXED_DB_KEY_PATH,
  INDEXED_DB_NAME,
  INDEXED_DB_STORE_NAME,
  INDEXED_DB_VERSION,
  LOAD_ERROR_MESSAGE,
  MISSING_TODO_MESSAGE,
  OPEN_ERROR_MESSAGE,
  SAVE_ERROR_MESSAGE,
} from '@/constants'
import { TodoRepository } from './todo.repository.js'

export class IndexedDbRepository extends TodoRepository {
  #channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  #databasePromise

  async list() {
    const database = await this.#open()

    try {
      const records = await database.getAll(INDEXED_DB_STORE_NAME)
      const todos = sanitizeTodos(records)

      const oldestFirst = todos.sort((first, second) =>
        first.createdAt.localeCompare(second.createdAt),
      )

      return oldestFirst
    } catch (error) {
      throw new Error(LOAD_ERROR_MESSAGE, { cause: error })
    }
  }

  async create(input) {
    const todo = this.buildTodo(input)

    await this.#write((store) => store.add(todo))
    this.#notifyOtherTabs()

    return todo
  }

  async update(id, patch) {
    const updated = await this.#write(async (store) => {
      const current = sanitizeTodo(await store.get(id))

      if (!current) throw new Error(MISSING_TODO_MESSAGE)

      const patched = this.applyPatch(current, patch)

      await store.put(patched)

      return patched
    })

    this.#notifyOtherTabs()

    return updated
  }

  async remove(ids) {
    const hasRemoved = await this.#write((store) => this.#removeStored(store, ids))
    if (!hasRemoved) return

    this.#notifyOtherTabs()
  }

  async restore(todos) {
    const validTodos = todos.map((todo) => this.requireValidTodo(todo))

    const hasAdded = await this.#write((store) => this.#addNew(store, validTodos))
    if (!hasAdded) return

    this.#notifyOtherTabs()
  }

  subscribe(onExternalChange) {
    const handleMessage = () => onExternalChange()

    this.#channel.addEventListener('message', handleMessage)

    return () => this.#channel.removeEventListener('message', handleMessage)
  }

  async #open() {
    try {
      this.#databasePromise ??= openDB(INDEXED_DB_NAME, INDEXED_DB_VERSION, {
        upgrade: (database) => {
          database.createObjectStore(INDEXED_DB_STORE_NAME, {
            keyPath: INDEXED_DB_KEY_PATH,
          })
        },
      })

      const database = await this.#databasePromise

      return database
    } catch (error) {
      this.#databasePromise = undefined

      throw new Error(OPEN_ERROR_MESSAGE, { cause: error })
    }
  }

  async #write(operation) {
    const database = await this.#open()

    try {
      const transaction = database.transaction(INDEXED_DB_STORE_NAME, 'readwrite')

      const [result] = await Promise.all([
        operation(transaction.store),
        transaction.done,
      ])

      return result
    } catch (error) {
      const isBrowserError = error instanceof DOMException
      if (!isBrowserError) throw error

      throw new Error(SAVE_ERROR_MESSAGE, { cause: error })
    }
  }

  async #removeStored(store, ids) {
    const storedIds = await store.getAllKeys()
    const removableIds = ids.filter((id) => storedIds.includes(id))

    await Promise.all(removableIds.map((id) => store.delete(id)))

    const hasRemovable = removableIds.length > 0

    return hasRemovable
  }

  async #addNew(store, todos) {
    const storedIds = await store.getAllKeys()
    const newTodos = todos.filter((todo) => !storedIds.includes(todo.id))

    await Promise.all(newTodos.map((todo) => store.add(todo)))

    const hasNew = newTodos.length > 0

    return hasNew
  }

  #notifyOtherTabs() {
    this.#channel.postMessage(null)
  }
}
