# Supabase env setup checklist

## Purpose

- [ ] Confirm this checklist is for local env names only, not for creating a Supabase project in this step.
- [ ] Confirm no real keys will be pasted into git, docs, or chat.
- [ ] Confirm `.env.example` is the template and `.env` stays untracked.

## Source requirements

- [ ] Read `docs/requirements/sponsor-auth-and-listings-brief.md` (server-only boundary and success criteria).
- [ ] Confirm scope is sponsor auth and listings only (no payments, no live investor balances).
- [ ] Confirm investor vs sponsor is still an open question and is not assumed.

## Supabase project

- [ ] Have a Supabase project URL (placeholder in `.env.example`, real value only in local `.env`).
- [ ] Have the anon (public) key for the browser client.
- [ ] Have the service role key for server-only use.
- [ ] Confirm row-level security will be enabled before treating the anon key as safe.
- [ ] Confirm the service role key is not used in any `VITE_*` variable.

## Repo files

- [ ] `.env.example` exists at the repo root with placeholder values only.
- [ ] `.env.example` is not gitignored and is safe to commit.
- [ ] `.gitignore` lists `.env`, `.env.local`, and `.env.*.local`.
- [ ] No `.env` or `.env.local` is committed.
- [ ] No `src/lib/supabase.ts` client exists yet (do not invent one in this setup step).

## Public vs server-only rules

- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are labeled public / browser-safe.
- [ ] I understand `VITE_*` values ship in the client bundle (Vite default; see `vite.config.ts`).
- [ ] I understand the anon key still depends on row-level security and is not a bypass.
- [ ] `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` have no `VITE_` prefix.
- [ ] I will not import `SUPABASE_SERVICE_ROLE_KEY` from any React component or other browser-running file under `src/`.
- [ ] Anything imported into a React component can be read by the user.

## Smoke checks before feature work

- [ ] `git check-ignore -v .env` reports that `.env` is ignored.
- [ ] `git check-ignore -v .env.example` reports that `.env.example` is **not** ignored.
- [ ] Client bundle / built assets do not contain `SUPABASE_SERVICE_ROLE_KEY` or a real service-role value.
- [ ] `.env.example` still has placeholders only (`your-anon-key`, `your-service-role-key`, example project URL).
- [ ] Existing dashboard routes still load: `/dashboard`, `/dashboard/portfolio`, `/dashboard/deals`, `/dashboard/profile`.

## Handoff notes

- [ ] Next implementation prompt will quote `docs/requirements/sponsor-auth-and-listings-brief.md`.
- [ ] Sign-in and listings code is not part of this env-setup step.
- [ ] Domain listing fields stay in `docs/domain/` until types are added.
- [ ] Record who filled this checklist and the date in the PR or a follow-up note (no secrets).
