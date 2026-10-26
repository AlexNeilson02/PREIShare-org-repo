// Browser-safe: ONLY public env values. Never import service-role here.
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

function requireBrowserSupabaseEnv() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check .env and docs/setup/supabase-env-checklist.md.',
    )
  }

  return { supabaseUrl, supabaseAnonKey }
}

export function createBrowserSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = requireBrowserSupabaseEnv()
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

/** Same helper; do not construct a client at module load (SSR import). */
export function supabaseBrowser() {
  return createBrowserSupabaseClient()
}
