// Seed public.properties with sample listings + embeddings.
//
// Run from the repo root:
//   npx tsx scripts/seed-property-embeddings.ts
//
// Required environment variables (names only — never put real values in git):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//   EMBEDDING_API_KEY
// Optional:
//   EMBEDDING_MODEL
//
// This CLI script does not import src/lib/supabase.server.ts because that
// module also loads TanStack Start cookie helpers that are not available
// outside the app server.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import {
  assertEmbeddingDimension,
  generatePropertyEmbedding,
} from '../src/lib/embeddings/generate'
import { EMBEDDING_DIMENSIONS } from '../src/lib/embeddings/types'

type SampleProperty = {
  id: string
  title: string
  description: string
  location: string
  price_usd: number
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing ${name}. Export it in your shell (or a local .env you do not commit) before seeding.`,
    )
  }
  return value
}

async function main() {
  const supabaseUrl = requireEnv('SUPABASE_URL')
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  requireEnv('EMBEDDING_API_KEY')

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const filePath = path.join(process.cwd(), 'data', 'sample-properties.json')
  const raw = await readFile(filePath, 'utf8')
  const parsed = JSON.parse(raw) as { properties?: SampleProperty[] }
  const properties = parsed.properties

  if (!Array.isArray(properties) || properties.length === 0) {
    throw new Error('data/sample-properties.json must contain a properties array.')
  }

  console.log(
    `Seeding ${properties.length} rows into public.properties (embedding length must be ${EMBEDDING_DIMENSIONS}).`,
  )

  for (const property of properties) {
    const result = await generatePropertyEmbedding({
      title: property.title,
      description: property.description,
      locationSummary: property.location,
    })

    if (!result.ok) {
      console.error('Failed to embed', property.id, result.code, result.message)
      process.exitCode = 1
      continue
    }

    if (!assertEmbeddingDimension(result.embedding)) {
      console.error(
        'Failed to seed',
        property.id,
        `embedding length ${result.embedding.length} !== ${EMBEDDING_DIMENSIONS}`,
      )
      process.exitCode = 1
      continue
    }

    // pgvector accepts a JSON number array through the Supabase client.
    const { error } = await supabase.from('properties').upsert(
      {
        id: property.id,
        title: property.title,
        description: property.description,
        location: property.location,
        price_usd: property.price_usd,
        embedding: result.embedding,
      },
      { onConflict: 'id' },
    )

    if (error) {
      console.error('Failed to seed', property.id, error.message)
      process.exitCode = 1
      continue
    }

    console.log(
      'Seeded',
      property.id,
      property.title,
      'embedding dims:',
      result.embedding.length,
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
