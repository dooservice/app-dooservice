import * as React from 'react'
import { Input } from '@/components/input'
import { cn } from '@/lib/utils'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:       string | React.ReactNode
  labelRight?:  React.ReactNode
  error?:       string
  helper?:      string
  inputClassName?: string
  divClassName?:   string
  children?:    React.ReactNode
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, labelRight, error, helper, inputClassName, divClassName, children, className, id, ...inputProps }, ref) => (
    <div className={divClassName}>
      {label && (
        <div className="flex items-center space-x-2">
          <label htmlFor={id} className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
            <span className="mr-2">{label}</span>
            {labelRight}
          </label>
        </div>
      )}
      <div className={cn(label ? 'pt-1 flex w-full' : 'flex w-full')}>
        <Input ref={ref} id={id} className={inputClassName} {...inputProps} />
        {children}
      </div>
      {helper && <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{helper}</p>}
      {error  && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
)

InputField.displayName = 'InputField'
export default InputField
