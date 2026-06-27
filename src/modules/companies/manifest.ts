import type { ModuleManifest } from '@/core/types'

export const manifest: ModuleManifest = {
  name:    'companies',
  version: '1.0.0',
  depends: ['auth'],
  routes: [
    { path: '/', page: () => import('./views/dashboard') },
  ],
}
