import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createSupabaseServerClient } from '../../lib/supabase.server'

export type PropertyListItem = {
  id: string
  title: string
  address_city: string | null
  status: string | null
  created_at: string
}

const loadSponsorProperties = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ properties: PropertyListItem[]; error: string | null }> => {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      throw redirect({ to: '/login' })
    }

    // Row visibility comes from RLS (listings_select_own), not from this code.
    const { data, error } = await supabase
      .from('property_listings')
      .select('id, title, address_city, status, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return { properties: [], error: 'Could not load properties. Try again.' }
    }

    return { properties: data ?? [], error: null }
  },
)

export const Route = createFileRoute('/dashboard/properties')({
  loader: () => loadSponsorProperties(),
  component: PropertiesPage,
})

function PropertiesPage() {
  const { properties, error } = Route.useLoaderData()

  return (
    <section>
      <h1 className="display-title m-0 text-3xl font-bold text-[var(--sea-ink)]">
        Your properties
      </h1>
      <p className="mt-2 text-[var(--sea-ink-soft)]">
        Visibility is enforced by the database.
      </p>
      <p role="alert" className="mt-4 min-h-6 text-sm text-[var(--palm)]">
        {error}
      </p>
      {properties.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-[rgba(50,143,151,0.3)] px-4 py-8 text-[var(--sea-ink-soft)]">
          No properties yet
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0">
          {properties.map((property) => (
            <li key={property.id}>
              <article className="island-shell rounded-2xl p-5">
                <h2 className="m-0 text-xl font-semibold tracking-tight text-[var(--sea-ink)]">
                  {property.title}
                </h2>
                <p className="m-0 mt-2 text-sm text-[var(--sea-ink-soft)]">
                  {property.address_city ?? '—'}
                </p>
                <p className="m-0 mt-2 text-sm font-semibold text-[var(--lagoon-deep)]">
                  {property.status}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
