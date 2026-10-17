import { AppHeader } from '@/components/app-header'
import { TodoForm } from '@/components/todo-form'
import { TodoList } from '@/components/todo-list'
import { ToastRegion } from '@/components/toast-region'
import { ToastProvider, TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <ToastProvider>
      <TodosProvider>
        <AppHeader />

        <main className="app">
          <TodoForm />
          <TodoList />
        </main>
      </TodosProvider>

      <ToastRegion />
    </ToastProvider>
  )
}
