// Single source of truth for investor-facing nav labels, paths, and page titles.

export type NavItem = {
  label: string
  path: string
  title: string
}

export type NavItemConfig = NavItem

export const dashboardNavItems = [
  {
    label: 'Home',
    path: '/dashboard',
    title: 'Dashboard overview',
  },
  {
    label: 'Portfolio',
    path: '/dashboard/portfolio',
    title: 'Your portfolio',
  },
  {
    label: 'Deals',
    path: '/dashboard/deals',
    title: 'Open deals',
  },
  {
    label: 'Profile',
    path: '/dashboard/profile',
    title: 'Your profile',
  },
] as const satisfies readonly NavItem[]

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname
}

export function getPageTitle(pathname: string): string {
  const normalized = normalizePathname(pathname)
  const exact = dashboardNavItems.find((item) => item.path === normalized)
  if (exact) return exact.title

  // Prefer the most specific matching path (longest prefix) for nested routes later.
  const prefixMatch = [...dashboardNavItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (item) =>
        item.path !== '/dashboard' && normalized.startsWith(`${item.path}/`),
    )

  return prefixMatch?.title ?? 'Dashboard'
}
