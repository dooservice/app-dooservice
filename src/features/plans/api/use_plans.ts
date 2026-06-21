import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Plan, ProjectPlanResponse } from '../types/plan.types'

const plansQuery = queryOptions({
  queryKey: ['plans'] as const,
  queryFn:  () => api.get('api/plans').json<{ plans: Plan[] }>().then(r => r.plans),
})

export function usePlans() {
  return useQuery(plansQuery)
}

export function useProjectPlan(projectId: string) {
  return useQuery({
    queryKey: ['plans', 'project', projectId] as const,
    queryFn:  () => api.get(`api/projects/${projectId}/plan`).json<ProjectPlanResponse>(),
    enabled:  !!projectId,
  })
}
