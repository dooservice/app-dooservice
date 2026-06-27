import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Agent } from '../types/agent.types'

export const agentsQuery = queryOptions({
  queryKey:        ['agents'] as const,
  queryFn:         () => api.get('api/agents').json<Agent[]>(),
  staleTime:       15_000,
  refetchInterval: 15_000,
})

export function useAgents() {
  return useQuery(agentsQuery)
}
