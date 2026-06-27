import type { ModuleManifest } from '@/core/types'

export const manifest: ModuleManifest = {
  name:    'agents',
  version: '1.0.0',
  depends: ['auth'],
}
