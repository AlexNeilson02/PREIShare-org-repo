import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({ component: DashboardLayout })

function DashboardLayout() {
  return (
    <div className="page-wrap px-4 py-12">
      <header className="mb-8">
        <p className="island-kicker mb-2">PREIshare</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Investor Dashboard
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
