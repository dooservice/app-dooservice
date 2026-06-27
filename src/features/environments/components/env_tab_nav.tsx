import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { DatabaseBackupIcon, GitBranchIcon, GitCommitIcon, InfoIcon, ScrollTextIcon, Settings2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'overview' | 'logs' | 'backups' | 'deployments' | 'settings' | 'submodules'

const TAB_ICONS: Record<TabId, React.ElementType> = {
  overview:    InfoIcon,
  logs:        ScrollTextIcon,
  backups:     DatabaseBackupIcon,
  deployments: GitCommitIcon,
  settings:    Settings2Icon,
  submodules:  GitBranchIcon,
}

const TAB_IDS: TabId[] = ['overview', 'deployments', 'logs', 'backups', 'submodules', 'settings']

interface Props {
  activeTab:        TabId
  onChange:         (tab: TabId) => void
  hideSettings?:    boolean
  hasRepository?:   boolean
}

export default function EnvTabNav({ activeTab, onChange, hideSettings, hasRepository }: Props) {
  const { t } = useTranslation('environments')
  const tabIds = TAB_IDS.filter(id => {
    if (id === 'settings')   return !hideSettings
    if (id === 'submodules') return !hideSettings && !!hasRepository
    return true
  })

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-700">
      <ul className="flex items-center text-sm">
        {tabIds.map(id => {
          const Icon = TAB_ICONS[id]
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2.5 font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
                  activeTab === id
                    ? 'border-brand-teal text-brand-teal'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600',
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {t(`tabs.${id}`)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
