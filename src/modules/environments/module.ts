import i18n from '@/lib/i18n'
import type { IModule, Registry } from '@/core/types'
import { manifest } from './manifest'

import enEnvironments from '@/locales/en/environments.json'
import enBackups      from '@/locales/en/backups.json'
import enDeployments  from '@/locales/en/deployments.json'
import esEnvironments from '@/locales/es/environments.json'
import esBackups      from '@/locales/es/backups.json'
import esDeployments  from '@/locales/es/deployments.json'

export const EnvironmentsModule: IModule = {
  manifest,
  setup(_registry: Registry) {
    i18n.addResourceBundle('en', 'environments', enEnvironments, true, true)
    i18n.addResourceBundle('en', 'backups',      enBackups,      true, true)
    i18n.addResourceBundle('en', 'deployments',  enDeployments,  true, true)
    i18n.addResourceBundle('es', 'environments', esEnvironments, true, true)
    i18n.addResourceBundle('es', 'backups',      esBackups,      true, true)
    i18n.addResourceBundle('es', 'deployments',  esDeployments,  true, true)
  },
}
