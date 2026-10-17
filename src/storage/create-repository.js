import { LocalStorageRepository } from './local-storage.repository.js'

export function createRepository() {
  navigator.storage?.persist?.().catch(() => {})

  return new LocalStorageRepository()
}
