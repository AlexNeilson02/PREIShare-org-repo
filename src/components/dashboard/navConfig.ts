export type NavItem = { label: string; to: string }

// Both Sidebar and MobileNav import from here so the lists cannot drift.
export const navItems: NavItem[] = [
  { label: 'Home', to: '/dashboard' },
  { label: 'Portfolio', to: '/dashboard/portfolio' },
  { label: 'Deals', to: '/dashboard/deals' },
  { label: 'Profile', to: '/dashboard/profile' },
]
