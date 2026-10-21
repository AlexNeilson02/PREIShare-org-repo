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
  try {
    const supabase = createServerSupabaseClient()
    await supabase.auth.signOut()
  } catch {
    return null
  }
  return null
})
