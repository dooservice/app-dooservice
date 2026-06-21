import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CurrentPlanResponse, Plan } from '../types/plan.types'

const plansQuery = queryOptions({
  queryKey: ['plans'] as const,
  queryFn:  () => api.get('api/plans').json<{ plans: Plan[] }>().then(r => r.plans),
})

const currentPlanQuery = queryOptions({
  queryKey: ['plans', 'me'] as const,
  queryFn:  () => api.get('api/me/plan').json<CurrentPlanResponse>(),
})

export function usePlans() {
  return useQuery(plansQuery)
}

export function useCurrentPlan() {
  return useQuery(currentPlanQuery)
}
