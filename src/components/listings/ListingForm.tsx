import { useState, type FormEvent } from 'react'

export type ListingFormValues = {
  title: string
  description?: string
  address_line1?: string
  address_line2?: string
  address_city?: string
  address_region?: string
  address_postal_code?: string
  address_country?: string
  price?: number
  status?: 'draft' | 'published' | 'under_offer' | 'sold' | 'archived'
}

export type ListingFormProps = {
  onSubmit: (values: ListingFormValues) => void | Promise<void>
  submitLabel: string
  errorMessage?: string
  isSubmitting: boolean
}

const inputClassName =
  'rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal text-[var(--sea-ink)] disabled:opacity-60'

function optionalString(value: string): string | undefined {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function ListingForm({
  onSubmit,
  submitLabel,
  errorMessage,
  isSubmitting,
}: ListingFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [address_line1, setAddressLine1] = useState('')
  const [address_line2, setAddressLine2] = useState('')
  const [address_city, setAddressCity] = useState('')
  const [address_region, setAddressRegion] = useState('')
  const [address_postal_code, setAddressPostalCode] = useState('')
  const [address_country, setAddressCountry] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState<
    'draft' | 'published' | 'under_offer' | 'sold' | 'archived'
  >('draft')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const values: ListingFormValues = {
      title: title.trim(),
      status,
    }

    const nextDescription = optionalString(description)
    if (nextDescription) {
      values.description = nextDescription
    }

    const nextLine1 = optionalString(address_line1)
    if (nextLine1) {
      values.address_line1 = nextLine1
    }

    const nextLine2 = optionalString(address_line2)
    if (nextLine2) {
      values.address_line2 = nextLine2
    }

    const nextCity = optionalString(address_city)
    if (nextCity) {
      values.address_city = nextCity
    }

    const nextRegion = optionalString(address_region)
    if (nextRegion) {
      values.address_region = nextRegion
    }

    const nextPostal = optionalString(address_postal_code)
    if (nextPostal) {
      values.address_postal_code = nextPostal
    }

    const nextCountry = optionalString(address_country)
    if (nextCountry) {
      values.address_country = nextCountry
    }

    if (price.trim().length > 0) {
      values.price = Number(price)
    }

    await onSubmit(values)
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label
        htmlFor="listing-title"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Title
        <input
          id="listing-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClassName}
          required
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-description"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Description
        <textarea
          id="listing-description"
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClassName}
          rows={4}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-address-line1"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Address line 1
        <input
          id="listing-address-line1"
          name="address_line1"
          type="text"
          value={address_line1}
          onChange={(event) => setAddressLine1(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-address-line2"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Address line 2
        <input
          id="listing-address-line2"
          name="address_line2"
          type="text"
          value={address_line2}
          onChange={(event) => setAddressLine2(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-address-city"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        City
        <input
          id="listing-address-city"
          name="address_city"
          type="text"
          value={address_city}
          onChange={(event) => setAddressCity(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-address-region"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Region
        <input
          id="listing-address-region"
          name="address_region"
          type="text"
          value={address_region}
          onChange={(event) => setAddressRegion(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-address-postal-code"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Postal code
        <input
          id="listing-address-postal-code"
          name="address_postal_code"
          type="text"
          value={address_postal_code}
          onChange={(event) => setAddressPostalCode(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-address-country"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Country
        <input
          id="listing-address-country"
          name="address_country"
          type="text"
          value={address_country}
          onChange={(event) => setAddressCountry(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-price"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Price
        <input
          id="listing-price"
          name="price"
          type="number"
          min={0}
          step="any"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className={inputClassName}
          disabled={isSubmitting}
        />
      </label>

      <label
        htmlFor="listing-status"
        className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
      >
        Status
        <select
          id="listing-status"
          name="status"
          value={status}
          onChange={(event) =>
            setStatus(
              event.target.value as
                | 'draft'
                | 'published'
                | 'under_offer'
                | 'sold'
                | 'archived',
            )
          }
          className={inputClassName}
          disabled={isSubmitting}
        >
          <option value="draft">draft</option>
          <option value="published">published</option>
          <option value="under_offer">under_offer</option>
          <option value="sold">sold</option>
          <option value="archived">archived</option>
        </select>
      </label>

      <p role="alert" className="min-h-6 text-sm text-[var(--palm)]">
        {errorMessage}
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  )
}
