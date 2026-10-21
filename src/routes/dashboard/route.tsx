import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '../../lib/auth/session'
import { AppShell } from '../../components/dashboard/AppShell'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getUser()
    if (!user) {
      throw redirect({ to: '/auth/login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <AppShell title="Overview">
      <Outlet />
    </AppShell>
  )
}
