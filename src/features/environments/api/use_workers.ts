import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useUpdateWorkers(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ envId, workers }: { envId: string; workers: number }) =>
      api.patch(`api/projects/${projectId}/environments/${envId}/workers`, {
        json: { workers },
      }).json<{ job_id: string }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}
