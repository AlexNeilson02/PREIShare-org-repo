import { createFileRoute } from '@tanstack/react-router'
import { PortfolioSummary } from '../../components/dashboard/PortfolioSummary'
import { RecentActivity } from '../../components/dashboard/RecentActivity'
import { StatsCard } from '../../components/dashboard/StatsCard'

export const Route = createFileRoute('/dashboard/')({ component: DashboardHomePage })

const TOTAL_PORTFOLIO_VALUE = '$300,000'

function DashboardHomePage() {
  return (
    <section className="flex flex-col gap-6">
      <p className="demo-alert m-0" role="note">
        Demo view — all figures are placeholders
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatsCard
          label="Total portfolio value"
          value={TOTAL_PORTFOLIO_VALUE}
          hint="Sample total"
        />
        <StatsCard label="Open deals" value="3" hint="Sample count" />
        <StatsCard
          label="Contributions YTD"
          value="$24,000"
          hint="Sample YTD"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PortfolioSummary totalLabel={TOTAL_PORTFOLIO_VALUE} />
        <RecentActivity />
      </div>
    </section>
  )
}
