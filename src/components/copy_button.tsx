import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { CheckIcon, CopyIcon } from 'lucide-react'
import copyToClipboard from 'copy-text-to-clipboard'

interface Props {
  text: string
}

export default function CopyButton({ text }: Props) {
  const { t }               = useTranslation()
  const [copied, setCopied] = React.useState(false)

  const copy = () => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
    >
      {copied ? <CheckIcon className="h-3.5 w-3.5 text-brand-teal" /> : <CopyIcon className="h-3.5 w-3.5" />}
      {copied ? t('copied') : t('copy')}
    </button>
  )
}
