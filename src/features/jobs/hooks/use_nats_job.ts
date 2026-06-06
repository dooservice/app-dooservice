import * as React from 'react'
import { subscribeToJob } from '@/lib/nats'

export type NatsJobStatus = 'idle' | 'running' | 'done' | 'failed'

export interface NatsJobState {
  status: NatsJobStatus
  stage:  string
  stages: string[]
  pct:    number
  error:  string | undefined
  result: Record<string, unknown> | undefined
}

const IDLE: NatsJobState = {
  status: 'idle', stage: '', stages: [], pct: 0, error: undefined, result: undefined,
}

export function useNatsJob(jobId: string | null): NatsJobState {
  const [state, setState] = React.useState<NatsJobState>(IDLE)

  React.useEffect(() => {
    if (!jobId) { setState(IDLE); return }

    setState({ status: 'running', stage: '', stages: [], pct: 0, error: undefined, result: undefined })

    const unsubscribe = subscribeToJob(jobId, {
      onProgress: ({ stage, pct }) => setState(prev => ({
        ...prev,
        stage,
        pct,
        stages: prev.stages.includes(stage) ? prev.stages : [...prev.stages, stage],
      })),
      onCompleted: ({ result }) => setState(prev => ({ ...prev, status: 'done',   pct: 100, result })),
      onFailed:    ({ error })  => setState(prev => ({ ...prev, status: 'failed', error })),
    })

    return unsubscribe
  }, [jobId])

  return state
}
