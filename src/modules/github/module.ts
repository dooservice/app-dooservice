import i18n from '@/lib/i18n'
import type { IModule, Registry } from '@/core/types'
import { manifest } from './manifest'

import enGithub from '@/locales/en/github.json'
import esGithub from '@/locales/es/github.json'

export const GithubModule: IModule = {
  manifest,
  setup(_registry: Registry) {
    i18n.addResourceBundle('en', 'github', enGithub, true, true)
    i18n.addResourceBundle('es', 'github', esGithub, true, true)
  },
}
