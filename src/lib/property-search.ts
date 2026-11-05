// Server-only helper: embed a buyer query, then rank public.properties.
// Do not import this file from a React client component (it uses process.env
// via generatePropertyEmbedding and the service-role Supabase client).

import { generatePropertyEmbedding } from './embeddings/generate'
import { createSupabaseServiceRoleClient } from './supabase.server'

export type PropertyMatch = {
  id: string
  title: string
  description: string
  location: string
  similarity: number
}

type MatchPropertiesArgs = {
  query_embedding: number[]
  match_count: number
}

type MatchPropertiesRpc = (
  fn: 'match_properties',
  args: MatchPropertiesArgs,
) => Promise<{ data: PropertyMatch[] | null; error: { message: string } | null }>

/**
 * Embed a plain-language query and return the closest properties (top-K).
 * `similarity` is higher for a better match (1 - cosine distance).
 */
export async function searchPropertiesByText(
  query: string,
  matchCount = 5,
): Promise<PropertyMatch[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  const result = await generatePropertyEmbedding({
    title: trimmed,
    description: '',
  })

  if (!result.ok) {
    throw new Error(
      `Could not embed search query (${result.code}): ${result.message}`,
    )
  }

  const supabase = createSupabaseServiceRoleClient()
  const rpc = supabase.rpc.bind(supabase) as unknown as MatchPropertiesRpc
  const { data, error } = await rpc('match_properties', {
    query_embedding: result.embedding,
    match_count: matchCount,
  })

  if (error) {
    throw new Error(`match_properties failed: ${error.message}`)
  }

  return data ?? []
}
