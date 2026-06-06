import * as React from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import i18next from 'i18next'
import { useIsAuthenticated } from '@/features/auth'
import { toast } from '@/hooks/use_toast'

export function ProtectedRoute() {
  const { isAuthenticated, isPending } = useIsAuthenticated()
  const location                       = useLocation()
  const navigate                       = useNavigate()
  const [params]                       = useSearchParams()

  React.useEffect(() => {
    if (params.get('github_connected') === '1') {
      toast({
        title:       i18next.t('auth:github.connected'),
        description: i18next.t('auth:github.connectedDesc'),
      })
      navigate(location.pathname, { replace: true })
    }
    if (params.get('github_error')) {
      toast({
        title:       i18next.t('auth:github.failed'),
        description: params.get('github_error') ?? '',
        variant:     'destructive',
      })
      navigate(location.pathname, { replace: true })
    }
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) return null

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />
  }

  return <Outlet />
}
