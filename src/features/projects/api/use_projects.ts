import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Project, CreateProjectPayload } from '../types/project.types'


export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn:  () =>
      api.get('api/projects')
         .json<{ projects: Project[] }>()
         .then(r => r.projects),
    staleTime: 60_000,
  })
}

export function useProject(projectId: string) {
  const { data: projects = [] } = useProjects()
  return projects.find(p => p.id === projectId) ?? null
}

export function useCurrentProject() {
  const { projectId } = useParams<{ projectId: string }>()
  return useProject(projectId ?? '')
}

export function useProjectNameAvailable(name: string) {
  const [debouncedName, setDebouncedName] = React.useState(name)

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedName(name), 400)
    return () => clearTimeout(timer)
  }, [name])

  return useQuery({
    queryKey:  ['projects', 'check-name', debouncedName],
    queryFn:   () =>
      api.get('api/projects/check-name', { searchParams: { name: debouncedName } })
         .json<{ available: boolean }>()
         .then(r => r.available),
    enabled:   debouncedName.length >= 3,
    staleTime: 10_000,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      api.post('api/projects', {
        json: {
          name:           payload.name,
          region:         payload.region,
          has_repository: payload.has_repository,
          odoo_version:   payload.odoo_version  ?? '19.0',
          timezone:       payload.timezone       ?? 'UTC',
          language:       payload.language       ?? 'en_US',
          admin_email:    payload.admin_email    ?? '',
          admin_password: payload.admin_password ?? '',
          repo_full_name: payload.repo_full_name ?? null,
          repo_id:        payload.repo_id        ?? 0,
          default_branch: payload.default_branch ?? 'main',
        },
      }).json<{ project_id: string; name: string; env_job_id: string }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const navigate    = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api.delete(`api/projects/${id}`, {
        json: { name },
      }).json<{ deleted: boolean }>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      navigate('/projects')
    },
  })
}

export function useLockProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectId: string) =>
      api.post(`api/projects/${projectId}/lock`).json<{ locked: boolean }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUnlockProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectId: string) =>
      api.post(`api/projects/${projectId}/unlock`).json<{ locked: boolean }>(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}
