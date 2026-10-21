import { createServerFn } from '@tanstack/react-start'
import { getUser } from '../lib/auth/session'
import {
  createListingSchema,
  updateListingSchema,
} from '../lib/listings/schema'
import { createServerSupabaseClient } from '../lib/supabase/server'
import type { ZodError } from 'zod'

export type ListingRow = {
  id: string
  owner_id: string
  title: string
  description: string | null
  address_line1: string | null
  address_line2: string | null
  address_city: string | null
  address_region: string | null
  address_postal_code: string | null
  address_country: string | null
  price: number | null
  status: 'draft' | 'published' | 'under_offer' | 'sold' | 'archived'
  created_at: string
  updated_at: string
}

export type ListingsResult =
  | { ok: true; listings: ListingRow[] }
  | { ok: false; error: string }

export type ListingMutationResult =
  | { ok: true; listing: ListingRow }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

const notSignedIn = 'You must be signed in to manage listings.'

function fieldErrorsFromZod(error: ZodError): Record<string, string[]> {
  const flattened = error.flatten().fieldErrors
  const fieldErrors: Record<string, string[]> = {}
  for (const [field, messages] of Object.entries(flattened)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[field] = messages
    }
  }
  return fieldErrors
}

export const listMyListings = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ListingsResult> => {
    const user = await getUser()
    if (!user) {
      return { ok: false, error: notSignedIn }
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('property_listings')
      .select(
        'id, owner_id, title, description, address_line1, address_line2, address_city, address_region, address_postal_code, address_country, price, status, created_at, updated_at',
      )
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })

    if (error || !data) {
      return { ok: false, error: 'Unable to load listings.' }
    }

    return { ok: true, listings: data }
  },
)

export const createListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const parsed = createListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Listing is invalid.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const user = await getUser()
    if (!user) {
      return { ok: false, error: notSignedIn }
    }

    const supabase = createServerSupabaseClient()
    const { data: listing, error } = await supabase
      .from('property_listings')
      .insert({ ...parsed.data, owner_id: user.id })
      .select(
        'id, owner_id, title, description, address_line1, address_line2, address_city, address_region, address_postal_code, address_country, price, status, created_at, updated_at',
      )
      .single()

    if (error || !listing) {
      return { ok: false, error: 'Unable to create listing.' }
    }

    return { ok: true, listing }
  })

export const updateListing = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<ListingMutationResult> => {
    const parsed = updateListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Listing is invalid.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const user = await getUser()
    if (!user) {
      return { ok: false, error: notSignedIn }
    }

    const { id, ...patch } = parsed.data
    if (Object.keys(patch).length === 0) {
      return { ok: false, error: 'Nothing to update.' }
    }

    const supabase = createServerSupabaseClient()
    const { data: listing, error } = await supabase
      .from('property_listings')
      .update(patch)
      .eq('id', id)
      .eq('owner_id', user.id)
      .select(
        'id, owner_id, title, description, address_line1, address_line2, address_city, address_region, address_postal_code, address_country, price, status, created_at, updated_at',
      )
      .single()

    if (error || !listing) {
      return { ok: false, error: 'Unable to update listing.' }
    }

    return { ok: true, listing }
  })
