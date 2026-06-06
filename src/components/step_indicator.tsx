import { CheckIcon, XIcon, Loader2Icon } from 'lucide-react'

interface Props {
  done:   boolean
  active: boolean
  failed: boolean
}

export default function StepIndicator({ done, active, failed }: Props) {
  if (done) return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-teal shrink-0">
      <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
    </span>
  )
  if (failed) return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 shrink-0">
      <XIcon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
    </span>
  )
  if (active) return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
      <Loader2Icon className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 animate-spin" />
    </span>
  )
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 shrink-0">
      <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
    </span>
  )
}
