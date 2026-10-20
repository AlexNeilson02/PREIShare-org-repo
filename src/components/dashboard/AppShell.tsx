import type { ReactNode } from 'react'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

export type AppShellProps = {
  children: ReactNode
  title?: string
  sidebar?: ReactNode
}

export function AppShell({ children, title, sidebar }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col">
      <MobileNav />
      <Header title={title} />
      <div className="flex flex-1">
        <aside
          aria-label="Dashboard sidebar"
          className="hidden w-64 shrink-0 border-r border-[var(--line)] bg-[var(--header-bg)] px-4 py-6 text-sm text-[var(--sea-ink-soft)] md:block"
        >
          {sidebar ?? <Sidebar />}
        </aside>
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 text-[var(--sea-ink)]">
          {children}
        </main>
      </div>
    </div>
  )
}
