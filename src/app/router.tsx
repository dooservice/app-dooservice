import * as React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteDefinition } from '@/core/types'
import { routerRegistry } from '@/core'
import { ProtectedRoute } from '@/app/routes/protected_route'
import { GuestRoute }     from '@/app/routes/guest_route'
import Spinner            from '@/components/spinner'

const fallback = (
  <div className="flex justify-center py-16">
    <Spinner className="h-6 w-6 text-zinc-400 animate-spin" />
  </div>
)

function lazyElement(load: () => Promise<{ default: React.ComponentType }>) {
  const Page = React.lazy(load)
  return (
    <React.Suspense fallback={fallback}>
      <Page />
    </React.Suspense>
  )
}

function toRouteObject(r: RouteDefinition) {
  if (r.redirect) return { path: r.path, element: <Navigate to={r.redirect} replace /> }
  return { path: r.path, element: lazyElement(r.page!) }
}

export function buildRouter() {
  const protected_ = routerRegistry.getProtected().map(toRouteObject)
  const guest_     = routerRegistry.getGuest().map(toRouteObject)

  return createBrowserRouter([
    {
      element:  <GuestRoute />,
      children: guest_,
    },
    {
      element:  <ProtectedRoute />,
      children: protected_,
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ])
}
