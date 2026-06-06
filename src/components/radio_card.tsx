import { cn } from '@/lib/utils'

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode
}

export default function RadioCard({ children, checked, className, ...props }: RadioCardProps) {
  return (
    <label className={cn(
      'relative cursor-pointer rounded-sm border text-sm transition-colors',
      checked ? 'border-brand-teal ring-2 ring-brand-teal/20' : 'border-neutral-300 hover:border-neutral-400',
      className,
    )}>
      <input type="radio" className="sr-only" checked={checked} {...props} />
      {children}
    </label>
  )
}
