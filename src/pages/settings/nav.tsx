import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function SettingsNav() {
  const { t } = useTranslation('settings')

  const link = (to: string, label: string) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn('text-sm transition-colors', isActive ? 'font-semibold text-zinc-900' : 'text-zinc-500 hover:text-zinc-800')
      }
    >
      {label}
    </NavLink>
  )

  return (
    <nav className="flex flex-col gap-4">
      {link('/settings/account', t('nav.account'))}
    </nav>
  )
}
