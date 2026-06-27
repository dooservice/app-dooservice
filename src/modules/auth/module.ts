import i18n from '@/lib/i18n'
import type { IModule, Registry } from '@/core/types'
import { manifest } from './manifest'

import enAuth from '@/locales/en/auth.json'
import enSettings from '@/locales/en/settings.json'
import esAuth from '@/locales/es/auth.json'
import esSettings from '@/locales/es/settings.json'

export const AuthModule: IModule = {
  manifest,
  setup(_registry: Registry) {
    i18n.addResourceBundle('en', 'auth',     enAuth,     true, true)
    i18n.addResourceBundle('en', 'settings', enSettings, true, true)
    i18n.addResourceBundle('es', 'auth',     esAuth,     true, true)
    i18n.addResourceBundle('es', 'settings', esSettings, true, true)
  },
}
