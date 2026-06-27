import type { ModuleManifest } from '@/core/types'

export const manifest: ModuleManifest = {
  name:    'auth',
  version: '1.0.0',
  depends: [],
  routes: [
    { path: '/sign-in',         page: () => import('./views/sign_in'),         guest: true },
    { path: '/sign-up',         page: () => import('./views/sign_up'),         guest: true },
    { path: '/verify-email',    page: () => import('./views/verify_email'),    guest: true },
    { path: '/forgot-password', page: () => import('./views/forgot_password'), guest: true },
    { path: '/reset-password',  page: () => import('./views/reset_password'),  guest: true },
    { path: '/settings/account', page: () => import('./views/settings/account') },
  ],
}
