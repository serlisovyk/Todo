import { AppHeader } from '@/components/app-header'
import { TodoList } from '@/components/todo-list'
import { TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <TodosProvider>
      <AppHeader />

      <main className="app">
        <TodoList />
      </main>
    </TodosProvider>
  )
}
