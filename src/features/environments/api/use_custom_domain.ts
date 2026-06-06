import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CustomDomain } from '../types/environment.types'

const domainBase = (projectId: string, envId: string) =>
  `api/projects/${projectId}/environments/${envId}/domain`

export function useSetCustomDomain(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ envId, domain }: { envId: string; domain: string }) =>
      api.post(domainBase(projectId, envId), {
        json: { domain },
      }).json<{ custom_domain: CustomDomain }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}

export function useRemoveCustomDomain(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (envId: string) =>
      api.delete(domainBase(projectId, envId))
         .json<Record<string, never>>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}

export function useVerifyCustomDomain(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (envId: string) =>
      api.post(`${domainBase(projectId, envId)}/verify`)
         .json<{ custom_domain: CustomDomain }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}
