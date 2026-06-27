import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { z } from 'zod'
import { useCurrentProject } from '@/modules/projects/api/use_projects'
import { useRepoBranches } from '@/modules/github/api/use_github'
import type { ProvisionEnvPayload } from '@/modules/environments/types/environment.types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from '@/components/dialog'
import InputField from '@/components/input_field'
import Button from '@/components/button'
import { cn } from '@/lib/utils'

type BranchMode = 'default' | 'existing' | 'new'

const schema = z.object({
  branchMode:     z.enum(['default', 'existing', 'new']),
  branch:         z.string(),
  sourceBranch:   z.string(),
  admin_email:    z.string().email(i18next.t('auth:validation.emailRequired')).or(z.literal('')),
  admin_password: z.string().optional(),
  neutralize:     z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open:     boolean
  onClose:  () => void
  onSubmit: (payload: ProvisionEnvPayload) => void
}

export default function ProvisionDialog({ open, onClose, onSubmit }: Props) {
  const { t }         = useTranslation('environments')
  const { projectId } = useParams<{ projectId: string }>()
  const project       = useCurrentProject()

  const BRANCH_MODES: { value: BranchMode; label: string; description: string }[] = [
    { value: 'default',  label: t('provisionDialog.branchDefault'),  description: t('provisionDialog.defaultBranchDesc') },
    { value: 'existing', label: t('provisionDialog.branchExisting'), description: '' },
    { value: 'new',      label: t('provisionDialog.branchNew'),      description: '' },
  ]

  const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { branchMode: 'default', branch: '', sourceBranch: '', admin_email: '', admin_password: '', neutralize: true },
  })

  const branchMode = watch('branchMode')

  const { data: branches = [] } = useRepoBranches(
    project?.has_repository ? project.repo_full_name : null
  )

  React.useEffect(() => { if (!open) reset() }, [open, reset])

  const onFormSubmit = handleSubmit(values => {
    let branch: string | undefined
    let newBranch: boolean | undefined
    let sourceBranch: string | undefined

    if (project?.has_repository) {
      if (values.branchMode === 'existing') {
        branch    = values.branch
        newBranch = false
      } else if (values.branchMode === 'new') {
        branch       = values.branch
        newBranch    = true
        sourceBranch = values.sourceBranch || undefined
      }
    }

    onSubmit({
      project_id:    projectId ?? '',
      project_name:  project?.name ?? '',
      mode:          'development',
      branch,
      new_branch:    newBranch,
      source_branch: sourceBranch,
      neutralize:    values.neutralize,
      ...(values.admin_email    && { admin_email:    values.admin_email }),
      ...(values.admin_password && { admin_password: values.admin_password }),
    })
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md gap-0">
        <DialogHeader><DialogTitle>{t('provisionDialog.title')}</DialogTitle></DialogHeader>
        <form onSubmit={onFormSubmit}>
          <DialogBody className="space-y-4">

            {project?.has_repository && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">{t('provisionDialog.branch')}</label>

                <Controller
                  name="branchMode"
                  control={control}
                  render={({ field }) => (
                    <div className="flex rounded-md border border-zinc-200 overflow-hidden text-sm">
                      {BRANCH_MODES.map(mode => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => field.onChange(mode.value)}
                          className={cn(
                            'flex-1 py-1.5 px-2 text-center transition-colors',
                            field.value === mode.value
                              ? 'bg-brand-teal text-white font-medium'
                              : 'bg-white text-zinc-600 hover:bg-zinc-50',
                          )}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}
                />

                {branchMode === 'default' && (
                  <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-200 rounded px-3 py-2">
                    {t('provisionDialog.defaultBranchDesc')}
                  </p>
                )}

                {branchMode === 'existing' && (
                  <Controller
                    name="branch"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                      >
                        <option value="">{t('provisionDialog.selectBranch')}</option>
                        {branches.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    )}
                  />
                )}

                {branchMode === 'new' && (
                  <div className="space-y-2">
                    <Controller
                      name="branch"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder={t('provisionDialog.newBranchPlaceholder')}
                          className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                      )}
                    />
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-500">{t('provisionDialog.forkFrom')}</label>
                      <Controller
                        name="sourceBranch"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                          >
                            <option value="">{t('provisionDialog.defaultBranch')}</option>
                            {branches.map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 cursor-pointer select-none">
                <input type="checkbox" {...register('neutralize')} className="accent-brand-teal" />
                {t('provisionDialog.neutralize')}
              </label>
              <p className="text-xs text-zinc-500 mt-1.5 pl-5">{t('provisionDialog.neutralizeDesc')}</p>
            </div>

            <InputField
              id="admin_email"
              label={t('provisionDialog.adminEmail')}
              placeholder="admin@example.com"
              type="email"
              {...register('admin_email')}
              error={errors.admin_email?.message}
            />
            <InputField
              id="admin_password"
              label={t('provisionDialog.adminPassword')}
              type="password"
              placeholder="••••••••"
              {...register('admin_password')}
            />
          </DialogBody>
          <DialogFooter>
            <Button type="submit">{t('provisionDialog.provisionBtn')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
