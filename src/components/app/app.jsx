import { AppHeader } from '@/components/app-header'
import { TodoForm } from '@/components/todo-form'
import { TodoList } from '@/components/todo-list'
import { TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <TodosProvider>
      <AppHeader />

      <main className="app">
        <TodoForm />
        <TodoList />
      </main>
    </TodosProvider>
  )
}
