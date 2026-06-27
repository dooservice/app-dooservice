import * as React from 'react'
import { componentRegistry } from '../component_registry'

interface SlotProps {
  name: string
  children?: React.ReactNode
}

export function Slot({ name, children }: SlotProps) {
  const entries = componentRegistry.resolve(name)

  const replaceEntry = entries.find(e => e.position === 'replace')
  if (replaceEntry) {
    const Comp = replaceEntry.component
    return <Comp />
  }

  const before  = entries.filter(e => e.position === 'before')
  const inside  = entries.filter(e => e.position === 'inside')
  const after   = entries.filter(e => e.position === 'after')

  return (
    <>
      {before.map(e => <e.component key={e.id} />)}
      {children}
      {inside.map(e => <e.component key={e.id} />)}
      {after.map(e => <e.component key={e.id} />)}
    </>
  )
}
