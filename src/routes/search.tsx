import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'

export const Route = createFileRoute('/search')({
  component: PropertySearchPage,
})

type SearchResult = {
  id: string
  title: string
  description: string
  similarity: number
}

function PropertySearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setStatus('done')
      setErrorMessage('Type a description of the property you want.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      })
      const data = (await res.json()) as {
        error?: string
        results?: SearchResult[]
      }
      if (!res.ok) {
        throw new Error(data.error || 'Search failed')
      }
      // Display only — do not sort/re-score on the client.
      setResults(Array.isArray(data.results) ? data.results : [])
      setStatus('done')
    } catch (err) {
      setResults([])
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Search failed')
    }
  }

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell mx-auto max-w-xl rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Semantic search</p>
        <h1 className="display-title mb-3 text-3xl font-bold text-[var(--sea-ink)]">
          PREIshare property search
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          Describe the kind of investment property you want. We match meaning,
          not only keywords.
        </p>

        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <label
            htmlFor="q"
            className="flex flex-col gap-1 text-sm font-semibold text-[var(--sea-ink)]"
          >
            Search
            <input
              id="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="quiet cabin near water with rental upside"
              className="rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-2 font-normal text-[var(--sea-ink)]"
            />
          </label>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] disabled:opacity-60"
          >
            {status === 'loading' ? 'Searching…' : 'Search'}
          </button>
        </form>

        {errorMessage ? (
          <p role="alert" className="mt-4 text-sm text-[var(--palm)]">
            {errorMessage}
          </p>
        ) : null}

        {status === 'done' && results.length === 0 && !errorMessage ? (
          <p className="mt-4 text-sm text-[var(--sea-ink-soft)]">
            No matching properties yet. Try different words from the sample
            listings.
          </p>
        ) : null}

        {results.length > 0 ? (
          <ul className="mt-6 list-none space-y-4 p-0">
            {results.map((result) => (
              <li
                key={result.id}
                className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-4"
              >
                <strong className="block text-[var(--sea-ink)]">
                  {result.title}
                </strong>
                <p className="mt-1 mb-0 text-sm text-[var(--sea-ink-soft)]">
                  {result.description.slice(0, 160)}
                  {result.description.length > 160 ? '…' : ''}
                </p>
                <p className="mt-2 mb-0 text-sm font-semibold text-[var(--lagoon-deep)]">
                  Similarity:{' '}
                  {typeof result.similarity === 'number'
                    ? result.similarity.toFixed(3)
                    : '—'}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}
