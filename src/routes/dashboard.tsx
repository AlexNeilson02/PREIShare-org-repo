import { Outlet, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { getUser, signOut } from '../lib/auth/session'
import { AppShell } from '../components/dashboard/AppShell'
import { createBrowserSupabaseClient } from '../lib/supabase/client'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const navigate = useNavigate()
  const signOutFn = useServerFn(signOut)

  async function onSignOut() {
    try {
      await signOutFn()
    } catch {
      return
    }

    try {
      const supabase = createBrowserSupabaseClient()
      await supabase.auth.signOut()
    } catch {
      // Server session is already cleared; still return the sponsor to login.
    }

    await navigate({ to: '/login' })
  }

  return (
    <AppShell
      title="Overview"
      actions={
        <button
          type="button"
          onClick={() => {
            void onSignOut()
          }}
          className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-4 py-2 text-sm font-semibold text-[var(--lagoon-deep)]"
        >
          Sign out
        </button>
      }
    >
      <Outlet />
    </AppShell>
  )
}
