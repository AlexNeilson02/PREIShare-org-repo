import { formatCurrency } from '../../lib/format'

export type Deal = {
  id: string
  name: string
  location: string
  minimumInvestment: number
  status: 'Open' | 'Closing soon' | 'Waitlist'
}

export type DealsListProps = {
  deals?: Deal[]
  emptyMessage?: string
  isSampleData?: boolean
}

const MOCK_DEALS: Deal[] = [
  {
    id: 'd1',
    name: 'Harbor View Residences',
    location: 'Tampa, FL',
    minimumInvestment: 25000,
    status: 'Open',
  },
  {
    id: 'd2',
    name: 'Summit Logistics Hub',
    location: 'Columbus, OH',
    minimumInvestment: 50000,
    status: 'Closing soon',
  },
  {
    id: 'd3',
    name: 'Pinecrest Medical Office',
    location: 'Austin, TX',
    minimumInvestment: 35000,
    status: 'Waitlist',
  },
]

const STATUS_BADGE_CLASS: Record<Deal['status'], string> = {
  Open: 'border-[color-mix(in_oklab,var(--lagoon)_50%,var(--line))] bg-[color-mix(in_oklab,var(--lagoon)_20%,transparent)] text-[var(--sea-ink)]',
  'Closing soon':
    'border-[rgba(193,126,42,0.4)] bg-[rgba(193,126,42,0.14)] text-[var(--sea-ink)]',
  Waitlist:
    'border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]',
}

export function DealsList({
  deals = MOCK_DEALS,
  emptyMessage = 'No open deals right now. Check back soon for new opportunities.',
  isSampleData = true,
}: DealsListProps) {
  return (
    <section
      className="dashboard-panel island-shell rounded-2xl p-5"
      aria-labelledby="open-deals-heading"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2
          id="open-deals-heading"
          className="display-title m-0 text-xl font-bold tracking-tight text-[var(--sea-ink)]"
        >
          Open deals
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner demo-pill m-0" role="note">
            Sample deals — placeholders only, not live offerings
          </p>
        ) : null}
      </div>

      {deals.length === 0 ? (
        <p className="empty-state m-0 text-sm text-[var(--sea-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        <ul className="deals-list m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {deals.map((deal) => (
            <li
              key={deal.id}
              className="deal-card demo-list-item flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="m-0 text-base font-semibold text-[var(--sea-ink)]">
                    {deal.name}
                  </h3>
                  <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
                    {deal.location}
                  </p>
                </div>
                <p
                  className={`status m-0 shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_BADGE_CLASS[deal.status]}`}
                >
                  {deal.status}
                </p>
              </div>
              <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
                Min. {formatCurrency(deal.minimumInvestment)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
