import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { HardDriveIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateBackup } from '@/features/environments/api/use_backups'
import { toast } from '@/hooks/use_toast'
import type { BackupType, Environment } from '@/features/environments/types/environment.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogDescription } from '@/components/dialog'
import Button from '@/components/button'

type FormValues = {
  backup_type: 'full' | 'database'
  description: string
}

interface Props {
  open:      boolean
  env:       Environment
  projectId: string
  onClose:   () => void
}

export default function CreateBackupDialog({ open, env, projectId, onClose }: Props) {
  const { t } = useTranslation('backups')
  const { mutate: createBackup, isPending } = useCreateBackup(projectId)

  const BACKUP_TYPES = [
    { id: 'full'     as const, label: t('createDialog.full'),     desc: t('createDialog.fullDesc')     },
    { id: 'database' as const, label: t('createDialog.database'), desc: t('createDialog.databaseDesc') },
  ]

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: { backup_type: 'full', description: '' },
  })

  const backupType = watch('backup_type')

  const onSubmit = handleSubmit(values => {
    createBackup(
      { envId: env.id, backupType: values.backup_type as BackupType, description: values.description?.trim() ?? '' },
      {
        onSuccess: () => { reset(); onClose(); toast({ title: t('createDialog.started') }) },
        onError:   err => toast({ title: t('restoreDialog.failed', { defaultValue: 'Backup failed' }), description: err.message, variant: 'destructive' }),
      },
    )
  })

  return (
    <Dialog open={open} onOpenChange={open => { if (!isPending) { if (!open) { reset(); onClose() } } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('createDialog.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <DialogBody className="space-y-4">
            <DialogDescription
              dangerouslySetInnerHTML={{ __html: t('createDialog.description', { name: env.name }) }}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">{t('createDialog.backupType')}</label>
              <div className="grid grid-cols-2 gap-2">
                {BACKUP_TYPES.map(opt => {
                  const active = backupType === opt.id
                  return (
                    <button key={opt.id} type="button" onClick={() => setValue('backup_type', opt.id)}
                      className={cn(
                        'flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition-all',
                        active ? 'border-brand-teal bg-brand-teal-light ring-1 ring-brand-teal/20' : 'border-zinc-200 bg-white hover:border-zinc-300',
                      )}
                    >
                      <span className={cn('text-sm font-medium', active ? 'text-brand-teal' : 'text-zinc-900')}>{opt.label}</span>
                      <span className="text-xs text-zinc-500">{opt.desc}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="backup-description" className="text-sm font-medium text-zinc-700">
                {t('createDialog.descriptionLabel')} <span className="text-zinc-400 font-normal">({t('optional', { ns: 'common' })})</span>
              </label>
              <input
                id="backup-description"
                type="text"
                placeholder={t('createDialog.descriptionPlaceholder')}
                maxLength={120}
                {...register('description')}
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition"
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => { reset(); onClose() }} disabled={isPending}>{t('cancel', { ns: 'common' })}</Button>
            <Button type="submit" loading={isPending} icon={<HardDriveIcon className="h-3.5 w-3.5" />}>{t('createDialog.title')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
