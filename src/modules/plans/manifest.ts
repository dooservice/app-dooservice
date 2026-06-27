import type { ModuleManifest } from '@/core/types'

export const manifest: ModuleManifest = {
  name:    'plans',
  version: '1.0.0',
  depends: ['auth'],
}
