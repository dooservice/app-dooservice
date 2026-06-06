import * as React from 'react'
import { queryClient } from '@/app/provider'
import { useNatsJob } from '@/features/jobs/hooks/use_nats_job'
import type { EnvMode } from '../types/environment.types'

export type ProvisionStatus = 'idle' | 'running' | 'done' | 'failed'

export interface ProvisionState {
  status: ProvisionStatus
  jobId:  string | null
  mode:   EnvMode
  stage:  string
  stages: string[]
  pct:    number
  error:  string | undefined
}

const IDLE: ProvisionState = {
  status: 'idle', jobId: null, mode: 'development', stage: '', stages: [], pct: 0, error: undefined,
}

export function useProvisionProgress() {
  const [tracked, setTracked] = React.useState<{ jobId: string | null; mode: EnvMode }>({
    jobId: null, mode: 'development',
  })
  const [dismissed, setDismissed] = React.useState(false)

  const natsJob = useNatsJob(tracked.jobId)

  const settledRef = React.useRef(false)
  React.useEffect(() => {
    if (natsJob.status === 'done' || natsJob.status === 'failed') {
      if (!settledRef.current) {
        settledRef.current = true
        queryClient.invalidateQueries({ queryKey: ['environments'] })
        queryClient.invalidateQueries({ queryKey: ['agents'] })
      }
    }
  }, [natsJob.status])

  React.useEffect(() => {
    settledRef.current = false
    setDismissed(false)
  }, [tracked.jobId])

  const start = React.useCallback((mode: EnvMode, jobId: string) => {
    setTracked({ jobId, mode })
    setDismissed(false)
  }, [])

  const dismiss = React.useCallback(() => {
    setDismissed(true)
    setTracked({ jobId: null, mode: 'development' })
  }, [])

  if (dismissed || tracked.jobId === null) return { ...IDLE, start, dismiss }

  return {
    status: natsJob.status as ProvisionStatus,
    jobId:  tracked.jobId,
    mode:   tracked.mode,
    stage:  natsJob.stage,
    stages: natsJob.stages,
    pct:    natsJob.pct,
    error:  natsJob.error,
    start,
    dismiss,
  }
}
