import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SparkleIcon } from 'lucide-react'
import DashboardLayout from '@/features/companies/components/dashboard_layout'
import { useCurrentProject } from '../api/use_projects'

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { t }         = useTranslation('projects')
  const { projectId } = useParams<{ projectId: string }>()
  const project       = useCurrentProject()

  return (
    <DashboardLayout
      breadcrumbs={[
        { label: t('projects'), href: '/projects' },
        {
          label: (
            <Link to={`/projects/${projectId}`} className="flex items-center gap-1.5">
              <SparkleIcon className="h-4 w-4 text-zinc-600" />
              <span>{project?.name ?? projectId}</span>
            </Link>
          ),
        },
      ]}
    >
      {children}
    </DashboardLayout>
  )
}
