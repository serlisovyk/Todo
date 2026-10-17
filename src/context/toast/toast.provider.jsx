import { useState } from 'react'
import { ToastContext } from './toast.context.js'

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (content) => setToast({ ...content, id: crypto.randomUUID() })

  const dismissToast = () => setToast(null)

  const value = { toast, showToast, dismissToast }

  return <ToastContext value={value}>{children}</ToastContext>
}
