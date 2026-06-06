import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Environment, ProvisionEnvPayload } from '../types/environment.types'

export function useEnvironments(projectId: string, projectName: string) {
  return useQuery({
    queryKey: ['environments', projectId],
    queryFn:  () =>
      api.get('api/environments', {
        searchParams: { project_id: projectId, project_name: projectName },
      })
         .json<{ environments: Environment[] }>()
         .then(r => r.environments),
    enabled:   !!projectId && !!projectName,
    staleTime: 30_000,
  })
}

export function useProvisionEnvironment() {
  return useMutation({
    mutationFn: (p: ProvisionEnvPayload) =>
      api.post(`api/projects/${p.project_id}/environments/provision`, {
        json: {
          project_name:   p.project_name,
          mode:           p.mode ?? 'development',
          branch:         p.branch ?? '',
          new_branch:     p.new_branch ?? false,
          source_branch:  p.source_branch ?? '',
          odoo_version:   p.odoo_version,
          admin_email:    p.admin_email,
          admin_password: p.admin_password,
          timezone:       p.timezone,
          language:       p.language,
          neutralize:     p.neutralize ?? true,
        },
      }).json<{ job_id: string }>(),
  })
}

export function useDeleteEnvironment(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (envId: string) =>
      api.delete(`api/projects/${projectId}/environments/${envId}`)
         .json<{ deleted: boolean }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}

export function useStartEnvironment(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (envId: string) =>
      api.post(`api/projects/${projectId}/environments/${envId}/start`)
         .json<{ runtime_state: string }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}

export function useStopEnvironment(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (envId: string) =>
      api.post(`api/projects/${projectId}/environments/${envId}/stop`)
         .json<{ runtime_state: string }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['environments', projectId] }),
  })
}

export function useCloneEnvironment(projectId: string) {
  return useMutation({
    mutationFn: ({ envId, newBranch = true, branch, neutralize = true }: { envId: string; newBranch?: boolean; branch?: string; neutralize?: boolean }) =>
      api.post(`api/projects/${projectId}/environments/${envId}/clone`, {
        json: { new_branch: newBranch, branch, neutralize },
      }).json<{ job_id: string; environment_id: string }>(),
  })
}

export function useRebuildEnvironment(projectId: string) {
  return useMutation({
    mutationFn: (envId: string) =>
      api.post(`api/projects/${projectId}/environments/${envId}/rebuild`)
         .json<{ job_id: string }>(),
  })
}

export function useDeployEnvironment(projectId: string) {
  return useMutation({
    mutationFn: ({ envId, branch = '' }: { envId: string; branch?: string }) =>
      api.post(`api/projects/${projectId}/environments/${envId}/deploy`, {
        json: { branch },
      }).json<{ job_id: string }>(),
  })
}

export function usePromoteEnvironment(projectId: string) {
  return useMutation({
    mutationFn: ({ envId, targetEnvironmentId }: { envId: string; targetEnvironmentId: string }) =>
      api.post(`api/projects/${projectId}/environments/${envId}/promote`, {
        json: { target_environment_id: targetEnvironmentId },
      }).json<{ job_id: string }>(),
  })
}
