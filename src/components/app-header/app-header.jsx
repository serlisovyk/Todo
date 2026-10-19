import { ListChecks } from 'lucide-react'
import { GithubLink } from '@/components/github-link'
import { ThemeSwitch } from '@/components/theme-switch'
import './app-header.css'

export function AppHeader() {
  return (
    <header className="app-header">
      <ListChecks className="app-header-icon" />

      <h1 className="app-header-title">Todo</h1>

      <div className="app-header-actions">
        <ThemeSwitch />

        <GithubLink />
      </div>
    </header>
  )
}
