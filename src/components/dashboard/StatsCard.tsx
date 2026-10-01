import type { ReactNode } from 'react'

export type StatsCardProps = {
  label: string
  value: string
  hint?: string
  /** Optional icon or badge slot for later polish */
  icon?: ReactNode
}

/** Reusable metric tile for the investor dashboard home. */
export function StatsCard({ label, value, hint, icon }: StatsCardProps) {
  return (
    <article
      className="stats-card island-shell rounded-2xl p-5"
      aria-label={label}
    >
      <header className="stats-card__header mb-3 flex items-start justify-between gap-3">
        <p className="stats-card__label island-kicker m-0">{label}</p>
        {icon ? (
          <span className="stats-card__icon shrink-0 text-[var(--lagoon-deep)]">
            {icon}
          </span>
        ) : null}
      </header>
      <p className="stats-card__value display-title m-0 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="stats-card__hint mt-2 m-0 text-sm text-[var(--sea-ink-soft)]">
          {hint}
        </p>
      ) : null}
    </article>
  )
}
