import { z } from 'zod'

export const listingStatusSchema = z.enum([
  'draft',
  'published',
  'under_offer',
  'sold',
  'archived',
])

export const createListingSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  address_city: z.string().optional(),
  address_region: z.string().optional(),
  address_postal_code: z.string().optional(),
  address_country: z.string().optional(),
  price: z.coerce.number().nonnegative().optional(),
  status: listingStatusSchema.default('draft'),
})

export const updateListingSchema = createListingSchema.partial().extend({
  id: z.uuid(),
})

export type CreateListingInput = z.infer<typeof createListingSchema>
export type UpdateListingInput = z.infer<typeof updateListingSchema>
