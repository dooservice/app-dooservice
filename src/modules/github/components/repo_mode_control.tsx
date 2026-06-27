import { useTranslation } from 'react-i18next'
import { LinkIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type RepoMode = 'none' | 'create' | 'link'

interface Props {
  value:    RepoMode
  onChange: (mode: RepoMode) => void
  disabled: boolean
}

export default function RepoModeControl({ value, onChange, disabled }: Props) {
  const { t } = useTranslation('github')

  const OPTS = [
    { id: 'none'   as const, labelKey: 'repoMode.none',   icon: null,     requiresAuth: false },
    { id: 'create' as const, labelKey: 'repoMode.create', icon: PlusIcon, requiresAuth: true  },
    { id: 'link'   as const, labelKey: 'repoMode.link',   icon: LinkIcon, requiresAuth: true  },
  ]

  return (
    <div role="tablist" className="inline-flex w-full p-1 rounded-lg bg-zinc-100/80 border border-zinc-200">
      {OPTS.map(opt => {
        const Icon    = opt.icon
        const active  = value === opt.id
        const blocked = opt.requiresAuth && disabled
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={blocked}
            onClick={() => onChange(opt.id)}
            className={cn(
              'flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md text-sm font-medium transition-all',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              active
                ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200/50'
                : 'text-zinc-500 hover:text-zinc-700',
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {t(opt.labelKey as 'repoMode.none')}
          </button>
        )
      })}
    </div>
  )
}
