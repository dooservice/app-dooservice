import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface ProjectDeployKey {
  public_key: string | null
  exists:     boolean
}

export interface SubmoduleKey {
  repo_url:   string
  public_key: string
  created_at: string
}

export function useProjectDeployKey(projectId: string) {
  return useQuery({
    queryKey:  ['project-keys', 'deploy-key', projectId],
    queryFn:   () =>
      api.get(`api/projects/${projectId}/deploy-key`)
         .json<ProjectDeployKey>(),
    enabled:   !!projectId,
    staleTime: 30_000,
  })
}

export function useSetupProjectDeployKey(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      api.post(`api/projects/${projectId}/deploy-key/setup`)
         .json<{ public_key: string }>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['project-keys', 'deploy-key', projectId] }),
  })
}

export function useSubmoduleKeys(projectId: string) {
  return useQuery({
    queryKey:  ['project-keys', 'submodules', projectId],
    queryFn:   () =>
      api.get(`api/projects/${projectId}/submodule-keys`)
         .json<SubmoduleKey[]>(),
    enabled:   !!projectId,
    staleTime: 30_000,
  })
}

export function useAddSubmoduleKey(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (repoUrl: string) =>
      api.post(`api/projects/${projectId}/submodule-keys`, {
        json: { repo_url: repoUrl },
      }).json<SubmoduleKey>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['project-keys', 'submodules', projectId] }),
  })
}

export function useDeleteSubmoduleKey(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (repoUrl: string) =>
      api.delete(`api/projects/${projectId}/submodule-keys`, {
        json: { repo_url: repoUrl },
      }).json<{ deleted: boolean }>(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['project-keys', 'submodules', projectId] }),
  })
}
