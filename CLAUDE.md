# Finance Tracker

Personal finance tracker: Android app + web client sharing one backend API. Single-user
(no registration/multi-tenant). Minimal skeleton by design — expand feature by feature,
don't pre-build abstractions for functionality that isn't there yet.

## Stack

- **Monorepo**: pnpm workspaces (`apps/*`, `packages/*`).
- **API** (`apps/api`): Fastify + TypeScript (ESM) + Prisma ORM + PostgreSQL. Runs via
  `tsx` directly (no compiled `dist` build step). Auth: single seeded user, JWT
  (`@fastify/jwt`), password hashed with `bcryptjs`.
- **Web** (`apps/web`): React 19 + Vite + TanStack Query + Zustand + react-router-dom.
- **Mobile** (`apps/mobile`): Expo (React Native) + React Navigation (native-stack) +
  TanStack Query + Zustand. Session token stored via `expo-secure-store` (async) instead
  of `localStorage` (sync) — see `packages/shared/src/api-client.ts`, whose `getToken`
  accepts either a sync or async return.
- **Shared** (`packages/shared`): zod schemas (single source of truth for types, via
  `z.infer`) + a framework-agnostic `createApiClient()` consumed by both web and mobile.
  Consumed as TS source directly (no build step) — `main`/`types` point at `src/index.ts`.
- **Linting/formatting**: Biome (`biome.json` at root) for all JS/TS — no ESLint/Prettier.
- **Architecture linting**: `apps/web` and `apps/mobile` follow Feature-Sliced Design
  (layers: `app → pages → features → entities → shared`; `widgets`/`processes` omitted
  until actually needed). Enforced by Steiger (`steiger.config.js` in each app, run via
  `pnpm fsd:web` / `pnpm fsd:mobile`). `apps/api` and `packages/shared` are not FSD.

## Repo conventions

- **Git: sole contributor.** No `Co-Authored-By` trailers on commits — see project memory
  `feedback-git-sole-author`. Commits/pushes are handled autonomously (user delegated
  this); still no force-push/history-rewrite without asking.
- **Branching: trunk-based.** Short-lived branches off `main`, merged back quickly, no
  long-lived feature branches.
- **Remote: public GitHub repo** — <https://github.com/JaterFor/FinanceTracker>. Because
  it's public, `.env`/`*.pem`/secrets must never be committed (see root `.gitignore`) —
  only `.env.example` files are tracked.
- Env vars: each app has its own `.env.example` (`apps/api`, `apps/web`, `apps/mobile`);
  root `.env.example` is only for the local-dev `docker-compose.yml` Postgres container.

## Running locally

```bash
docker compose up -d          # local Postgres (see .env.example at root)
pnpm install
cp apps/api/.env.example apps/api/.env        # fill in JWT_SECRET etc.
pnpm --filter @finance-tracker/api db:migrate
pnpm --filter @finance-tracker/api db:seed    # creates the one admin user + categories
pnpm dev:api     # http://localhost:3000
pnpm dev:web     # http://localhost:5273, needs apps/web/.env (VITE_API_URL)
pnpm dev:mobile  # Expo, needs apps/mobile/.env (EXPO_PUBLIC_API_URL)
```

`pnpm lint` (Biome), `pnpm typecheck` (all workspaces), `pnpm fsd:web` / `pnpm fsd:mobile`
(Steiger architecture check).

## Deployment target

VPS at `195.209.212.107` (user `ubuntu`) — see project memory `deployment-server` for SSH
details. Deployment approach (docker-compose in production) not yet built as of the
initial skeleton — see conversation/memory for the agreed plan before assuming any prod
compose file or nginx config exists.

## AI assistant notes

- This file, plus `.claude/` in this repo, is where AI-environment context for this
  project is meant to live (per explicit user instruction) — keep it current as the
  skeleton grows instead of letting context live only in chat history.
- `.claude/` also has a project-scoped `pohuy` output style installed (not global) —
  see `.claude/settings.json`. The vendored `.claude/hooks/style-reminder.sh` was patched
  locally to work around a Windows quirk (`python3` on PATH resolves to a broken
  Microsoft Store alias stub on this machine; the script now falls back to `python`).
