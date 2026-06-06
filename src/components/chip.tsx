interface Props {
  label: string
}

export default function Chip({ label }: Props) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
      {label}
    </span>
  )
}
