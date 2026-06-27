import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon, ChevronsUpDownIcon, FolderGitIcon, LockIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GitHubRepo } from '@/modules/github/api/use_github'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/command'

interface Props {
  repos:    GitHubRepo[]
  value:    string
  loading:  boolean
  onSelect: (fullName: string) => void
}

export default function RepoCombobox({ repos, value, loading, onSelect }: Props) {
  const { t }           = useTranslation('github')
  const [open, setOpen] = React.useState(false)
  const repoName        = value ? value.split('/').slice(1).join('/') : ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex items-center justify-between gap-2 h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm transition',
            'hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent',
          )}
        >
          {repoName ? (
            <span className="flex items-center gap-2 min-w-0">
              <FolderGitIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate text-zinc-900 font-medium">{repoName}</span>
            </span>
          ) : (
            <span className="text-zinc-400">{loading ? t('repoCombobox.loading') : t('repoCombobox.selectRepo')}</span>
          )}
          <ChevronsUpDownIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('repoCombobox.searchRepo')} />
          <CommandList>
            <CommandEmpty>{loading ? t('repoCombobox.loading') : t('repoCombobox.noRepos')}</CommandEmpty>
            <CommandGroup>
              {repos.map(repo => {
                const name = repo.full_name.split('/').slice(1).join('/')
                return (
                  <CommandItem key={repo.full_name} value={repo.full_name} onSelect={fullName => { onSelect(fullName); setOpen(false) }}>
                    <FolderGitIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span className="flex-1 truncate">{name}</span>
                    {repo.private && <LockIcon className="h-3 w-3 text-zinc-400 shrink-0" aria-label={t('repoCombobox.private')} />}
                    {repo.full_name === value && <CheckIcon className="h-3.5 w-3.5 text-brand-orange" />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
