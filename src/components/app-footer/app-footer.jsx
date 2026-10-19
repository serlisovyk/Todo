import { AUTHOR_NAME } from '@/constants'
import './app-footer.css'

export function AppFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      {AUTHOR_NAME} · {year}
    </footer>
  )
}
