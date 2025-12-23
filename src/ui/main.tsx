import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import { ComputronProvider } from './context/ComputronContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComputronProvider>
      <App />
    </ComputronProvider>
  </StrictMode>,
)
