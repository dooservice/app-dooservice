import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon       from '@/locales/en/common.json'
import enAuth         from '@/locales/en/auth.json'
import enBackups      from '@/locales/en/backups.json'
import enDeployments  from '@/locales/en/deployments.json'
import enEnvironments from '@/locales/en/environments.json'
import enProjects     from '@/locales/en/projects.json'
import enSettings     from '@/locales/en/settings.json'
import enGithub       from '@/locales/en/github.json'

import esCommon       from '@/locales/es/common.json'
import esAuth         from '@/locales/es/auth.json'
import esBackups      from '@/locales/es/backups.json'
import esDeployments  from '@/locales/es/deployments.json'
import esEnvironments from '@/locales/es/environments.json'
import esProjects     from '@/locales/es/projects.json'
import esSettings     from '@/locales/es/settings.json'
import esGithub       from '@/locales/es/github.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common:       enCommon,
        auth:         enAuth,
        backups:      enBackups,
        deployments:  enDeployments,
        environments: enEnvironments,
        projects:     enProjects,
        settings:     enSettings,
        github:       enGithub,
      },
      es: {
        common:       esCommon,
        auth:         esAuth,
        backups:      esBackups,
        deployments:  esDeployments,
        environments: esEnvironments,
        projects:     esProjects,
        settings:     esSettings,
        github:       esGithub,
      },
    },
    defaultNS:     'common',
    fallbackLng:   'en',
    supportedLngs: ['en', 'es'],
    interpolation: { escapeValue: false },
    detection: {
      order:  ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18next
