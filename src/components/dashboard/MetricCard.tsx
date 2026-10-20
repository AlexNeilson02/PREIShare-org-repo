import type { ReactNode } from 'react'

export type MetricCardProps = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
}

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <article className="island-shell relative rounded-2xl p-5">
      {icon ? (
        <div className="absolute right-4 top-4 text-[var(--lagoon-deep)]">{icon}</div>
      ) : null}
      <p className="island-kicker m-0 pr-10">{label}</p>
      <p className="display-title m-0 mt-3 text-3xl font-bold tracking-tight text-[var(--sea-ink)]">
        {value}
      </p>
      {hint ? (
        <p className="m-0 mt-2 text-sm text-[var(--sea-ink-soft)]">{hint}</p>
      ) : null}
    </article>
  )
}
