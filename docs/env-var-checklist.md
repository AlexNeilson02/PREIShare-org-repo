# PREIshare environment variables

An **environment variable** is a name the app reads at run time (for example `VITE_SUPABASE_URL`). Real values live only in a local `.env` file that is not committed. This page lists the names in [`.env.example`](../.env.example) and who may use them. It is a variable reference, not a replacement for [`docs/setup/supabase-env-checklist.md`](setup/supabase-env-checklist.md).

No real keys, project URLs, or tokens appear here.

## Variables

| Variable | Client-safe or server-only | Why | Read by |
|----------|----------------------------|-----|---------|
| `VITE_SUPABASE_URL` | Client-safe | Project URL the browser is allowed to know. The `VITE_` prefix means Vite copies it into the client bundle (see below). | `src/lib/supabase/client.ts` line 5 (`import.meta.env.VITE_SUPABASE_URL`) |
| `VITE_SUPABASE_ANON_KEY` | Client-safe | Public **anon key** (the key the browser may send). It still obeys row-level security; it is not an admin bypass. | `src/lib/supabase/client.ts` line 6 (`import.meta.env.VITE_SUPABASE_ANON_KEY`) |
| `SUPABASE_URL` | Server-only | Same project URL on the server. No `VITE_` prefix, so Vite does not inline it into browser JS. | `src/lib/supabase/server.ts` line 7 (`process.env.SUPABASE_URL`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | **Service-role key** (admin key). It skips every row-level security policy. Never a `VITE_*` name. | `src/lib/supabase/server.ts` line 8 (`process.env.SUPABASE_SERVICE_ROLE_KEY`) |

`src/lib/supabase/client.ts` must not read `SUPABASE_SERVICE_ROLE_KEY`. `src/lib/supabase/server.ts` must not be imported by a React component.

## What the `VITE_` prefix does

**Vite** is the build tool this app uses. At build time it **inlines** (pastes) every `import.meta.env.VITE_*` value into the JavaScript it sends to the browser. That file is the **client bundle**. Anyone can open DevTools and read those strings.

That is a mechanism, not a naming convention you can opt out of by being careful. If a secret is in a `VITE_*` variable, it is public.

## Why the anon key is safe to expose

The anon key only identifies the app to Supabase. **Row-level security (RLS)** is a Postgres rule on each table that decides which rows that request may see or change (here: `owner_id = auth.uid()`). Without a signed-in user, `auth.uid()` is empty and those policies match no rows.

The anon key is powerless on its own. It is not a bypass. It is only safe **while RLS policies exist** on tables it can reach. If RLS is off, the anon key can read or write like an open database.

## Why the service-role key is server-only

The service-role key **bypasses every RLS policy**. Whoever has it can read and write every listing, every owner.

It must never appear:

- in a `VITE_*` variable
- in a React component
- in any file a component imports (that file would be pulled into the client bundle)

Server-only code may read `process.env.SUPABASE_SERVICE_ROLE_KEY` inside `src/lib/supabase/server.ts`. That file’s first line says it must never be imported from the browser.

## `.env` vs `.env.example` vs git history

- **`.env`** holds real values on your machine. It is gitignored (`.gitignore` lists `.env`, `.env.local`, and `.env.*.local`). Do not commit it.
- **`.env.example`** is the template with **placeholders** (`your-anon-key`, `your-service-role-key`). It is committed on purpose so others know which names to set.
- A key that is committed **once** stays in **git history** even after you delete the file from the latest commit. Removing the file from `main` does not unpublish the old snapshot. The fix is to **rotate** (replace) the key in the Supabase dashboard, then put the new value only in local `.env`.

## Commands to verify

Confirm `.env` is ignored:

```bash
git check-ignore -v .env
```

Expected: a line pointing at `.gitignore` and `.env` (this repo: `.gitignore:6:.env`). If the command prints nothing, `.env` is not ignored.

After `npm run build`, search the client output for the service-role **name** (never paste a real key into the search):

```bash
rg SUPABASE_SERVICE_ROLE_KEY .output/public
```

Expected: **0 hits**. Any hit means the admin key name was shipped to the browser.
