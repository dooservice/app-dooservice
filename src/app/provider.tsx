import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/toaster'
import { sessionQuery } from '@/modules/auth/api/use_auth'
import { agentsQuery }  from '@/modules/agents/api/use_agents'
import { ModuleDebugPanel } from '@/core/dev/module_debug_panel'

export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

queryClient.prefetchQuery(sessionQuery)
queryClient.prefetchQuery(agentsQuery)

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="dooservice-theme">
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        {import.meta.env.DEV && <ModuleDebugPanel />}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
