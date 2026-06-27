import type { RuntimeState, EnvMode } from '@/modules/environments/types/environment.types'

export const RUNTIME: Record<RuntimeState, { dot: string; text: string; label: string }> = {
  running:      { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'Running' },
  stopped:      { dot: 'bg-zinc-400',    text: 'text-zinc-500',    label: 'Stopped' },
  starting:     { dot: 'bg-amber-400',    text: 'text-amber-600',    label: 'Starting' },
  stopping:     { dot: 'bg-yellow-400',  text: 'text-yellow-600',  label: 'Stopping' },
  provisioning: { dot: 'bg-amber-500',    text: 'text-amber-700',    label: 'Provisioning' },
  failed:       { dot: 'bg-red-500',     text: 'text-red-700',     label: 'Failed' },
}

export const ENV_GROUPS: { mode: EnvMode; label: string }[] = [
  { mode: 'development', label: 'Development' },
]

export const REGION_LABELS: Record<string, { label: string; flag: string }> = {
  'eu-west':  { label: 'Europe West',     flag: '🇩🇪' },
  'eu-north': { label: 'Europe North',    flag: '🇫🇮' },
  'us-east':  { label: 'US East',         flag: '🇺🇸' },
  'us-west':  { label: 'US West',         flag: '🇺🇸' },
  'sa-east':  { label: 'South America',   flag: '🇧🇷' },
  'ap-south': { label: 'Asia Pacific',    flag: '🇸🇬' },
}

