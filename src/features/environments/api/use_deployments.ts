import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

import type { Deployment } from '../types/environment.types'

export function useDeployments(projectId: string, envId: string) {
  return useQuery({
    queryKey: ['deployments', projectId, envId],
    queryFn:  () =>
      api
        .get(`api/projects/${projectId}/deployments`, {
          searchParams: { environment_id: envId },
        })
        .json<{ deployments: Deployment[] }>()
        .then(r => r.deployments),
    enabled:   !!projectId && !!envId,
    staleTime: 15_000,
  })
}

export function useRollbackDeployment(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ envId, revision }: { envId: string; revision: number }) =>
      api
        .post(`api/projects/${projectId}/deployments/rollback`, {
          searchParams: { environment_id: envId },
          json: { revision },
        })
        .json<{ job_id: string; nats_ws_url: string }>(),
    onSuccess: (_, { envId }) =>
      queryClient.invalidateQueries({ queryKey: ['deployments', projectId, envId] }),
  })
}
