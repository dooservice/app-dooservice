import type { IModule } from './types'
import { RouterRegistry, routerRegistry } from './router_registry'
import { HookBus, hookBus } from './hook_bus'
import { ComponentRegistry, componentRegistry } from './component_registry'

class ModuleRegistry {
  private readonly _modules: IModule[] = []
  private _bootstrapped = false

  register(module: IModule): void {
    if (this._bootstrapped) {
      throw new Error(`[ModuleRegistry] Cannot register "${module.manifest.name}" after bootstrap.`)
    }
    this._modules.push(module)
  }

  async bootstrap(): Promise<void> {
    if (this._bootstrapped) return
    this._bootstrapped = true

    const ordered = this._resolveOrder()
    const registry = { router: routerRegistry, hooks: hookBus, components: componentRegistry }

    for (const mod of ordered) {
      if (mod.manifest.routes?.length) {
        routerRegistry.add(mod.manifest.routes)
      }
      await mod.setup(registry)
    }
  }

  getLoaded(): IModule[] {
    return [...this._modules]
  }

  private _resolveOrder(): IModule[] {
    const byName = new Map(this._modules.map(m => [m.manifest.name, m]))
    const visited = new Set<string>()
    const result: IModule[] = []

    const visit = (name: string, chain: string[] = []) => {
      if (visited.has(name)) return
      if (chain.includes(name)) {
        throw new Error(`[ModuleRegistry] Circular dependency: ${[...chain, name].join(' → ')}`)
      }
      const mod = byName.get(name)
      if (!mod) {
        throw new Error(`[ModuleRegistry] Missing module "${name}" (required by ${chain.at(-1) ?? '?'})`)
      }
      for (const dep of mod.manifest.depends ?? []) {
        visit(dep, [...chain, name])
      }
      visited.add(name)
      result.push(mod)
    }

    for (const mod of this._modules) {
      visit(mod.manifest.name)
    }

    return result
  }
}

export { ModuleRegistry, RouterRegistry, HookBus, ComponentRegistry }
export const moduleRegistry = new ModuleRegistry()
