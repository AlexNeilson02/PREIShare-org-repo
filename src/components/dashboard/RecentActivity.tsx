export type ActivityItem = {
  id: string
  title: string
  detail: string
  dateLabel: string
}

export type RecentActivityProps = {
  title?: string
  items?: ActivityItem[]
  isSampleData?: boolean
}

const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Distribution posted (sample)',
    detail: 'Sample Multifamily Fund A',
    dateLabel: 'Mar 1, 2026',
  },
  {
    id: 'a2',
    title: 'Capital call notice (sample)',
    detail: 'Sample Industrial Note B',
    dateLabel: 'Feb 18, 2026',
  },
  {
    id: 'a3',
    title: 'Document uploaded (sample)',
    detail: 'Accreditation letter',
    dateLabel: 'Feb 5, 2026',
  },
  {
    id: 'a4',
    title: 'Statement available (sample)',
    detail: 'Sample quarterly account statement',
    dateLabel: 'Jan 28, 2026',
  },
]

export function RecentActivity({
  title = 'Recent activity',
  items = MOCK_ACTIVITY,
  isSampleData = true,
}: RecentActivityProps) {
  return (
    <section
      className="recent-activity island-shell rounded-2xl p-5"
      aria-labelledby="recent-activity-heading"
    >
      <div className="recent-activity__header mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2
          id="recent-activity-heading"
          className="display-title m-0 text-xl font-bold tracking-tight text-[var(--sea-ink)]"
        >
          {title}
        </h2>
        {isSampleData ? (
          <p className="sample-data-banner demo-pill m-0" role="note">
            Sample activity — not connected to a live feed
          </p>
        ) : null}
      </div>
      <ol className="recent-activity__list m-0 flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="recent-activity__item demo-list-item flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
          >
            <div className="recent-activity__body min-w-0">
              <p className="recent-activity__title m-0 font-semibold text-[var(--sea-ink)]">
                {item.title}
              </p>
              <p className="recent-activity__detail m-0 text-sm text-[var(--sea-ink-soft)]">
                {item.detail}
              </p>
            </div>
            <time className="recent-activity__date text-sm text-[var(--sea-ink-soft)]">
              {item.dateLabel}
            </time>
          </li>
        ))}
      </ol>
    </section>
  )
}
