import type { IModule, Registry } from '@/core/types'
import { manifest } from './manifest'

export const CompaniesModule: IModule = {
  manifest,
  setup(_registry: Registry) {},
}
