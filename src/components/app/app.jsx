import { AppHeader } from '@/components/app-header'
import { StatusSwitch } from '@/components/status-switch'
import { TodoForm } from '@/components/todo-form'
import { TodoList } from '@/components/todo-list'
import { ToastRegion } from '@/components/toast-region'
import { ThemeProvider, ToastProvider, TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <TodosProvider>
          <AppHeader />

          <main className="app">
            <TodoForm />
            <StatusSwitch />
            <TodoList />
          </main>
        </TodosProvider>
      </ThemeProvider>

      <ToastRegion />
    </ToastProvider>
  )
}
