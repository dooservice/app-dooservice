import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogDescription, DialogFooter } from '@/components/dialog'
import StepIndicator from '@/components/step_indicator'
import type { ProvisionStatus } from '../api/use_provision_progress'

type ProgressMode = 'provision' | 'clone' | 'rebuild'

interface Props {
  open:    boolean
  status:  ProvisionStatus
  mode?:   ProgressMode
  stage:   string
  stages:  string[]
  pct:     number
  error?:  string
  onClose: () => void
}

export default function ProvisionProgressModal({ open, status, mode = 'provision', stage, stages, pct, error, onClose }: Props) {
  const { t } = useTranslation('environments')

  const isDone   = status === 'done'
  const isFailed = status === 'failed'
  const canClose = isDone || isFailed

  const activeIdx = stages.indexOf(stage)
  const modeKey   = `provision.${mode}` as const
  const title     = t(`${modeKey}.title` as 'provision.provision.title')
  const subtitle  = isDone
    ? t(`${modeKey}.done`    as 'provision.provision.done')
    : isFailed
    ? t(`${modeKey}.failed`  as 'provision.provision.failed')
    : t(`${modeKey}.running` as 'provision.provision.running')

  return (
    <Dialog open={open} onOpenChange={v => { if (!v && canClose) onClose() }}>
      <DialogContent className="sm:max-w-md" noClose={!canClose}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogBody className="space-y-5">
          <DialogDescription>{subtitle}</DialogDescription>
          <div className="space-y-5">
            <ul className="space-y-3">
              {stages.map((label, i) => {
                const done   = isDone || i < activeIdx
                const active = !isDone && i === activeIdx
                const failed = isFailed && i === activeIdx
                return (
                  <li key={label} className="flex items-center gap-3">
                    <StepIndicator done={done} active={active} failed={failed} />
                    <span className={cn('text-sm font-medium',
                      done   ? 'text-brand-teal'        :
                      active ? 'text-brand-orange-dark' :
                      failed ? 'text-red-700'           : 'text-zinc-400'
                    )}>
                      {label}
                    </span>
                  </li>
                )
              })}
            </ul>

            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500',
                    isDone ? 'bg-brand-teal' : isFailed ? 'bg-red-500' : 'bg-brand-orange'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-zinc-400 text-right">{pct}%</p>
            </div>

            {isFailed && error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}
            {!isDone && !isFailed && (
              <p className="text-xs text-zinc-400">{t('provision.takesMinutes')}</p>
            )}
          </div>
        </DialogBody>

        {canClose && (
          <DialogFooter>
            <button onClick={onClose} className="btn-secondary w-full sm:w-auto">
              {t('close', { ns: 'common' })}
            </button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
