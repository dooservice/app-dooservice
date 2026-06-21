import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowUpRightIcon, ExternalLinkIcon, LockIcon, MoreHorizontalIcon, Settings2Icon, Trash2Icon, UnlockIcon } from 'lucide-react'
import { IconBrandGithub } from '@tabler/icons-react'
import { useRelativeTime } from '@/lib/date'
import { Card } from '@/components/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogDescription } from '@/components/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/dropdown_menu'
import Chip from '@/components/chip'
import Button from '@/components/button'
import type { Project } from '../types/project.types'
import { useDeleteProject, useLockProject, useUnlockProject } from '../api/use_projects'

export default function ProjectCard({ project }: { project: Project }) {
  const { t }        = useTranslation('projects')
  const relativeTime = useRelativeTime()
  const navigate                             = useNavigate()
  const { mutate: deleteProject, isPending } = useDeleteProject()
  const { mutate: lockProject }              = useLockProject()
  const { mutate: unlockProject }            = useUnlockProject()
  const [confirm, setConfirm]                = React.useState(false)
  const path       = `/projects/${project.id}`
  const configPath = `/projects/${project.id}/config`

  return (
    <>
      <Card className="group relative flex flex-col p-5 transition-colors hover:border-zinc-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link to={path} className="font-serif text-2xl text-zinc-900 dark:text-zinc-100 leading-tight tracking-normal hover:text-brand-teal transition-colors truncate">
              {project.name}
            </Link>
            {project.locked && (
              <LockIcon className="h-4 w-4 flex-none text-amber-500" />
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t('aria.projectActions', { ns: 'common' })}
                className="flex-none rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!project.locked && (
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(configPath)}>
                  <Settings2Icon className="mr-2 h-4 w-4" />{t('card.config')}
                </DropdownMenuItem>
              )}
              {project.locked ? (
                <DropdownMenuItem className="cursor-pointer" onClick={() => unlockProject(project.id)}>
                  <UnlockIcon className="mr-2 h-4 w-4" />{t('card.unlock')}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="cursor-pointer" onClick={() => lockProject(project.id)}>
                  <LockIcon className="mr-2 h-4 w-4" />{t('card.lock')}
                </DropdownMenuItem>
              )}
              {!project.locked && (
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-700"
                  onClick={() => setConfirm(true)}
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />{t('card.delete')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <Chip label={`Odoo ${project.odoo_version}`} />
          <Chip label={project.region} />
          {project.has_repository && (
            <a
              href={`https://github.com/${project.repo_full_name}`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1 h-6 px-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 hover:border-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              <IconBrandGithub className="h-3.5 w-3.5" />
              <ExternalLinkIcon className="h-3 w-3 text-zinc-400 flex-none" />
            </a>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between text-xs">
          <span className="text-zinc-400 dark:text-zinc-500">
            {t('card.created', { date: relativeTime(project.created_at)})}
          </span>
          <Link to={path} className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium hover:text-brand-teal transition-colors">
            {t('card.open')}<ArrowUpRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Card>

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('card.deleteTitle')}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <DialogDescription
              dangerouslySetInnerHTML={{ __html: t('card.deleteDescription', { name: project.name }) }}
            />
          </DialogBody>
          <DialogFooter>
            <Button variant="destructive" loading={isPending}
              onClick={() => deleteProject({ id: project.id, name: project.name }, { onSuccess: () => setConfirm(false) })}
            >{t('card.deleteConfirm')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
