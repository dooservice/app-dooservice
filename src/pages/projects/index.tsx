import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlusCircleIcon } from 'lucide-react'
import DashboardLayout from '@/features/companies/components/dashboard_layout'
import Spinner from '@/components/spinner'
import ProjectCard from '@/features/projects/components/project_card'
import ProjectsEmptyState from '@/features/projects/components/projects_empty_state'
import { useProjects } from '@/features/projects/api/use_projects'

export default function ProjectsIndexPage() {
  const { t } = useTranslation('projects')
  const { data: projects = [], isPending, isError } = useProjects()

  return (
    <DashboardLayout
      title={
        <span className="inline-flex items-baseline gap-2">
          {t('projects')}
          {!isPending && (
            <span className="text-base font-sans font-medium text-zinc-400 tabular-nums">
              ({projects.length})
            </span>
          )}
        </span>
      }
      breadcrumbs={[{ label: t('projects') }]}
      actionButton={
        <Link className="btn-primary" to="/projects/create">
          <PlusCircleIcon className="h-4 w-4" />
          <span>{t('newProject')}</span>
        </Link>
      }
    >
      {isPending ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6 text-zinc-400 animate-spin" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-600 text-center py-8">{t('failedToLoad')}</p>
      ) : projects.length === 0 ? (
        <ProjectsEmptyState createPath="/projects/create" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </DashboardLayout>
  )
}
