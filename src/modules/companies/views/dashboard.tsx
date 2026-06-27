import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SparkleIcon, StoreIcon } from 'lucide-react'
import DashboardLayout from '@/modules/companies/components/dashboard_layout'
import { Card, CardContent } from '@/components/card'
import { useCurrentUser } from '@/modules/auth'

export default function DashboardPage() {
  const user    = useCurrentUser()
  const { t }   = useTranslation('projects')

  const title = user?.display_name ? t('welcome', { name: user.display_name }) : t('welcomeGeneric')

  return (
    <DashboardLayout
      title={title}
      breadcrumbs={[{ label: t('dashboard') }]}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/projects" className="group">
          <Card className="group-hover:border-zinc-600/40 transition-colors h-full">
            <CardContent className="flex items-center gap-3 p-5 h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light">
                <SparkleIcon className="h-5 w-5 text-brand-orange-dark" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t('projects')}</p>
                <p className="text-xs text-muted-foreground">{t('manageProjects')}</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="opacity-60 cursor-not-allowed h-full">
          <CardContent className="flex items-center gap-3 p-5 h-full">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
              <StoreIcon className="h-5 w-5 text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-zinc-500">{t('appsStore')}</p>
                <span className="text-[10px] font-semibold uppercase tracking-wide bg-zinc-100 text-zinc-500 rounded px-1.5 py-0.5">
                  {t('comingSoon', { ns: 'common' })}
                </span>
              </div>
              <p className="text-xs text-zinc-400">{t('browseApps')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
