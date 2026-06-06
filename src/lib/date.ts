import { parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'

function relativeTimeFromDate(date: Date, locale: string): string {
  const now       = new Date()
  const diffMs    = date.getTime() - now.getTime()
  const diffSec   = Math.round(diffMs / 1000)
  const diffMin   = Math.round(diffSec / 60)
  const diffHour  = Math.round(diffMin / 60)
  const diffDay   = Math.round(diffHour / 24)
  const diffWeek  = Math.round(diffDay / 7)
  const diffMonth = Math.round(diffDay / 30)
  const diffYear  = Math.round(diffMonth / 12)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' })

  if (Math.abs(diffSec)  < 60)  return rtf.format(diffSec,   'second')
  if (Math.abs(diffMin)  < 60)  return rtf.format(diffMin,   'minute')
  if (Math.abs(diffHour) < 24)  return rtf.format(diffHour,  'hour')
  if (Math.abs(diffDay)  <= 7)  return rtf.format(diffDay,   'day')
  if (Math.abs(diffDay)  < 30)  return rtf.format(diffWeek,  'week')
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, 'month')
  return rtf.format(diffYear, 'year')
}

export function useRelativeTime() {
  const { i18n } = useTranslation()
  const locale   = i18n.resolvedLanguage ?? 'en'

  return (isoString: string) =>
    relativeTimeFromDate(parseISO(isoString), locale)
}

export function useEnvDateTime(timezone: string) {
  const { i18n } = useTranslation()
  const locale   = i18n.resolvedLanguage ?? 'en'
  const tz       = timezone || 'UTC'

  return (isoString: string) =>
    new Intl.DateTimeFormat(locale, {
      timeZone: tz,
      day:      '2-digit',
      month:    'short',
      year:     'numeric',
      hour:     '2-digit',
      minute:   '2-digit',
    }).format(parseISO(isoString))
}
