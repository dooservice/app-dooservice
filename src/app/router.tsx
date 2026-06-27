import * as React from 'react'
import { Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { routerRegistry } from '@/core'
import { ProtectedRoute } from '@/app/routes/protected_route'
import { GuestRoute }     from '@/app/routes/guest_route'
import Spinner            from '@/components/spinner'

function LazyPage({ load }: { load: () => Promise<{ default: React.ComponentType }> }) {
  const Page = React.lazy(load)
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-zinc-400 animate-spin" /></div>}>
      <Page />
    </Suspense>
  )
}

export function buildRouter() {
  const protected_ = routerRegistry.getProtected().map(r => ({
    path:    r.path,
    element: <LazyPage load={r.page} />,
  }))

  const guest_ = routerRegistry.getGuest().map(r => ({
    path:    r.path,
    element: <LazyPage load={r.page} />,
  }))

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
