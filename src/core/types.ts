import type * as React from 'react'

export type InheritPosition = 'replace' | 'before' | 'after' | 'inside'

export interface RouteDefinition {
  path: string
  page: () => Promise<{ default: React.ComponentType }>
  protected?: boolean
  guest?: boolean
}

export interface ModuleManifest {
  name: string
  version?: string
  depends?: string[]
  routes?: RouteDefinition[]
}

export interface SlotEntry {
  id: string
  slot: string
  position: InheritPosition
  component: React.ComponentType<any>
  priority: number
}

export type HookHandler<T = unknown> = (payload: T) => void | Promise<void>

export interface HookRegistration<T = unknown> {
  handler: HookHandler<T>
  priority: number
}

export interface Registry {
  router: import('./router_registry').RouterRegistry
  hooks: import('./hook_bus').HookBus
  components: import('./component_registry').ComponentRegistry
}

export interface IModule {
  manifest: ModuleManifest
  setup: (registry: Registry) => void | Promise<void>
}
