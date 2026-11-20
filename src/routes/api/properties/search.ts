import { createFileRoute } from '@tanstack/react-router'
import { searchPropertiesByText } from '../../../lib/property-search'

export const Route = createFileRoute('/api/properties/search')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as {
            query?: unknown
          }
          const query = typeof body.query === 'string' ? body.query.trim() : ''

          if (!query) {
            return Response.json(
              { error: 'Query is required', results: [] },
              { status: 400 },
            )
          }

          // Server-side only: embed + similarity search live in the helper.
          const results = await searchPropertiesByText(query)

          return Response.json({ query, results })
        } catch (err) {
          console.error('property search failed', err)
          return Response.json(
            { error: 'Search failed', results: [] },
            { status: 500 },
          )
        }
      },
    },
  },
})
