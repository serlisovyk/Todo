import { use } from 'react'
import { MISSING_TOAST_PROVIDER_MESSAGE } from '@/constants'
import { ToastContext } from './toast.context.js'

export function useToast() {
  const context = use(ToastContext)

  if (!context) throw new Error(MISSING_TOAST_PROVIDER_MESSAGE)

  return context
}
