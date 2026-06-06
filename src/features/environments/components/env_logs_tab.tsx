import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCwIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLogs } from '@/features/environments/api/use_logs'
import type { Environment } from '@/features/environments/types/environment.types'
import Button from '@/components/button'

interface Props {
  env:       Environment | null
  projectId: string
}

export default function EnvLogsTab({ env, projectId }: Props) {
  const { t } = useTranslation('environments')
  const [streaming, setStreaming] = React.useState(false)
  const { data, isFetching, refetch } = useLogs(projectId, env?.id ?? '', streaming)
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (data) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [data])

  if (!env) return (
    <div className="flex items-center justify-center py-16 text-sm text-zinc-400">{t('selectFirst')}</div>
  )

  if (env.runtime_state !== 'running') return (
    <div className="flex items-center justify-center py-16 text-sm text-zinc-400">
      {t('logs.mustBeRunning')}
    </div>
  )

  const lines = data?.logs?.split('\n').filter(Boolean) ?? []

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStreaming(s => !s)}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors',
              streaming
                ? 'bg-brand-teal-light border-brand-teal/30 text-brand-teal'
                : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600',
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', streaming ? 'bg-brand-teal animate-pulse' : 'bg-zinc-300 dark:bg-zinc-600')} />
            {streaming ? t('logs.live') : t('logs.paused')}
          </button>
          {data && <span className="text-xs text-zinc-400">{t('logs.lines', { count: lines.length })}</span>}
        </div>
        <Button variant="outline" icon={<RefreshCwIcon className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />}
          onClick={() => refetch()}
        >{t('logs.refresh')}</Button>
      </div>

      <div className="rounded-md border border-zinc-700 bg-zinc-950 overflow-auto max-h-[500px] p-4 font-mono text-xs leading-5">
        {lines.length === 0 ? (
          <span className="text-zinc-500">{t('logs.noLogs')}</span>
        ) : (
          lines.map((line, i) => (
            <div key={i} className="text-zinc-300 whitespace-pre-wrap break-all">{line}</div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
