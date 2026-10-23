// server-only, never import from a browser component

import { createServerFn } from '@tanstack/react-start'
import { createSupabaseServerClient } from '../supabase.server'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const supabase = createSupabaseServerClient()
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
    const supabase = createSupabaseServerClient()
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
  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
  return { ok: true as const }
})
