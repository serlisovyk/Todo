import { TodoList } from '@/components/todo-list'
import { TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <TodosProvider>
      <main className="app">
        <TodoList />
      </main>
    </TodosProvider>
  )
}
