import { useTranslation } from 'react-i18next'
import { KeyRoundIcon, RefreshCwIcon } from 'lucide-react'
import { useProjectDeployKey, useSetupProjectDeployKey } from '@/features/projects/api/use_project_keys'
import { toast } from '@/hooks/use_toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'
import Spinner from '@/components/spinner'
import CopyButton from '@/components/copy_button'

interface Props {
  projectId: string
}

export default function DeployKeyCard({ projectId }: Props) {
  const { t }                                         = useTranslation('projects')
  const { data, isPending }                           = useProjectDeployKey(projectId)
  const { mutate: setup, isPending: setting }         = useSetupProjectDeployKey(projectId)

  const handleSetup = () => {
    setup(undefined, {
      onError: err => toast({ title: t('deployKey.generateFailed'), description: err.message, variant: 'destructive' }),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRoundIcon className="h-4 w-4" />
          {t('deployKey.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPending ? (
          <div className="flex justify-center py-6">
            <Spinner className="h-5 w-5 text-zinc-400 animate-spin" />
          </div>
        ) : data?.exists && data.public_key ? (
          <>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 flex items-center gap-3">
              <code className="flex-1 text-[13px] font-mono text-zinc-700 truncate min-w-0">{data.public_key}</code>
              <CopyButton text={data.public_key} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500">
                {t('deployKey.instruction')}
              </p>
              <button
                type="button"
                onClick={handleSetup}
                disabled={setting}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors disabled:opacity-50"
              >
                <RefreshCwIcon className="h-3 w-3" />
                {t('deployKey.regenerate')}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3 py-2">
            <p className="text-sm font-medium text-zinc-500">{t('deployKey.empty')}</p>
            <Button loading={setting} onClick={handleSetup}>{t('deployKey.generate')}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
