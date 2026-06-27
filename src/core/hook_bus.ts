import type { HookHandler, HookRegistration } from './types'

class HookBus {
  private readonly _handlers = new Map<string, HookRegistration[]>()

  on<T = unknown>(event: string, handler: HookHandler<T>, options: { priority?: number } = {}): void {
    const { priority = 0 } = options
    const list = this._handlers.get(event) ?? []
    list.push({ handler: handler as HookHandler, priority })
    list.sort((a, b) => b.priority - a.priority)
    this._handlers.set(event, list)
  }

  off<T = unknown>(event: string, handler: HookHandler<T>): void {
    const list = this._handlers.get(event)
    if (!list) return
    this._handlers.set(event, list.filter(r => r.handler !== handler))
  }

  async emit<T = unknown>(event: string, payload?: T): Promise<void> {
    const list = this._handlers.get(event) ?? []
    for (const { handler } of list) {
      await handler(payload as unknown)
    }
  }
}

export { HookBus }
export const hookBus = new HookBus()
