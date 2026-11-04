-- Enable pgvector so PostgreSQL can store and compare embedding vectors.
-- Safe to re-run: IF NOT EXISTS avoids errors if the extension is already on.
CREATE EXTENSION IF NOT EXISTS vector;

-- PREIshare listings already live in public.property_listings
-- (created by 20250321000000_property_listings.sql).
-- Do not create a second listings table, and do not rename this table to properties.
--
-- This migration only adds one embedding column for later semantic search.
-- The primary key remains id (uuid) on the existing table.
--
-- Listing text used for search already exists on the table:
--   title (required text) and description (nullable text).
-- The embed recipe is title, a blank line, then description
-- (see docs/embedding-data-model.md). Do not embed ids, price, status,
-- timestamps, or address parts.
--
-- embedding dimension MUST match the embedding model used in app code.
-- The data model and pgvector plan spell that size as DIMENSION_TODO
-- until a model is chosen. Do not replace this with a guessed number
-- such as 1536. When the model is chosen, replace every DIMENSION_TODO
-- copy in one pass (data model, this migration, TypeScript types) and
-- lock the column with ALTER COLUMN ... TYPE vector(N).
--
-- Planned type: vector(DIMENSION_TODO)
-- PostgreSQL type modifiers must be integer literals. Using that
-- placeholder as the typmod fails with:
--   invalid input syntax for type integer: "dimension_todo"
-- So this column is unconstrained vector until that one-pass replace.
--
-- The column is nullable: null is a temporary gap after insert, or when
-- description is missing (do not embed title alone). A null vector is
-- not a search hit.
--
-- Ranking note (not stored on the row): cosine distance (`<=>`) is the
-- beginner-demo operator. Smaller means closer, so search will sort
-- ASCENDING. No vector index here — at sample scale a sequential scan
-- is enough (docs/pgvector-setup-plan.md). Do not add a buyer-read RLS
-- policy in this file.

ALTER TABLE public.property_listings
  ADD COLUMN IF NOT EXISTS embedding vector;

-- Optional readability aid for humans browsing the schema in Supabase.
COMMENT ON COLUMN public.property_listings.embedding IS
  'pgvector embedding of listing title + description; planned dimension DIMENSION_TODO until the model is chosen.';
