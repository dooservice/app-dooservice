import { wsconnect } from '@nats-io/nats-core'
import type { NatsConnection } from '@nats-io/nats-core'
import { env } from '@/config/env'

let connection: NatsConnection | null = null
let connectPromise: Promise<NatsConnection> | null = null

async function getConnection(): Promise<NatsConnection> {
  if (connection && !connection.isClosed()) return connection

  if (!connectPromise) {
    connectPromise = wsconnect({
      servers:  env.NATS_WS_URL,
      user:     env.NATS_USER,
      pass:     env.NATS_PASSWORD,
    }).then(nc => {
      connection     = nc
      connectPromise = null
      nc.closed().then(() => { connection = null })
      return nc
    })
  }

  return connectPromise
}

export interface JobProgressEvent  { stage: string; pct: number }
export interface JobCompletedEvent { result: Record<string, unknown> }
export interface JobFailedEvent    { error: string }

export interface JobCallbacks {
  onProgress:  (event: JobProgressEvent)  => void
  onCompleted: (event: JobCompletedEvent) => void
  onFailed:    (event: JobFailedEvent)    => void
}

export function subscribeToJob(jobId: string, callbacks: JobCallbacks): () => void {
  let closed = false
  let subjectSub: ReturnType<NatsConnection['subscribe']> | null = null

  const decoder = new TextDecoder()

  getConnection().then(nc => {
    if (closed) return

    subjectSub = nc.subscribe(`results.${jobId}.>`)

    ;(async () => {
      for await (const msg of subjectSub!) {
        if (closed) break
        try {
          const data = JSON.parse(decoder.decode(msg.data)) as Record<string, unknown>
          const subject = msg.subject

          if (subject.endsWith('.progress')) {
            callbacks.onProgress({ stage: data.stage as string, pct: data.pct as number })
          } else if (subject.endsWith('.completed')) {
            callbacks.onCompleted({ result: (data.result ?? data) as Record<string, unknown> })
          } else if (subject.endsWith('.failed')) {
            callbacks.onFailed({ error: (data.error ?? 'Unknown error') as string })
          }
        } catch {
          // malformed message — skip
        }
      }
    })()
  }).catch(() => {
    if (!closed) callbacks.onFailed({ error: 'Failed to connect to NATS' })
  })

  return () => {
    closed = true
    subjectSub?.unsubscribe()
  }
}
