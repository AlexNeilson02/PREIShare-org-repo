import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState, type FormEvent } from 'react'
import {
  createListingSchema,
  listingStatusSchema,
} from '../../lib/listings/schema'
import { createSupabaseServerClient } from '../../lib/supabase.server'
import type { ZodError } from 'zod'

const inputClassName =
  'rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal text-[var(--sea-ink)] disabled:opacity-60'

type CreatePropertyResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

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

export const createProperty = createServerFn({ method: 'POST' })
  .validator((input: unknown) => input)
  .handler(async ({ data }): Promise<CreatePropertyResult> => {
    const parsed = createListingSchema.safeParse(data)
    if (!parsed.success) {
      return {
        ok: false,
        error: 'Listing is invalid.',
        fieldErrors: fieldErrorsFromZod(parsed.error),
      }
    }

    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return {
        ok: false,
        error: 'You must be signed in to add a property.',
      }
    }

    const { data: row, error } = await supabase
      .from('property_listings')
      .insert({
        ...parsed.data,
        owner_id: user.id,
      })
      .select('id')
      .single()

    if (error || !row) {
      return {
        ok: false,
        error:
          'Could not create the listing. Check your fields and try again.',
      }
    }

    return { ok: true, id: row.id }
  })

export const Route = createFileRoute('/dashboard/properties/new')({
  component: NewPropertyPage,
})

function NewPropertyPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address_line1, setAddressLine1] = useState('')
  const [address_city, setAddressCity] = useState('')
  const [address_region, setAddressRegion] = useState('')
  const [address_postal_code, setAddressPostalCode] = useState('')
  const [status, setStatus] = useState<(typeof listingStatusSchema.options)[number]>(
    'draft',
  )
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setPending(true)

    try {
      const result = await createProperty({
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
          address_line1: address_line1.trim() || undefined,
          address_city: address_city.trim() || undefined,
          address_region: address_region.trim() || undefined,
          address_postal_code: address_postal_code.trim() || undefined,
          status,
        },
      })

      if (!result.ok) {
        setError(result.error)
        setFieldErrors(result.fieldErrors ?? {})
        return
      }

      await navigate({ to: '/dashboard/properties' })
    } catch {
      setError('Could not create the listing. Check your fields and try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
        Add property
      </h1>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          Title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={inputClassName}
            required
            disabled={pending}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          Description
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClassName}
            rows={4}
            disabled={pending}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          Address line 1
          <input
            type="text"
            name="address_line1"
            value={address_line1}
            onChange={(event) => setAddressLine1(event.target.value)}
            className={inputClassName}
            disabled={pending}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          City
          <input
            type="text"
            name="address_city"
            value={address_city}
            onChange={(event) => setAddressCity(event.target.value)}
            className={inputClassName}
            disabled={pending}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          Region
          <input
            type="text"
            name="address_region"
            value={address_region}
            onChange={(event) => setAddressRegion(event.target.value)}
            className={inputClassName}
            disabled={pending}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          Postal code
          <input
            type="text"
            name="address_postal_code"
            value={address_postal_code}
            onChange={(event) => setAddressPostalCode(event.target.value)}
            className={inputClassName}
            disabled={pending}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]">
          Status
          <select
            name="status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as (typeof listingStatusSchema.options)[number],
              )
            }
            className={inputClassName}
            disabled={pending}
          >
            {listingStatusSchema.options.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <p role="alert" className="min-h-6 text-sm text-[var(--palm)]">
          {error}
          {Object.entries(fieldErrors).map(([field, messages]) => (
            <span key={field} className="block">
              {field}: {messages.join(', ')}
            </span>
          ))}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Add property'}
        </button>
      </form>
    </section>
  )
}
