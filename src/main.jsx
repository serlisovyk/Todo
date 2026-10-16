import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/components'
import '@/styles/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
