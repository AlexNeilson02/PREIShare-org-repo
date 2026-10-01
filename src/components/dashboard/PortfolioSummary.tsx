export type HoldingSnapshot = {
  id: string
  name: string
  allocationLabel: string
  valueLabel: string
}

export type PortfolioSummaryProps = {
  title?: string
  totalLabel: string
  holdings?: HoldingSnapshot[]
  isSampleData?: boolean
}

const MOCK_HOLDINGS: HoldingSnapshot[] = [
  {
    id: 'h1',
    name: 'Sample Multifamily Fund A',
    allocationLabel: '40%',
    valueLabel: '$120,000',
  },
  {
    id: 'h2',
    name: 'Sample Industrial Note B',
    allocationLabel: '35%',
    valueLabel: '$105,000',
  },
  {
    id: 'h3',
    name: 'Sample Cash Reserve',
    allocationLabel: '25%',
    valueLabel: '$75,000',
  },
]

export function PortfolioSummary({
  title = 'Portfolio summary',
  totalLabel,
  holdings = MOCK_HOLDINGS,
  isSampleData = true,
}: PortfolioSummaryProps) {
  return (
    <section
      className="portfolio-summary island-shell rounded-2xl p-5"
      aria-labelledby="portfolio-summary-heading"
    >
      <div className="portfolio-summary__header mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2
          id="portfolio-summary-heading"
          className="display-title m-0 text-xl font-bold tracking-tight text-[var(--sea-ink)]"
        >
          {title}
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner demo-pill m-0" role="note">
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>
      <p className="portfolio-summary__total mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <span className="portfolio-summary__total-label island-kicker">
          {isSampleData ? 'Total (sample)' : 'Total'}
        </span>
        <span className="portfolio-summary__total-value display-title text-2xl font-bold text-[var(--sea-ink)]">
          {totalLabel}
        </span>
      </p>
      <ul className="portfolio-summary__list m-0 flex list-none flex-col gap-2 p-0">
        {holdings.map((item) => (
          <li
            key={item.id}
            className="portfolio-summary__row demo-list-item flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
          >
            <span className="portfolio-summary__name font-semibold text-[var(--sea-ink)]">
              {item.name}
            </span>
            <span className="portfolio-summary__allocation text-sm text-[var(--sea-ink-soft)]">
              {item.allocationLabel}
            </span>
            <span className="portfolio-summary__value font-semibold text-[var(--sea-ink)]">
              {item.valueLabel}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
