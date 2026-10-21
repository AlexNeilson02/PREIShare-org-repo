// server-only, never import from a browser component

import { createServerFn } from '@tanstack/react-start'
import { createServerSupabaseClient } from '../supabase/server'

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      return null
    }
    return data.session
  },
)

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return null
  }
  return data.user
})

export const signOut = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return null
  }
  return null
})
