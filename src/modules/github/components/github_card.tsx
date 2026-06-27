import { useTranslation } from 'react-i18next'
import { GitBranchIcon } from 'lucide-react'
import { useGitHubStatus, useDisconnectGitHub } from '@/features/github/api/use_github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'
import { env } from '@/config/env'

export default function GitHubCard() {
  const { t }                                                    = useTranslation('github')
  const { data: status, isPending }                              = useGitHubStatus()
  const { mutate: disconnect, isPending: disconnecting }         = useDisconnectGitHub()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranchIcon className="h-4 w-4" />{t('card.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <p className="text-sm text-zinc-400">{t('card.loading')}</p>
        ) : status?.connected ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-teal shrink-0" />
              <div>
                <p className="text-sm font-medium text-zinc-800">{t('card.connected')}</p>
                <p className="text-xs text-zinc-500">@{status.login}</p>
              </div>
            </div>
            <Button
              variant="outline"
              loading={disconnecting}
              onClick={() => disconnect()}
              className="text-xs h-7 px-2 text-red-600 border-red-200 hover:bg-red-50"
            >{t('card.disconnect')}</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-600">{t('card.connectDesc')}</p>
            <a
              href={`${env.API_BASE}/api/github/oauth/start`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <GitBranchIcon className="h-3.5 w-3.5" />{t('card.connectBtn')}
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
