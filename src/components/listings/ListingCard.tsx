import type { ListingRow } from '../../server/listings'

export type ListingCardProps = {
  listing: ListingRow
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <article className="island-shell rounded-2xl p-5">
      <p className="island-kicker m-0">{listing.status}</p>
      <h2 className="m-0 mt-2 text-xl font-semibold tracking-tight text-[var(--sea-ink)]">
        {listing.title}
      </h2>
      <p className="m-0 mt-2 text-sm text-[var(--sea-ink-soft)]">
        {listing.address_city ?? '—'}
      </p>
    </article>
  )
}
