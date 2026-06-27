import i18n from '@/lib/i18n'
import type { IModule, Registry } from '@/core/types'
import { manifest } from './manifest'

import enProjects from '@/locales/en/projects.json'
import esProjects from '@/locales/es/projects.json'

export const ProjectsModule: IModule = {
  manifest,
  setup(_registry: Registry) {
    i18n.addResourceBundle('en', 'projects', enProjects, true, true)
    i18n.addResourceBundle('es', 'projects', esProjects, true, true)
  },
}
