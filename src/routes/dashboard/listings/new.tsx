import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ListingForm,
  type ListingFormValues,
} from '../../../components/listings/ListingForm'
import { createListing } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/new')({
  component: NewListingPage,
})

function NewListingPage() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(values: ListingFormValues) {
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const result = await createListing({ data: values })
      if (!result.ok) {
        setErrorMessage(result.error)
        return
      }

      await navigate({ to: '/dashboard/listings' })
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Unable to create listing.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
        New listing
      </h1>
      <ListingForm
        submitLabel="Create listing"
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      />
    </section>
  )
}
