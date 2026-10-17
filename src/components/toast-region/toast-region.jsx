import { Toast } from '@/components/toast'
import { useToast } from '@/context'
import './toast-region.css'

export function ToastRegion() {
  const { toast, dismissToast } = useToast()

  return (
    <div className="toast-region" role="status">
      {toast && <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />}
    </div>
  )
}
