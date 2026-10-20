export type PortfolioHolding = {
  id: string
  name: string
  allocationLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  holdings: PortfolioHolding[]
  totalLabel?: string
  emptyMessage?: string
}

// Mock placeholder data — not real PREIshare data.
export const MOCK_PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { id: 'holding-1', name: 'Sample coastal fund', allocationLabel: '42%' },
  { id: 'holding-2', name: 'Sample multifamily note', allocationLabel: '33%' },
  { id: 'holding-3', name: 'Sample cash reserve', allocationLabel: '25%' },
]

export function PortfolioSummary({
  title = 'Portfolio summary',
  holdings,
  totalLabel,
  emptyMessage = 'No portfolio holdings to show yet.',
}: PortfolioSummaryProps) {
  return (
    <section className="island-shell rounded-2xl p-5 sm:p-6">
      <h2 className="m-0 text-xl font-semibold text-[var(--sea-ink)]">{title}</h2>
      {totalLabel ? (
        <p className="m-0 mt-2 text-sm text-[var(--sea-ink-soft)]">{totalLabel}</p>
      ) : null}
      {holdings.length === 0 ? (
        <p className="m-0 mt-4 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 mt-4 list-none space-y-3 p-0">
          {holdings.map((holding) => (
            <li
              key={holding.id}
              className="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
            >
              <span className="font-semibold text-[var(--sea-ink)]">{holding.name}</span>
              <span className="text-sm text-[var(--sea-ink-soft)]">{holding.allocationLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
