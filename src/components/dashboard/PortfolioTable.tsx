import { formatCurrency } from '../../lib/format'

export type PortfolioHolding = {
  id: string
  propertyName: string
  assetType: string
  investedAmount: number
  currentValue: number
  status: 'Performing' | 'Under review' | 'Exited'
}

export type PortfolioTableProps = {
  holdings?: PortfolioHolding[]
  emptyMessage?: string
  isSampleData?: boolean
}

const MOCK_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'h1',
    propertyName: 'Riverfront Lofts',
    assetType: 'Multifamily',
    investedAmount: 50000,
    currentValue: 56200,
    status: 'Performing',
  },
  {
    id: 'h2',
    propertyName: 'Cedar Business Park',
    assetType: 'Industrial',
    investedAmount: 75000,
    currentValue: 74100,
    status: 'Under review',
  },
  {
    id: 'h3',
    propertyName: 'Maple Street Retail',
    assetType: 'Retail',
    investedAmount: 40000,
    currentValue: 40000,
    status: 'Exited',
  },
]

export function PortfolioTable({
  holdings = MOCK_HOLDINGS,
  emptyMessage = 'No holdings to show yet. New investments will appear here.',
  isSampleData = true,
}: PortfolioTableProps) {
  return (
    <section
      className="dashboard-panel island-shell rounded-2xl p-5"
      aria-labelledby="portfolio-holdings-heading"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2
          id="portfolio-holdings-heading"
          className="display-title m-0 text-xl font-bold tracking-tight text-[var(--sea-ink)]"
        >
          Your holdings
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner demo-pill m-0" role="note">
            Sample data — placeholders only, not live balances
          </p>
        ) : null}
      </div>

      {holdings.length === 0 ? (
        <p className="empty-state m-0 text-sm text-[var(--sea-ink-soft)]">
          {emptyMessage}
        </p>
      ) : (
        <div className="table-wrap dash-table-wrap demo-table-shell overflow-x-auto">
          <table className="demo-table min-w-[40rem]">
            <thead>
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Type</th>
                <th scope="col">Invested</th>
                <th scope="col">Current value</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((row) => (
                <tr key={row.id}>
                  <td>{row.propertyName}</td>
                  <td>{row.assetType}</td>
                  <td>{formatCurrency(row.investedAmount)}</td>
                  <td>{formatCurrency(row.currentValue)}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
