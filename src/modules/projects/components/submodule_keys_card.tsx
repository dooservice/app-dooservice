import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GitBranchIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { useSubmoduleKeys, useAddSubmoduleKey, useDeleteSubmoduleKey } from '@/features/projects/api/use_project_keys'
import { toast } from '@/hooks/use_toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import Button from '@/components/button'
import Spinner from '@/components/spinner'
import CopyButton from '@/components/copy_button'

interface Props {
  projectId: string
}

type FormValues = { repo_url: string }

export default function SubmoduleKeysCard({ projectId }: Props) {
  const { t }                                               = useTranslation('projects')
  const { data: submodules = [], isPending }                = useSubmoduleKeys(projectId)
  const { mutate: addKey, isPending: adding }               = useAddSubmoduleKey(projectId)
  const { mutate: deleteKey, isPending: deleting }          = useDeleteSubmoduleKey(projectId)

  const schema = z.object({
    repo_url: z.string().min(1, t('submodule.urlRequired')),
  })

  const { register, handleSubmit, resetField, formState: { errors } } = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { repo_url: '' },
  })

  const onAdd = handleSubmit(values => {
    addKey(values.repo_url.trim(), {
      onSuccess: () => resetField('repo_url'),
      onError:   err => toast({ title: t('submodule.addFailed'), description: err.message, variant: 'destructive' }),
    })
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranchIcon className="h-4 w-4" />
          {t('submodule.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs font-medium text-zinc-500">{t('submodule.instruction')}</p>

        <form onSubmit={onAdd} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('submodule.placeholder')}
              {...register('repo_url')}
              className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
            />
            {errors.repo_url && <p className="text-xs text-red-600 mt-1">{errors.repo_url.message}</p>}
          </div>
          <Button type="submit" loading={adding} icon={<PlusIcon className="h-4 w-4" />}>{t('submodule.add')}</Button>
        </form>

        {isPending ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-5 w-5 text-zinc-400 animate-spin" />
          </div>
        ) : submodules.length === 0 ? (
          <p className="text-xs font-medium text-zinc-400 text-center py-3">{t('submodule.empty')}</p>
        ) : (
          <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 overflow-hidden">
            {submodules.map(submodule => (
              <div key={submodule.repo_url} className="p-3.5 space-y-2.5 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-[13px] font-mono font-semibold text-zinc-700 truncate">{submodule.repo_url}</code>
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={() => deleteKey(submodule.repo_url, {
                      onError: err => toast({ title: t('submodule.removeFailed'), description: err.message, variant: 'destructive' }),
                    })}
                    className="shrink-0 p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 flex items-center gap-3">
                  <code className="flex-1 text-[13px] font-mono text-zinc-700 truncate min-w-0">{submodule.public_key}</code>
                  <CopyButton text={submodule.public_key} />
                </div>
                <p className="text-xs font-medium text-zinc-400">{t('submodule.keyInstruction')}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
