import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({ component: DashboardHomePage })

function DashboardHomePage() {
  return (
    <main>
      <h1>Dashboard overview</h1>
      <p>Mock placeholder: stats, portfolio summary, and recent activity will go here.</p>
    </main>
  )
}
