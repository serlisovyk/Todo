import { STORAGE_MODE_INDEXED_DB } from '@/constants'
import { IndexedDbRepository } from './indexed-db.repository.js'
import { LocalStorageRepository } from './local-storage.repository.js'

export function createRepository() {
  navigator.storage?.persist?.().catch(() => {})

  const isIndexedDb = import.meta.env.VITE_STORAGE === STORAGE_MODE_INDEXED_DB
  if (isIndexedDb) return new IndexedDbRepository()

  return new LocalStorageRepository()
}
