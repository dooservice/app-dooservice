import type * as React from 'react'
import type { InheritPosition, SlotEntry } from './types'

interface InheritSpec {
  slot: string
  position: InheritPosition
  component: React.ComponentType<any>
  priority?: number
}

class ComponentRegistry {
  private readonly _entries: SlotEntry[] = []
  private _idCounter = 0

  inherit(spec: InheritSpec): void {
    this._entries.push({
      id:        `slot-${++this._idCounter}`,
      slot:      spec.slot,
      position:  spec.position,
      component: spec.component,
      priority:  spec.priority ?? 0,
    })
  }

  resolve(slotName: string): SlotEntry[] {
    return this._entries
      .filter(e => e.slot === slotName)
      .sort((a, b) => b.priority - a.priority)
  }

  getAllSlots(): string[] {
    return [...new Set(this._entries.map(e => e.slot))]
  }
}

export { ComponentRegistry }
export const componentRegistry = new ComponentRegistry()
