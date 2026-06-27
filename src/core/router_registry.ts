import type { RouteDefinition } from './types'

class RouterRegistry {
  private readonly _routes: RouteDefinition[] = []

  add(routes: RouteDefinition[]): void {
    this._routes.push(...routes)
  }

  getProtected(): RouteDefinition[] {
    return this._routes.filter(r => !r.guest)
  }

  getGuest(): RouteDefinition[] {
    return this._routes.filter(r => r.guest)
  }

  getAll(): RouteDefinition[] {
    return [...this._routes]
  }
}

export { RouterRegistry }
export const routerRegistry = new RouterRegistry()
