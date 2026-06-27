import * as React from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/components/logo'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbSeparator, BreadcrumbPage,
} from '@/components/breadcrumb'
import AccountDropdown from '@/modules/companies/components/account_dropdown'
import PreviewBanner from '@/components/preview_banner'
import { Slot } from '@/core'

type BreadcrumbEntry = { label: string | React.ReactNode; href?: string }

export interface DashboardLayoutProps extends React.PropsWithChildren {
  breadcrumbs?: BreadcrumbEntry[]
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  actionButton?: React.ReactNode
}

export default function DashboardLayout({ children, breadcrumbs, title, description, actionButton }: DashboardLayoutProps) {
  const allCrumbs = breadcrumbs ?? []

  return (
    <main className="min-h-screen w-full">
      <PreviewBanner />
      {/* Navbar */}
      <div className="z-20 border-b border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
          <div className="flex h-16 items-center justify-between mx-4">
            <div className="flex items-center gap-x-1">
              <Link className="hidden sm:block shrink-0 transition-all" to="/">
                <Logo className="w-10" width={40} height={40} />
              </Link>
              <svg fill="none" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24" className="hidden h-8 w-8 text-neutral-200 sm:block shrink-0">
                <path d="M16.88 3.549L7.12 20.451" />
              </svg>
              <Breadcrumb>
                <BreadcrumbList>
                  {allCrumbs.map((crumb, i) => (
                    <React.Fragment key={i}>
                      <BreadcrumbItem>
                        {crumb.href
                          ? <Link to={crumb.href} className="transition-colors hover:text-foreground text-muted-foreground font-medium">{crumb.label}</Link>
                          : <BreadcrumbPage className={i < allCrumbs.length - 1 ? 'text-muted-foreground' : ''}>{crumb.label}</BreadcrumbPage>
                        }
                      </BreadcrumbItem>
                      {i < allCrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center space-x-3">
              <Slot name="dashboard:navbar:actions" />
              <AccountDropdown />
            </div>
          </div>
        </div>
      </div>

      {/* Page header */}
      {(title || description) && (
        <div className="border-b border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-24 flex flex-col py-8">
            <div className="pb-2 flex items-center justify-between">
              {title && <h1 className="text-2xl sm:text-3xl tracking-tight font-serif text-black dark:text-zinc-50">{title}</h1>}
              {actionButton}
            </div>
            {description && <p className="text-sm text-neutral-600 dark:text-zinc-400">{description}</p>}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex w-full items-center">
        <div className="mx-auto w-full max-w-screen-xl px-6 lg:px-24 flex flex-col gap-y-3 my-8">
          <Slot name="dashboard:content:before" />
          {children}
          <Slot name="dashboard:content:after" />
        </div>
      </div>
    </main>
  )
}
