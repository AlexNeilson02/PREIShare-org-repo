// Re-export the browser client. Routes should import from
// `src/lib/supabase/client.ts` so the server bundle does not pull in a
// `*.client.ts` filename (TanStack Start import-protection).
export {
  createBrowserSupabaseClient,
  supabaseBrowser,
} from './supabase/client'
