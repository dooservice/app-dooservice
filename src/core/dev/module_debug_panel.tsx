import * as React from 'react'
import { moduleRegistry } from '../module_registry'
import { componentRegistry } from '../component_registry'

export function ModuleDebugPanel() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'M') setOpen(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  const modules   = moduleRegistry.getLoaded()
  const slots     = componentRegistry.getAllSlots()

  return (
    <div
      style={{
        position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
        background: '#18181b', color: '#e4e4e7', borderRadius: 8,
        padding: '12px 16px', width: 360, maxHeight: '70vh',
        overflowY: 'auto', fontSize: 12, fontFamily: 'monospace',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>Module Debug Panel</strong>
        <button onClick={() => setOpen(false)} style={{ color: '#a1a1aa', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
      </div>

      <Section title={`Modules (${modules.length})`}>
        {modules.map(m => (
          <div key={m.manifest.name} style={{ padding: '2px 0', color: '#86efac' }}>
            {m.manifest.name}
            {m.manifest.version && <span style={{ color: '#a1a1aa' }}> v{m.manifest.version}</span>}
            {(m.manifest.depends?.length ?? 0) > 0 && (
              <span style={{ color: '#a1a1aa' }}> ← {m.manifest.depends?.join(', ')}</span>
            )}
          </div>
        ))}
      </Section>

      <Section title={`Slots (${slots.length})`}>
        {slots.map(slot => {
          const entries = componentRegistry.resolve(slot)
          return (
            <div key={slot} style={{ marginBottom: 4 }}>
              <div style={{ color: '#fbbf24' }}>{slot}</div>
              {entries.map(e => (
                <div key={e.id} style={{ paddingLeft: 12, color: '#a1a1aa' }}>
                  [{e.position}] {e.component.displayName ?? e.component.name ?? '?'} (p:{e.priority})
                </div>
              ))}
            </div>
          )
        })}
      </Section>

      <div style={{ marginTop: 8, color: '#52525b', fontSize: 10 }}>
        Ctrl+Shift+M to toggle · DEV only
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ color: '#71717a', marginBottom: 4, borderBottom: '1px solid #27272a', paddingBottom: 2 }}>
        {title}
      </div>
      {children}
    </div>
  )
}
