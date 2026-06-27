import type { ModuleManifest } from '@/core/types'

export const manifest: ModuleManifest = {
  name:    'projects',
  version: '1.0.0',
  depends: ['auth', 'companies', 'github', 'agents', 'plans'],
  routes: [
    { path: '/projects',                   page: () => import('./views/projects_index') },
    { path: '/projects/create',            page: () => import('./views/project_create') },
    { path: '/projects/:projectId',        page: () => import('./views/project_show') },
    { path: '/projects/:projectId/config', page: () => import('./views/project_config') },
  ],
}
