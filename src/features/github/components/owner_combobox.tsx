import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GitHubOwner } from '@/features/github/api/use_github'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/command'

interface Props {
  owners:   GitHubOwner[]
  value:    string
  onChange: (login: string) => void
}

export default function OwnerCombobox({ owners, value, onChange }: Props) {
  const { t }             = useTranslation('github')
  const [open, setOpen]   = React.useState(false)
  const selected          = owners.find(owner => owner.login === value) ?? owners[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={owners.length === 0}
          className={cn(
            'flex items-center justify-between gap-2 h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm transition',
            'hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2 min-w-0">
              {selected.avatar_url && <img src={selected.avatar_url} alt="" className="h-5 w-5 rounded-full shrink-0" />}
              <span className="truncate text-zinc-900 font-medium">{selected.login}</span>
            </span>
          ) : (
            <span className="text-zinc-400">{t('ownerCombobox.selectOwner')}</span>
          )}
          <ChevronsUpDownIcon className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={t('ownerCombobox.searchOwner')} />
          <CommandList>
            <CommandEmpty>{t('ownerCombobox.noOwners')}</CommandEmpty>
            <CommandGroup>
              {owners.map(owner => (
                <CommandItem key={owner.login} value={owner.login} onSelect={login => { onChange(login); setOpen(false) }}>
                  {owner.avatar_url && <img src={owner.avatar_url} alt="" className="h-5 w-5 rounded-full shrink-0" />}
                  <span className="flex-1 truncate">{owner.login}</span>
                  <span className="text-[10px] uppercase tracking-wide text-zinc-400 font-medium">
                    {owner.type === 'org' ? t('ownerCombobox.org') : t('ownerCombobox.you')}
                  </span>
                  {owner.login === value && <CheckIcon className="h-3.5 w-3.5 text-brand-orange" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
