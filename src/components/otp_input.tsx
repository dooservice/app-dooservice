import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'

interface OtpInputProps {
  onChange: (value: string) => void
  disabled?: boolean
  length?: number
}

export default function OtpInput({ onChange, disabled = false, length = 6 }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const update = (next: string[]) => {
    setDigits(next)
    onChange(next.join(''))
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...digits]
    next[index] = value.slice(-1)
    update(next)
    if (value && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next = Array(length).fill('')
    text.split('').forEach((d, i) => { next[i] = d })
    update(next)
    refs.current[Math.min(text.length, length - 1)]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-11 h-12 text-center text-xl font-mono border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-50 bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600"
        />
      ))}
    </div>
  )
}
