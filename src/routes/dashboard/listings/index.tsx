import { Link, createFileRoute } from '@tanstack/react-router'
import { ListingCard } from '../../../components/listings/ListingCard'
import { listMyListings } from '../../../server/listings'

export const Route = createFileRoute('/dashboard/listings/')({
  loader: () => listMyListings(),
  component: ListingsIndexPage,
})

function ListingsIndexPage() {
  const result = Route.useLoaderData()

  if (!result.ok) {
    return (
      <section>
        <h1 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)]">
          Listings
        </h1>
        <p role="alert" className="mt-4 text-sm text-[var(--palm)]">
          {result.error}
        </p>
      </section>
    )
  }

  if (result.listings.length === 0) {
    return (
      <section>
        <h1 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)]">
          Listings
        </h1>
        <p className="mt-4 text-[var(--sea-ink-soft)]">
          No listings yet.{' '}
          <Link
            to="/dashboard/listings/new"
            className="font-semibold text-[var(--lagoon-deep)]"
          >
            Create a listing
          </Link>
        </p>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)]">
          Listings
        </h1>
        <Link
          to="/dashboard/listings/new"
          className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)] no-underline"
        >
          New listing
        </Link>
      </div>
      <ul className="m-0 grid list-none gap-4 p-0">
        {result.listings.map((listing) => (
          <li key={listing.id}>
            <ListingCard listing={listing} />
          </li>
        ))}
      </ul>
    </section>
  )
}
