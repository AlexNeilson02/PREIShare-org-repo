// server-only, never import from a browser component

import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '../supabase/server'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const supabase = createServerSupabaseClient()
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        return null
      }
      return data.session
    } catch {
      return null
    }
  },
)

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      return null
    }
    return data.user
  } catch {
    return null
  }
})

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
  return { ok: true as const }
})
