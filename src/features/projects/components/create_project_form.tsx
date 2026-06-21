import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { z } from 'zod'
import { CheckIcon, ChevronDownIcon, GitBranchIcon, LockIcon, Settings2Icon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGION_LABELS } from '@/lib/constants'
import { env } from '@/config/env'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select'
import Button from '@/components/button'
import { useAgents } from '@/features/agents/api/use_agents'
import { usePlans } from '@/features/plans/api/use_plans'
import { useCreateProject, useProjectNameAvailable } from '@/features/projects/api/use_projects'
import { useProvisionProgress } from '@/features/environments/api/use_provision_progress'
import ProvisionProgressModal from '@/features/environments/components/provision_progress_modal'
import { useGitHubStatus, useGitHubOrgs, useGitHubRepos, useCreateGitHubRepo } from '@/features/github/api/use_github'
import RepoModeControl, { type RepoMode } from '@/features/github/components/repo_mode_control'
import OwnerCombobox from '@/features/github/components/owner_combobox'
import RepoCombobox from '@/features/github/components/repo_combobox'

const ODOO_VERSIONS = ['19.0', '18.0', '17.0', '16.0']

const LANGUAGES = [
  { value: 'en_US', label: 'English (US)' },
  { value: 'en_GB', label: 'English (UK)' },
  { value: 'es_ES', label: 'Español (España)' },
  { value: 'es_MX', label: 'Español (México)' },
  { value: 'es_AR', label: 'Español (Argentina)' },
  { value: 'es_CO', label: 'Español (Colombia)' },
  { value: 'es_PE', label: 'Español (Perú)' },
  { value: 'es_CL', label: 'Español (Chile)' },
  { value: 'es_VE', label: 'Español (Venezuela)' },
  { value: 'pt_BR', label: 'Português (Brasil)' },
  { value: 'pt_PT', label: 'Português (Portugal)' },
  { value: 'fr_FR', label: 'Français (France)' },
  { value: 'fr_BE', label: 'Français (Belgique)' },
  { value: 'fr_CH', label: 'Français (Suisse)' },
  { value: 'de_DE', label: 'Deutsch (Deutschland)' },
  { value: 'de_AT', label: 'Deutsch (Österreich)' },
  { value: 'de_CH', label: 'Deutsch (Schweiz)' },
  { value: 'it_IT', label: 'Italiano' },
  { value: 'nl_NL', label: 'Nederlands (Nederland)' },
  { value: 'nl_BE', label: 'Nederlands (België)' },
  { value: 'pl_PL', label: 'Polski' },
  { value: 'ru_RU', label: 'Русский' },
  { value: 'uk_UA', label: 'Українська' },
  { value: 'tr_TR', label: 'Türkçe' },
  { value: 'ar_001', label: 'العربية' },
  { value: 'he_IL', label: 'עברית' },
  { value: 'zh_CN', label: '中文 (简体)' },
  { value: 'zh_TW', label: '中文 (繁體)' },
  { value: 'ja_JP', label: '日本語' },
  { value: 'ko_KR', label: '한국어' },
  { value: 'hi_IN', label: 'हिन्दी' },
  { value: 'vi_VN', label: 'Tiếng Việt' },
  { value: 'th_TH', label: 'ภาษาไทย' },
  { value: 'id_ID', label: 'Bahasa Indonesia' },
  { value: 'ms_MY', label: 'Bahasa Melayu' },
  { value: 'sv_SE', label: 'Svenska' },
  { value: 'nb_NO', label: 'Norsk Bokmål' },
  { value: 'da_DK', label: 'Dansk' },
  { value: 'fi_FI', label: 'Suomi' },
  { value: 'cs_CZ', label: 'Čeština' },
  { value: 'sk_SK', label: 'Slovenčina' },
  { value: 'hu_HU', label: 'Magyar' },
  { value: 'ro_RO', label: 'Română' },
  { value: 'bg_BG', label: 'Български' },
  { value: 'hr_HR', label: 'Hrvatski' },
  { value: 'sl_SI', label: 'Slovenščina' },
  { value: 'lt_LT', label: 'Lietuvių' },
  { value: 'lv_LV', label: 'Latviešu' },
  { value: 'et_EE', label: 'Eesti' },
  { value: 'el_GR', label: 'Ελληνικά' },
  { value: 'ca_ES', label: 'Català' },
  { value: 'eu_ES', label: 'Euskara' },
  { value: 'gl_ES', label: 'Galego' },
  { value: 'af_ZA', label: 'Afrikaans' },
  { value: 'sq_AL', label: 'Shqip' },
  { value: 'fa_IR', label: 'فارسی' },
  { value: 'ur_PK', label: 'اردو' },
]

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York',      label: 'America/New_York (ET)' },
  { value: 'America/Chicago',       label: 'America/Chicago (CT)' },
  { value: 'America/Denver',        label: 'America/Denver (MT)' },
  { value: 'America/Los_Angeles',   label: 'America/Los_Angeles (PT)' },
  { value: 'America/Anchorage',     label: 'America/Anchorage (AKT)' },
  { value: 'Pacific/Honolulu',      label: 'Pacific/Honolulu (HST)' },
  { value: 'America/Toronto',       label: 'America/Toronto' },
  { value: 'America/Vancouver',     label: 'America/Vancouver' },
  { value: 'America/Mexico_City',   label: 'America/Mexico_City' },
  { value: 'America/Bogota',        label: 'America/Bogota' },
  { value: 'America/Lima',          label: 'America/Lima' },
  { value: 'America/Caracas',       label: 'America/Caracas' },
  { value: 'America/La_Paz',        label: 'America/La_Paz' },
  { value: 'America/Santiago',      label: 'America/Santiago' },
  { value: 'America/Argentina/Buenos_Aires', label: 'America/Argentina/Buenos_Aires' },
  { value: 'America/Sao_Paulo',     label: 'America/Sao_Paulo' },
  { value: 'America/Montevideo',    label: 'America/Montevideo' },
  { value: 'America/Asuncion',      label: 'America/Asuncion' },
  { value: 'America/Guayaquil',     label: 'America/Guayaquil' },
  { value: 'America/Havana',        label: 'America/Havana' },
  { value: 'America/Santo_Domingo', label: 'America/Santo_Domingo' },
  { value: 'America/Puerto_Rico',   label: 'America/Puerto_Rico' },
  { value: 'America/Panama',        label: 'America/Panama' },
  { value: 'America/Costa_Rica',    label: 'America/Costa_Rica' },
  { value: 'America/Guatemala',     label: 'America/Guatemala' },
  { value: 'America/Tegucigalpa',   label: 'America/Tegucigalpa' },
  { value: 'America/Managua',       label: 'America/Managua' },
  { value: 'America/El_Salvador',   label: 'America/El_Salvador' },
  { value: 'Europe/London',         label: 'Europe/London (GMT)' },
  { value: 'Europe/Lisbon',         label: 'Europe/Lisbon' },
  { value: 'Europe/Madrid',         label: 'Europe/Madrid' },
  { value: 'Europe/Paris',          label: 'Europe/Paris' },
  { value: 'Europe/Berlin',         label: 'Europe/Berlin' },
  { value: 'Europe/Rome',           label: 'Europe/Rome' },
  { value: 'Europe/Amsterdam',      label: 'Europe/Amsterdam' },
  { value: 'Europe/Brussels',       label: 'Europe/Brussels' },
  { value: 'Europe/Zurich',         label: 'Europe/Zurich' },
  { value: 'Europe/Vienna',         label: 'Europe/Vienna' },
  { value: 'Europe/Warsaw',         label: 'Europe/Warsaw' },
  { value: 'Europe/Prague',         label: 'Europe/Prague' },
  { value: 'Europe/Budapest',       label: 'Europe/Budapest' },
  { value: 'Europe/Bucharest',      label: 'Europe/Bucharest' },
  { value: 'Europe/Sofia',          label: 'Europe/Sofia' },
  { value: 'Europe/Athens',         label: 'Europe/Athens' },
  { value: 'Europe/Helsinki',       label: 'Europe/Helsinki' },
  { value: 'Europe/Stockholm',      label: 'Europe/Stockholm' },
  { value: 'Europe/Oslo',           label: 'Europe/Oslo' },
  { value: 'Europe/Copenhagen',     label: 'Europe/Copenhagen' },
  { value: 'Europe/Dublin',         label: 'Europe/Dublin' },
  { value: 'Europe/Moscow',         label: 'Europe/Moscow' },
  { value: 'Europe/Kiev',           label: 'Europe/Kiev' },
  { value: 'Europe/Istanbul',       label: 'Europe/Istanbul' },
  { value: 'Asia/Dubai',            label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Riyadh',           label: 'Asia/Riyadh' },
  { value: 'Asia/Kuwait',           label: 'Asia/Kuwait' },
  { value: 'Asia/Beirut',           label: 'Asia/Beirut' },
  { value: 'Asia/Jerusalem',        label: 'Asia/Jerusalem' },
  { value: 'Asia/Amman',            label: 'Asia/Amman' },
  { value: 'Asia/Baghdad',          label: 'Asia/Baghdad' },
  { value: 'Asia/Tehran',           label: 'Asia/Tehran' },
  { value: 'Asia/Karachi',          label: 'Asia/Karachi' },
  { value: 'Asia/Kolkata',          label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Dhaka',            label: 'Asia/Dhaka' },
  { value: 'Asia/Yangon',           label: 'Asia/Yangon' },
  { value: 'Asia/Bangkok',          label: 'Asia/Bangkok' },
  { value: 'Asia/Ho_Chi_Minh',      label: 'Asia/Ho_Chi_Minh' },
  { value: 'Asia/Jakarta',          label: 'Asia/Jakarta' },
  { value: 'Asia/Kuala_Lumpur',     label: 'Asia/Kuala_Lumpur' },
  { value: 'Asia/Singapore',        label: 'Asia/Singapore' },
  { value: 'Asia/Shanghai',         label: 'Asia/Shanghai (CST)' },
  { value: 'Asia/Hong_Kong',        label: 'Asia/Hong_Kong' },
  { value: 'Asia/Taipei',           label: 'Asia/Taipei' },
  { value: 'Asia/Seoul',            label: 'Asia/Seoul' },
  { value: 'Asia/Tokyo',            label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Manila',           label: 'Asia/Manila' },
  { value: 'Asia/Almaty',           label: 'Asia/Almaty' },
  { value: 'Asia/Tashkent',         label: 'Asia/Tashkent' },
  { value: 'Asia/Tbilisi',          label: 'Asia/Tbilisi' },
  { value: 'Asia/Yerevan',          label: 'Asia/Yerevan' },
  { value: 'Asia/Baku',             label: 'Asia/Baku' },
  { value: 'Asia/Colombo',          label: 'Asia/Colombo' },
  { value: 'Asia/Kathmandu',        label: 'Asia/Kathmandu' },
  { value: 'Africa/Cairo',          label: 'Africa/Cairo' },
  { value: 'Africa/Lagos',          label: 'Africa/Lagos' },
  { value: 'Africa/Johannesburg',   label: 'Africa/Johannesburg' },
  { value: 'Africa/Nairobi',        label: 'Africa/Nairobi' },
  { value: 'Africa/Accra',          label: 'Africa/Accra' },
  { value: 'Africa/Casablanca',     label: 'Africa/Casablanca' },
  { value: 'Africa/Tunis',          label: 'Africa/Tunis' },
  { value: 'Africa/Algiers',        label: 'Africa/Algiers' },
  { value: 'Africa/Tripoli',        label: 'Africa/Tripoli' },
  { value: 'Australia/Sydney',      label: 'Australia/Sydney (AEST)' },
  { value: 'Australia/Melbourne',   label: 'Australia/Melbourne' },
  { value: 'Australia/Brisbane',    label: 'Australia/Brisbane' },
  { value: 'Australia/Perth',       label: 'Australia/Perth' },
  { value: 'Australia/Adelaide',    label: 'Australia/Adelaide' },
  { value: 'Pacific/Auckland',      label: 'Pacific/Auckland' },
  { value: 'Pacific/Fiji',          label: 'Pacific/Fiji' },
]

const tv = (key: string): string => i18next.t(`projects:validation.${key}` as never)

const schema = z.object({
  name: z.string()
    .min(1, tv('nameRequired'))
    .min(3, tv('nameMin'))
    .max(40, tv('nameMax'))
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, tv('nameFormat')),
  region:         z.string().min(1, tv('regionRequired')),
  odoo_version:   z.string().min(1, tv('versionRequired')),
  timezone:       z.string().min(1, tv('timezoneRequired')),
  language:       z.string().min(1, tv('languageRequired')),
  admin_email:    z.string().email(tv('emailRequired')),
  admin_password: z.string().min(8, tv('passwordMin')),
})

type FormValues = z.infer<typeof schema>

function PlanFeatureRow({ included, label }: { included: boolean; label: string }) {
  return (
    <li className={cn('flex items-center gap-1.5', included ? 'text-zinc-600' : 'text-zinc-400')}>
      {included
        ? <CheckIcon className="h-3 w-3 text-emerald-600 shrink-0" />
        : <XIcon className="h-3 w-3 text-zinc-300 shrink-0" />}
      <span className={included ? '' : 'opacity-60'}>{label}</span>
    </li>
  )
}

export default function CreateProjectForm() {
  const { t }                         = useTranslation('projects')
  const navigate                      = useNavigate()
  const { data: agents = [] }         = useAgents()
  const { data: plans = [] }          = usePlans()
  const { mutate: create, isPending } = useCreateProject()
  const { data: ghStatus }            = useGitHubStatus()
  const provision                     = useProvisionProgress()
  const createdProjectIdRef           = React.useRef<string | null>(null)
  const [showLocalization, setShowLocalization] = React.useState(false)

  React.useEffect(() => {
    if (provision.status !== 'done' || !createdProjectIdRef.current) return
    navigate(`/projects/${createdProjectIdRef.current}`)
  }, [provision.status, navigate])

  const [planId, setPlanId]               = React.useState('free')
  const [extraWorkersProduction, setExtraWorkersProduction]   = React.useState(0)
  const [extraStorageGb, setExtraStorageGb]                   = React.useState(0)
  const [extraDevEnvironments, setExtraDevEnvironments]       = React.useState(0)

  React.useEffect(() => {
    const defaultPlan = plans.find(p => p.is_default)
    if (defaultPlan) setPlanId(defaultPlan.id)
  }, [plans])

  const selectedPlan = plans.find(p => p.id === planId)
  const isPaidPlan    = !!selectedPlan && !selectedPlan.is_default

  const [repoMode, setRepoMode]           = React.useState<RepoMode>('none')
  const [newRepoName, setNewRepoName]     = React.useState('')
  const [selectedOwner, setSelectedOwner] = React.useState('')
  const [selectedRepo, setSelectedRepo]   = React.useState('')
  const [repoSearch, setRepoSearch]       = React.useState('')

  const connected = !!ghStatus?.connected
  const { data: owners = [] } = useGitHubOrgs(connected)
  const { data: repos = [], isFetching: loadingRepos } = useGitHubRepos(
    repoMode === 'link' ? selectedOwner : null,
    repoMode === 'link' && connected,
  )
  const { mutate: createRepo, isPending: creatingRepo } = useCreateGitHubRepo()

  React.useEffect(() => {
    if (owners.length > 0 && !selectedOwner) setSelectedOwner(owners[0].login)
  }, [owners, selectedOwner])

  const filteredRepos = repos.filter(repo =>
    !repoSearch || repo.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  )

  const onlineRegions = [...new Set(agents.filter(agent => agent.online).map(agent => agent.region))]

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    resolver:      zodResolver(schema),
    defaultValues: { name: '', region: '', odoo_version: '19.0', timezone: 'UTC', language: 'en_US', admin_email: '', admin_password: '' },
  })

  const projectName     = watch('name')
  const selectedRegion  = watch('region')
  const selectedVersion = watch('odoo_version')

  const { data: nameAvailable, isFetching: checkingName } = useProjectNameAvailable(projectName)
  const nameAlreadyExists = nameAvailable === false

  React.useEffect(() => {
    if (repoMode === 'create' && projectName) setNewRepoName(projectName)
  }, [projectName, repoMode])

  const handleSubmitForm = handleSubmit(async formData => {
    let repoFullName      = ''
    let repoId            = 0
    let repoDefaultBranch = 'main'

    if (repoMode === 'create' && connected) {
      await new Promise<void>((resolve, reject) => {
        createRepo({ name: newRepoName || formData.name, private: true, owner: selectedOwner }, {
          onSuccess: repo => {
            repoFullName      = repo.full_name
            repoId            = repo.id
            repoDefaultBranch = repo.default_branch
            resolve()
          },
          onError: reject,
        })
      })
    } else if (repoMode === 'link' && selectedRepo) {
      const repo = repos.find(repoItem => repoItem.full_name === selectedRepo)
      if (repo) {
        repoFullName      = repo.full_name
        repoId            = repo.id
        repoDefaultBranch = repo.default_branch
      }
    }

    create({
      name:           formData.name,
      region:         formData.region,
      has_repository: repoMode !== 'none',
      odoo_version:   formData.odoo_version,
      timezone:       formData.timezone,
      language:       formData.language,
      admin_email:    formData.admin_email,
      admin_password: formData.admin_password,
      repo_full_name: repoFullName || undefined,
      repo_id:        repoId || undefined,
      default_branch: repoDefaultBranch,
      plan_id:                         planId,
      extra_workers_production:       isPaidPlan ? extraWorkersProduction : 0,
      extra_storage_gb:                isPaidPlan ? extraStorageGb        : 0,
      extra_development_environments:  isPaidPlan ? extraDevEnvironments  : 0,
    }, {
      onSuccess: result => {
        createdProjectIdRef.current = result.project_id
        provision.start('production', result.env_job_id)
      },
    })
  })

  return (
    <>
      <div className="flex justify-center">
        <form className="w-full max-w-3xl space-y-4" onSubmit={handleSubmitForm}>
          <Card>
            <CardHeader>
              <CardTitle>{t('createForm.title')}</CardTitle>
              <CardDescription>{t('createForm.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-zinc-700">{t('createForm.projectName')}</label>
                <input
                  id="name"
                  type="text"
                  placeholder="my-odoo-project"
                  {...register('name')}
                  onChange={e => setValue('name', e.target.value.toLowerCase().replace(/\s+/g, '-'), { shouldValidate: true })}
                  className={cn(
                    'w-full h-9 rounded-md border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition',
                    'focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent',
                    errors.name || nameAlreadyExists ? 'border-red-300' : 'border-zinc-200',
                  )}
                />
                {nameAlreadyExists
                  ? <p className="text-xs text-red-600">{t('createForm.nameTaken')}</p>
                  : errors.name
                  ? <p className="text-xs text-red-600">{errors.name.message}</p>
                  : checkingName && projectName.length >= 3
                  ? <p className="text-xs text-zinc-400">{t('createForm.checkingName')}</p>
                  : nameAvailable === true
                  ? <p className="text-xs text-emerald-600">{t('createForm.nameAvailable')}</p>
                  : null
                }
                <p className="text-xs text-zinc-500">{t('createForm.projectNameHelper')}</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">{t('createForm.odooVersion')}</label>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {ODOO_VERSIONS.map((version, index) => {
                    const active = selectedVersion === version
                    return (
                      <label
                        key={version}
                        className={cn(
                          'relative cursor-pointer inline-flex items-center gap-2 rounded-md border px-3 h-9 text-sm font-mono font-medium transition-all',
                          active
                            ? 'border-brand-orange bg-brand-orange-light text-brand-orange-dark ring-1 ring-brand-orange/20'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-900',
                        )}
                      >
                        <input type="radio" value={version} checked={active} {...register('odoo_version')} className="sr-only" />
                        {version}
                        {index === 0 && (
                          <span className={cn(
                            'text-[10px] uppercase tracking-wide font-semibold rounded px-1 py-0.5 font-sans',
                            active ? 'bg-brand-orange-light text-brand-orange-dark' : 'bg-zinc-100 text-zinc-500',
                          )}>{t('createForm.latest')}</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">{t('createForm.region')}</label>
                {onlineRegions.length === 0 ? (
                  <div className="rounded-md border border-brand-orange/20 bg-brand-orange-light px-4 py-3 text-sm text-brand-orange-dark">
                    {t('createForm.noAgents')}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup">
                    {onlineRegions.map(region => {
                      const meta   = REGION_LABELS[region] ?? { label: region, flag: '🌐' }
                      const active = selectedRegion === region
                      return (
                        <label
                          key={region}
                          className={cn(
                            'relative cursor-pointer flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all',
                            active
                              ? 'border-brand-teal bg-brand-teal-light ring-1 ring-brand-teal/20'
                              : 'border-zinc-200 bg-white hover:border-zinc-300',
                          )}
                        >
                          <input type="radio" value={region} checked={active} {...register('region')} className="sr-only" />
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-sm leading-tight', active ? 'text-brand-teal' : 'text-zinc-900')}>{meta.label}</p>
                            <p className="text-xs font-mono text-zinc-500 mt-0.5">{region}</p>
                          </div>
                          {active && <CheckIcon className="h-4 w-4 text-brand-orange shrink-0" />}
                        </label>
                      )
                    })}
                  </div>
                )}
                {errors.region && <p className="text-xs text-red-600">{errors.region.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('createForm.plan')}</CardTitle>
              <CardDescription>{t('createForm.planDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup">
                {plans.map(plan => {
                  const active = planId === plan.id
                  return (
                    <label
                      key={plan.id}
                      className={cn(
                        'relative cursor-pointer flex flex-col gap-1 rounded-md border px-3 py-2.5 transition-all',
                        active
                          ? 'border-brand-teal bg-brand-teal-light ring-1 ring-brand-teal/20'
                          : 'border-zinc-200 bg-white hover:border-zinc-300',
                      )}
                    >
                      <input type="radio" value={plan.id} checked={active} onChange={() => setPlanId(plan.id)} className="sr-only" />
                      <span className={cn('text-sm font-semibold', active ? 'text-brand-teal' : 'text-zinc-900')}>{plan.name}</span>
                      <ul className="text-xs space-y-1">
                        <li className="text-zinc-600">{t('createForm.planWorkers')}: {plan.max_workers_production}</li>
                        <li className="text-zinc-600">{t('createForm.planStorage')}: {plan.max_storage_gb}GB</li>
                        <li className="text-zinc-600">{t('createForm.planDevEnvironments')}: {plan.max_development_environments}</li>
                        <PlanFeatureRow included={plan.allow_custom_domain} label={t('createForm.planCustomDomain')} />
                        <PlanFeatureRow included={plan.allow_auto_backups} label={t('createForm.planAutoBackups')} />
                      </ul>
                    </label>
                  )
                })}
              </div>

              {isPaidPlan && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">{t('createForm.extraWorkersProduction')}</label>
                    <input type="number" min={0} value={extraWorkersProduction}
                      onChange={e => setExtraWorkersProduction(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">{t('createForm.extraStorageGb')}</label>
                    <input type="number" min={0} value={extraStorageGb}
                      onChange={e => setExtraStorageGb(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">{t('createForm.extraDevEnvironments')}</label>
                    <input type="number" min={0} value={extraDevEnvironments}
                      onChange={e => setExtraDevEnvironments(Math.max(0, Number(e.target.value)))}
                      className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockIcon className="h-4 w-4" />{t('createForm.adminAccount')}
              </CardTitle>
              <CardDescription>{t('createForm.adminDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="admin_email" className="text-sm font-medium text-zinc-700">{t('createForm.email')}</label>
                <input
                  id="admin_email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register('admin_email')}
                  className={cn(
                    'w-full h-9 rounded-md border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition',
                    'focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent',
                    errors.admin_email ? 'border-red-300' : 'border-zinc-200',
                  )}
                />
                {errors.admin_email && <p className="text-xs text-red-600">{errors.admin_email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="admin_password" className="text-sm font-medium text-zinc-700">{t('createForm.password')}</label>
                <input
                  id="admin_password"
                  type="password"
                  placeholder="••••••••"
                  {...register('admin_password')}
                  className={cn(
                    'w-full h-9 rounded-md border bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition',
                    'focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent',
                    errors.admin_password ? 'border-red-300' : 'border-zinc-200',
                  )}
                />
                {errors.admin_password && <p className="text-xs text-red-600">{errors.admin_password.message}</p>}
              </div>
            </CardContent>
          </Card>

          <div>
            <button
              type="button"
              onClick={() => setShowLocalization(prev => !prev)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                showLocalization
                  ? 'border-zinc-300 bg-zinc-50 text-zinc-800'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-800',
              )}
            >
              <span className="flex items-center gap-2">
                <Settings2Icon className="h-4 w-4" />{t('createForm.extraOptions')}
              </span>
              <ChevronDownIcon className={cn('h-4 w-4 transition-transform text-zinc-400', showLocalization && 'rotate-180')} />
            </button>

            {showLocalization && (
              <Card className="mt-2 border-zinc-200">
                <CardContent className="pt-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">{t('createForm.timezone')}</label>
                    <Select value={watch('timezone')} onValueChange={val => setValue('timezone', val, { shouldValidate: true })}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t('createForm.selectTimezone')} /></SelectTrigger>
                      <SelectContent className="max-h-64">
                        {TIMEZONES.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.timezone && <p className="text-xs text-red-600">{errors.timezone.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">{t('createForm.language')}</label>
                    <Select value={watch('language')} onValueChange={val => setValue('language', val, { shouldValidate: true })}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={t('createForm.selectLanguage')} /></SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.language && <p className="text-xs text-red-600">{errors.language.message}</p>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranchIcon className="h-4 w-4" />{t('createForm.repository')}
              </CardTitle>
              <CardDescription>{t('createForm.repoDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!connected && (
                <div className="rounded-md border border-brand-orange/20 bg-brand-orange-light px-4 py-3 flex items-center justify-between">
                  <p className="text-sm text-brand-orange-dark">{t('createForm.connectGitHub')}</p>
                  <a href={`${env.API_BASE}/api/github/oauth/start`} className="text-sm font-semibold text-brand-orange-dark underline underline-offset-2">
                    {t('createForm.connect')}
                  </a>
                </div>
              )}

              <RepoModeControl value={repoMode} onChange={setRepoMode} disabled={!connected} />

              {repoMode === 'create' && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700">{t('createForm.repository')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] gap-2">
                    <OwnerCombobox owners={owners} value={selectedOwner} onChange={setSelectedOwner} />
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 select-none text-sm">/</span>
                      <input
                        type="text"
                        placeholder="my-odoo-project"
                        value={newRepoName}
                        onChange={e => setNewRepoName(e.target.value)}
                        className="w-full h-9 rounded-md border border-zinc-200 bg-white pl-7 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent transition"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500">{t('createForm.newRepoHelper')}</p>
                </div>
              )}

              {repoMode === 'link' && (
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">{t('createForm.owner')}</label>
                    <OwnerCombobox
                      owners={owners}
                      value={selectedOwner}
                      onChange={owner => { setSelectedOwner(owner); setSelectedRepo(''); setRepoSearch('') }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700">{t('createForm.repository')}</label>
                    <RepoCombobox repos={filteredRepos} value={selectedRepo} loading={loadingRepos} onSelect={setSelectedRepo} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" loading={isPending || creatingRepo} disabled={onlineRegions.length === 0 || nameAlreadyExists}>
              {t('createForm.createProject')}
            </Button>
          </div>
        </form>
      </div>

      <ProvisionProgressModal
        open={provision.status !== 'idle'}
        status={provision.status}
        stage={provision.stage}
        stages={provision.stages}
        pct={provision.pct}
        error={provision.error}
        onClose={provision.dismiss}
      />
    </>
  )
}
