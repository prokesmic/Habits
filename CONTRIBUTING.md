# Contributing to Habits

Thanks for your interest in contributing! This document outlines the ground rules for collaborating on the Habits project.

## Getting Started

1. **Fork** the repository or create a feature branch off `main` if you have push access.
2. **Install dependencies** with `pnpm install`.
3. **Set up environment variables** using `.env.example`.
4. **Run Supabase migrations** from [`docs/SUPABASE_SCHEMA.sql`](docs/SUPABASE_SCHEMA.sql) if your change depends on DB structure.

## Branching & Commits

- Use a descriptive branch name, e.g. `feature/squad-reactions` or `fix/habit-streak-edge`.
- Follow [Conventional Commits](https://www.conventionalcommits.org/) when possible (`feat:`, `fix:`, `docs:`, `chore:` etc.).
- Keep commits focused and meaningful. Squash locally if needed before raising a PR.

## Development Checklist

Before opening a pull request:

- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e` (if your changes impact onboarding or routing)
- [ ] Update documentation (README, docs/) when behaviour or APIs change
- [ ] Add or update Supabase SQL in `docs/SUPABASE_SCHEMA.sql` if schema evolves

## Coding Guidelines

- **TypeScript**: use explicit types, avoid `any`. Guard against nullable Supabase data.
- **Styling**: follow Tailwind conventions already established (`rounded-2xl`, `text-slate-*`).
- **Server Actions**: validate inputs using Zod schemas in `src/lib/validators`. Handle auth via `createClient()` and honour row-level security.
- **Analytics**: use `track(event, props)` and ensure events exist in `src/lib/analytics.ts`.

## Testing

- Vitest specs live under `tests/unit` and `src/**/__tests__` (future expansion).
- Playwright specs live under `tests/e2e`. Install browsers with `npx playwright install` once per environment.
- Add regression tests when fixing bugs or adding core features.

## Pull Request Process

1. Fill out the PR template (create one if needed) with context, screenshots, and testing steps.
2. Request review from a maintainer.
3. Ensure CI (when configured) passes.
4. Respond to feedback promptly; use follow-up commits instead of force-pushing during review unless asked.

## Supabase Schema Changes

- Use SQL in `docs/SUPABASE_SCHEMA.sql` for migrations. Future work will adopt Supabase CLI migrations.
- Document policy changes and new tables in `docs/API_NOTES.md`.

## Code of Conduct

- Be respectful and constructive.
- Provide helpful feedback, avoid personal attacks.
- Assume positive intent.

Thanks for helping make Habits a powerful accountability tool! 🙌
