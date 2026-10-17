import { TodosProvider } from '@/context'
import './app.css'

export function App() {
  return (
    <TodosProvider>
      <main className="app">Todo</main>
    </TodosProvider>
  )
}
