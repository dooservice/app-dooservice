import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/modules/companies/components/dashboard_layout'
import { SettingsNav } from './nav'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation('settings')

  return (
    <DashboardLayout title={t('title')} breadcrumbs={[{ label: t('title') }]}>
      <div className="grid gap-6 sm:grid-cols-4 lg:grid-cols-5">
        <div>
          <SettingsNav />
        </div>
        <div className="sm:col-span-3 lg:col-span-4 space-y-6">
          {children}
        </div>
      </div>
    </DashboardLayout>
  )
}
