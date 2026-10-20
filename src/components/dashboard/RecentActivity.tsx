export type ActivityItem = {
  id: string
  whenLabel: string
  description: string
  category?: string
}

export type RecentActivityProps = {
  title?: string
  items: ActivityItem[]
  emptyMessage?: string
}

// Mock placeholder data — not real PREIshare data.
export const MOCK_RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: 'activity-1',
    whenLabel: 'Today',
    description: 'Sample distribution posted to cash reserve',
    category: 'Distribution',
  },
  {
    id: 'activity-2',
    whenLabel: 'Yesterday',
    description: 'Sample capital call reminder for coastal fund',
    category: 'Notice',
  },
  {
    id: 'activity-3',
    whenLabel: 'Last week',
    description: 'Sample quarterly update added to multifamily note',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items,
  emptyMessage = 'No recent activity yet.',
}: RecentActivityProps) {
  return (
    <section className="island-shell rounded-2xl p-5 sm:p-6">
      <h2 className="m-0 text-xl font-semibold text-[var(--sea-ink)]">{title}</h2>
      {items.length === 0 ? (
        <p className="m-0 mt-4 text-sm text-[var(--sea-ink-soft)]">{emptyMessage}</p>
      ) : (
        <ul className="m-0 mt-4 list-none space-y-3 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="border-b border-[var(--line)] pb-3 last:border-b-0 last:pb-0"
            >
              <p className="island-kicker m-0">{item.whenLabel}</p>
              <p className="m-0 mt-1 font-semibold text-[var(--sea-ink)]">{item.description}</p>
              {item.category ? (
                <p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">{item.category}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
