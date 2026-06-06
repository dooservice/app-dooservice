import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useLogs(projectId: string, envId: string, enabled = false) {
  return useQuery({
    queryKey:        ['logs', projectId, envId],
    queryFn:         () =>
      api.get(`api/projects/${projectId}/environments/${envId}/logs`, {
        searchParams: { tail: 300 },
      }).json<{ logs: string; lines: number }>(),
    enabled:         !!projectId && !!envId && enabled,
    staleTime:       0,
    refetchInterval: enabled ? 5_000 : false,
  })
}
