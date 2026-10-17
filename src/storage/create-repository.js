import { LocalStorageRepository } from './local-storage.repository.js'

export function createRepository() {
  return new LocalStorageRepository()
}
