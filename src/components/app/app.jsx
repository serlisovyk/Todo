import { AppFooter } from '@/components/app-footer'
import { AppHeader } from '@/components/app-header'
import { ErrorBoundary } from '@/components/error-boundary'
import { FilterAnnouncer } from '@/components/filter-announcer'
import { FiltersToolbar } from '@/components/filters-toolbar'
import { StatusSwitch } from '@/components/status-switch'
import { TodoBackup } from '@/components/todo-backup'
import { TodoFooter } from '@/components/todo-footer'
import { TodoForm } from '@/components/todo-form'
import { TodoList } from '@/components/todo-list'
import { ToastRegion } from '@/components/toast-region'
import { ThemeProvider, ToastProvider, TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ThemeProvider>
          <TodosProvider>
            <AppHeader />

            <main className="app">
              <TodoForm />
              <FiltersToolbar />
              <StatusSwitch />
              <FilterAnnouncer />
              <TodoList />
              <TodoFooter />
              <TodoBackup />
            </main>

            <AppFooter />
          </TodosProvider>
        </ThemeProvider>

        <ToastRegion />
      </ToastProvider>
    </ErrorBoundary>
  )
}
