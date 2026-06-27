# dooservice app

Web dashboard for the dooservice platform. Lets users manage their Odoo projects and environments — provision instances, monitor status, handle backups, connect GitHub repositories, and configure custom domains — with real-time job progress streamed directly from the agent over NATS WebSocket.

| Repo | Description |
|---|---|
| [`dooservice/app-dooservice`](https://github.com/dooservice/app-dooservice) | **This repo** — web dashboard |
| [`dooservice/orchestrator`](https://github.com/dooservice/orchestrator) | Central API server |
| [`dooservice/agent`](https://github.com/dooservice/agent) | Agent daemon — runs on each VPS |

---

## Table of contents

- [Stack](#stack)
- [Features](#features)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS + tailwindcss-animate |
| UI primitives | Radix UI (`dialog`, `dropdown-menu`, `popover`, `select`, `toast`) |
| Icons | Tabler Icons + Lucide React |
| Routing | React Router v7 |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| HTTP client | ky |
| Real-time | NATS WebSocket (`@nats-io/nats-core`, `nats`) |
| i18n | i18next + react-i18next + browser language detector |
| Theming | next-themes (dark/light mode) |

---

## Features

### Authentication
- Email + password registration with OTP email verification
- Login / logout with persistent cookie session
- OAuth login via Google and GitHub
- Forgot password / reset password via OTP email

### Projects
- Create and manage projects (Odoo version, region, timezone, language)
- Link a GitHub repository to a project
- Lock / unlock projects to prevent accidental destructive operations
- Delete projects and all associated resources

### Environments
- Provision new Odoo environments with configurable workers, admin credentials, and language
- Clone environments (optionally to a new Git branch)
- Start, stop, and rebuild environment containers
- Stream real-time container logs
- View environment overview, deployment history, and settings
- Scale Odoo workers per environment

### Backups
- Create manual backups (full or partial)
- Restore a backup to an environment with real-time progress
- Upload external backup files via S3 multipart upload
- Download backups via presigned S3 URLs

### Custom domains
- Assign a custom domain to any environment
- Verify DNS propagation
- Remove custom domains

### GitHub integration
- Connect a GitHub account via OAuth
- Link repositories to projects (existing or create new)
- Map environments to branches
- Enable / disable autodeploy per environment (pushes trigger `git.pull` jobs automatically)
- Manage deploy keys and submodule SSH keys

### Real-time job progress
All long-running operations (provision, clone, backup, restore, deploy) show a live progress modal. The client subscribes to the job subject over NATS WebSocket and renders stage + percentage in real time without polling the API.

---

## Getting started

Requires Node.js 20+ and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/dooservice/app-dooservice
cd app-dooservice
pnpm install
cp .env.example .env   # set VITE_API_URL and VITE_NATS_WS_URL
pnpm dev
```

Build for production:

```bash
pnpm build
pnpm preview
```

---

## Environment variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the orchestrator API (e.g. `https://api.example.com`) |
| `VITE_NATS_WS_URL` | NATS WebSocket URL for real-time job streaming (e.g. `ws://nats.example.com:4222`) |

---

## Project structure

```
src/
├── app/
│   ├── provider.tsx       # QueryClient, theme, i18n, toast providers
│   ├── router.tsx         # React Router — protected and guest route groups
│   └── routes/            # ProtectedRoute / GuestRoute wrappers
├── components/            # shared UI primitives (button, input, dialog, badge...)
├── core/                  # router registry — modules register their routes here
├── hooks/                 # use_toast and other shared hooks
└── modules/
    ├── auth/              # sign in, sign up, verify email, password reset, settings
    ├── companies/         # dashboard layout, onboarding flow, project root
    ├── environments/      # environment detail tabs (overview, logs, backups, deployments, settings)
    ├── github/            # GitHub connect, repo picker, autodeploy controls
    ├── plans/             # plan badge, upgrade dialog
    └── projects/          # project list, create form, project settings
```

Each module is self-contained with its own views, components, and API calls. Modules register their routes in `core/router_registry` — no centralised route list to maintain.
