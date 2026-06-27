import type { IModule, Registry } from '@/core/types'
import { manifest } from './manifest'

export const JobsModule: IModule = {
  manifest,
  setup(_registry: Registry) {},
}
