import { Navigate, Outlet } from 'react-router-dom'
import { useIsAuthenticated } from '@/modules/auth'

export function GuestRoute() {
  const { isAuthenticated, isPending } = useIsAuthenticated()

  if (isPending) return null

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
