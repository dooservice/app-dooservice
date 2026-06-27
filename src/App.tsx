import { RouterProvider } from 'react-router-dom'
import { AppProvider } from '@/app/provider'
import { buildRouter } from '@/app/router'

const router = buildRouter()

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  )
}
