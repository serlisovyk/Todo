import { CircleAlert } from 'lucide-react'
import { TextButton } from '@/components/text-button'
import { useErrorScreen } from '@/hooks'
import './error-screen.css'

export function ErrorScreen() {
  const { headingRef, message, attempt, handleExport, handleReload } =
    useErrorScreen()

  return (
    <main className="error-screen">
      <CircleAlert className="error-screen-icon" aria-hidden="true" />

      <h1 ref={headingRef} className="error-screen-title" tabIndex={-1}>
        Something went wrong
      </h1>

      <p className="error-screen-text">
        Export a backup of your tasks, then reload the page.
      </p>

      <div className="error-screen-actions">
        <TextButton onClick={handleExport}>Export backup</TextButton>

        <TextButton onClick={handleReload}>Reload</TextButton>
      </div>

      <p className="error-screen-status" role="status">
        {message && <span key={attempt}>{message}</span>}
      </p>
    </main>
  )
}
