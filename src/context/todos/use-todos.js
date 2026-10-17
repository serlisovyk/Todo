import { use } from 'react'
import { MISSING_TODOS_PROVIDER_MESSAGE } from '@/constants'
import { TodosContext } from './todos.context.js'

export function useTodos() {
  const context = use(TodosContext)

  if (!context) throw new Error(MISSING_TODOS_PROVIDER_MESSAGE)

  return context
}
