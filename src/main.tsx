import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@/lib/i18n'
import { bootstrap } from '@/app/bootstrap'
import App from '@/App.tsx'

bootstrap().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
