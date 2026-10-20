import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({ component: DashboardHome })

function DashboardHome() {
  return (
    <section className="island-shell rounded-2xl p-6 sm:p-8">
      <h2 className="mb-2 text-xl font-semibold text-[var(--sea-ink)]">
        Home
      </h2>
      <p className="m-0 text-base leading-7 text-[var(--sea-ink-soft)]">
        Portfolio metrics and recent activity will appear here.
      </p>
    </section>
  )
}
