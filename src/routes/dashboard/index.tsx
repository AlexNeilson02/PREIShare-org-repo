import { createFileRoute } from '@tanstack/react-router'
import { MetricCard } from '../../components/dashboard/MetricCard'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'

// Shell demo data to be replaced by loaders in a later sprint.
const demoMetrics = [
  {
    label: 'Portfolio value',
    value: '—',
    hint: 'This figure appears once portfolio data is connected.',
  },
  {
    label: 'Active investments',
    value: '—',
    hint: 'This figure appears once holdings data is connected.',
  },
  {
    label: 'Distributions (YTD)',
    value: '—',
    hint: 'This figure appears once distribution data is connected.',
  },
]

export const Route = createFileRoute('/dashboard/')({ component: DashboardHome })

function DashboardHome() {
  return (
    <>
      <section
        aria-label="Key metrics"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {demoMetrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            hint={metric.hint}
          />
        ))}
      </section>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PortfolioSummary
          holdings={[]}
          emptyMessage="Your holdings will appear here once your portfolio is connected."
        />
        <RecentActivity
          items={[]}
          emptyMessage="Recent activity will appear here once account events are connected."
        />
      </div>
    </>
  )
}
