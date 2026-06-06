import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface GitHubStatus {
  connected:    boolean
  login?:       string
  avatar_url?:  string
  scopes?:      string[]
}

export interface GitHubOwner {
  login:      string
  type:       'user' | 'org' | string
  avatar_url: string
}

export interface GitHubRepo {
  id:             number
  full_name:      string
  name:           string
  private:        boolean
  html_url:       string
  default_branch: string
}

// ── OAuth status ───────────────────────────────────────────────────────────

export function useGitHubStatus() {
  return useQuery({
    queryKey: ['github', 'status'],
    queryFn:  () => api.get('api/github/status').json<GitHubStatus>(),
    staleTime: 60_000,
  })
}

export function useDisconnectGitHub() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete('api/github/connection').json<void>(),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['github'] }),
  })
}

// ── Owners + repos ─────────────────────────────────────────────────────────

export function useGitHubOrgs(enabled = true) {
  return useQuery({
    queryKey: ['github', 'orgs'],
    queryFn:  () => api.get('api/github/orgs').json<GitHubOwner[]>(),
    enabled,
    staleTime: 60_000,
  })
}

export function useGitHubRepos(owner: string | null | undefined, enabled = true) {
  return useQuery({
    queryKey: ['github', 'repos', owner ?? '__all__'],
    queryFn:  () => {
      const path = owner ? `api/github/repos?owner=${encodeURIComponent(owner)}` : 'api/github/repos'
      return api.get(path).json<GitHubRepo[]>()
    },
    enabled:   enabled && (owner !== undefined),
    staleTime: 60_000,
  })
}

export function useCreateGitHubRepo() {
  return useMutation({
    mutationFn: (data: { name: string; owner?: string; private?: boolean; description?: string }) =>
      api.post('api/github/repos', { json: data }).json<GitHubRepo & { clone_url: string; ssh_url: string }>(),
  })
}

// ── Branches ──────────────────────────────────────────────────────────────

export function useRepoBranches(repoFullName: string | null | undefined) {
  return useQuery({
    queryKey: ['github', 'branches', repoFullName ?? ''],
    queryFn:  () =>
      api.get('api/github/branches', {
        searchParams: { repo_full_name: repoFullName ?? '' },
      }).json<string[]>(),
    enabled:   !!repoFullName,
    staleTime: 30_000,
  })
}

// ── Per-environment GitHub info ────────────────────────────────────────────

export interface EnvGitHubInfo {
  autodeploy_enabled: boolean
  repo_full_name:     string | null
}

export function useEnvGitHubInfo(projectId: string, envId: string) {
  return useQuery({
    queryKey: ['github', 'env-info', projectId, envId],
    queryFn:  () =>
      api.get(`api/projects/${projectId}/environments/${envId}/github-info`)
         .json<EnvGitHubInfo>(),
    enabled:  !!(projectId && envId),
    staleTime: 30_000,
  })
}

// ── Recreate webhook (if it failed during project creation) ────────────────

export function useRepairWebhook(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      api.post(`api/projects/${projectId}/repair-github`)
         .json<{ status: string; webhook_id: number }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['github'] }),
  })
}
