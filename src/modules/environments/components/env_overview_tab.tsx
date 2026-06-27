import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowUpRightIcon, PlayIcon, SquareIcon, CopyIcon, InfoIcon, GitBranchIcon, CheckIcon, CpuIcon, RotateCcwIcon } from 'lucide-react'
import { useEnvDateTime } from '@/lib/date'
import { useCurrentProject } from '@/modules/projects/api/use_projects'
import { useEnvironments, useStartEnvironment, useStopEnvironment, useRebuildEnvironment } from '@/modules/environments/api/use_environments'
import { useProvisionProgress } from '@/modules/environments/api/use_provision_progress'
import { toast } from '@/hooks/use_toast'
import type { Environment } from '@/modules/environments/types/environment.types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogDescription, DialogFooter } from '@/components/dialog'
import Button from '@/components/button'
import EnvStatusBadge from '@/components/env_status_badge'
import ProvisionProgressModal from './provision_progress_modal'
import CloneDialog from './clone_dialog'

interface Props {
  env:       Environment
  projectId: string
}

export default function EnvOverviewTab({ env, projectId }: Props) {
  const { t }      = useTranslation('environments')
  const formatDate = useEnvDateTime(env.config?.timezone)
  const url    = env.config?.primary_domain ? `https://${env.config.primary_domain}` : null

  const project = useCurrentProject()
  useEnvironments(projectId, project?.name ?? '')
  const { mutate: startEnv,   isPending: starting   } = useStartEnvironment(projectId)
  const { mutate: stopEnv,    isPending: stopping    } = useStopEnvironment(projectId)
  const { mutate: rebuildEnv, isPending: rebuilding  } = useRebuildEnvironment(projectId)
  const rebuildProgress = useProvisionProgress()
  const [showClone,         setShowClone        ] = React.useState(false)
  const [confirmingRebuild, setConfirmingRebuild] = React.useState(false)

  const canStart = env.runtime_state === 'stopped' || env.runtime_state === 'failed'
  const canStop  = env.runtime_state === 'running'
  const isBusy   = ['starting', 'stopping', 'provisioning'].includes(env.runtime_state)

  const handleRebuild = () => {
    setConfirmingRebuild(false)
    rebuildEnv(env.id, {
      onSuccess: result => rebuildProgress.start(env.mode, result.job_id),
      onError:   err    => toast({ title: t('overview.rebuildFailed'), description: err.message, variant: 'destructive' }),
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>{env.name}</CardTitle>
              <div className="flex items-center flex-wrap gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <CpuIcon className="h-3 w-3" />Odoo {env.odoo_version}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <InfoIcon className="h-3 w-3" />{t(`modes.${env.mode}` as 'modes.production')}
                </span>
                {env.branch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 font-mono">
                    <GitBranchIcon className="h-3 w-3 shrink-0" />{env.branch}
                  </span>
                )}
                {env.commit && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 font-mono">
                    <CheckIcon className="h-3 w-3 shrink-0" />{env.commit.slice(0, 7)}
                  </span>
                )}
                <EnvStatusBadge env={env} />
              </div>
            </div>
            {url && canStop && (
              <a href={url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-orange/20 bg-brand-orange-light text-xs font-semibold text-brand-orange-dark hover:border-brand-orange/30 transition-colors shadow-sm shrink-0"
              >
                {t('overview.openInstance')} <ArrowUpRightIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="font-medium text-sm text-foreground">{t('overview.created')}</dt>
              <dd className="text-sm text-muted-foreground mt-0.5">{formatDate(env.created_at)}</dd>
            </div>
            <div>
              <dt className="font-medium text-sm text-foreground">{t('overview.updated')}</dt>
              <dd className="text-sm text-muted-foreground mt-0.5">{formatDate(env.updated_at)}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 border-t border-zinc-100 dark:border-zinc-700 pt-4">
          <div className="flex gap-2 w-full">
            {canStart && (
              <Button variant="outline" loading={starting} icon={<PlayIcon className="h-3.5 w-3.5" />}
                className="border-brand-teal/30 text-brand-teal hover:bg-brand-teal-light"
                onClick={() => startEnv(env.id, { onError: err => toast({ title: t('overview.startFailed'), description: err.message, variant: 'destructive' }) })}
              >{t('overview.start')}</Button>
            )}
            {canStop && (
              <Button variant="outline" loading={stopping} icon={<SquareIcon className="h-3.5 w-3.5" />}
                className="border-red-400/20 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => stopEnv(env.id, { onError: err => toast({ title: t('overview.stopFailed'), description: err.message, variant: 'destructive' }) })}
              >{t('overview.stop')}</Button>
            )}
            <Button variant="outline" icon={<CopyIcon className="h-3.5 w-3.5" />}
              className="border-brand-orange/20 text-brand-orange-dark hover:bg-brand-orange-light"
              onClick={() => setShowClone(true)}
            >{t('overview.clone')}</Button>
            {!project?.locked && (
              <Button variant="outline" loading={rebuilding} disabled={isBusy} icon={<RotateCcwIcon className="h-3.5 w-3.5" />}
                className="border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                onClick={() => setConfirmingRebuild(true)}
              >{t('overview.rebuild')}</Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={confirmingRebuild} onOpenChange={setConfirmingRebuild}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('overview.rebuildDialog.title')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription>{t('overview.rebuildDialog.description')}</DialogDescription>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingRebuild(false)}>{t('cancel', { ns: 'common' })}</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-transparent"
              onClick={handleRebuild}
            >
              {t('overview.rebuildDialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CloneDialog
        open={showClone}
        env={env}
        projectId={projectId}
        onClose={() => setShowClone(false)}
      />

      <ProvisionProgressModal
        open={rebuildProgress.status !== 'idle'}
        status={rebuildProgress.status}
        mode="rebuild"
        stage={rebuildProgress.stage}
        stages={rebuildProgress.stages}
        pct={rebuildProgress.pct}
        error={rebuildProgress.error}
        onClose={rebuildProgress.dismiss}
      />
    </div>
  )
}
