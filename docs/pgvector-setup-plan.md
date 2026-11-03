# PREIshare pgvector setup plan

## Purpose

This is a **plan** for a later database **migration** (an ordered schema
change file). It is not the migration itself. There is no complete table
create or table-alter statement here.

The goal is to turn on **pgvector** (the PostgreSQL add-on that stores
lists of numbers and can rank them by closeness) and add one **embedding**
column (that number list) to the listings table we already have.

## Source of truth

- Data model:
  [docs/embedding-data-model.md](embedding-data-model.md)
- Table: **public.property_listings** (already created and migrated; do
  not rename it, and do not add a second listings table)
- Embedding column: **embedding** (one column on that table)
- Dimension (copied verbatim from the data model; not a real number yet):
  **DIMENSION_TODO**
- Ranking style: compare a query embedding to stored property embeddings
  and return the closest listings first. pgvector's operators return
  **distance** (smaller means closer), so ranking sorts **ascending**.
  See
  [docs/vector-search-learner-notes.md](vector-search-learner-notes.md).

## Migration goals (what "done" means)

The later migration is done when all of these are true:

- The **vector** extension is installed in the database (the pgvector
  add-on; without it there is no vector type).
- **public.property_listings** has one new column named **embedding**,
  of type vector(DIMENSION_TODO).
- That column may be null (temporary gap after insert, or when
  description is missing — the data model does not embed title alone).
- No second listings table exists. No second embedding column exists.
- The original listings migration is untouched. The new file's name
  sorts **after** every file already in `supabase/migrations/`.
- Verification queries below have been run and match this plan.

This migration does **not** generate real embeddings, does not add search
routes, and does not change who can read rows.

## Safe migration order (must not be reordered)

`supabase/migrations/` already contains files whose names begin
**20250321000000**:

- `20250321000000_property_listings.sql`
- `20250321000000_sponsors_properties_rls.sql`

Migrations run in **filename order**. The new file needs a timestamp
**later than every existing one** (later than 20250321000000), so it
runs after those two. Do not reuse 20250321000000. Do not rewrite those
files.

| Order | Step | Why this order |
|-------|------|----------------|
| 1 | Enable extension vector | Vector types and operators do not exist until it’s on |
| 2 | ALTER public.property_listings to add the embedding column | The table already exists, so this is an add-column, not a create-table |
| 3 | Optional vector index | Only after the column exists; not needed at sample scale |
| 4 | Verification queries | Confirm the schema before any seed or app code |

**Do not create a vector column before enabling the extension.**

**Do not create a second table or a second embedding column.**

## Similarity approach (beginner demo)

An **operator** here is a short symbol the database uses to compare two
vectors. pgvector gives operators that return **distance**, where
**smaller means closer**:

- `<->` — Euclidean (straight-line distance between the two lists)
- `<=>` — cosine distance (angle between the two lists; common for text
  embeddings)
- `<#>` — inner product (another closeness rule; still a distance-style
  result in pgvector)

**Cosine (`<=>`) is the common default for text embeddings.** This plan
uses that as the beginner-demo choice. It is not a production-model pick,
and it does not fill in DIMENSION_TODO.

Because these operators return distance, ranking sorts **ascending**
(smallest distance first). Sorting the other way puts the worst match on
top. That trap is written down in
[docs/vector-search-learner-notes.md](vector-search-learner-notes.md)
(distance = smaller is closer; do not sort backwards).

## Index recommendation

At tens of rows, **no index is needed**. A **sequential scan** (reading
the sample rows in order) is fine and simpler.

If an index is added later:

- It must come **after** the embedding column exists.
- Most rows should already be **non-null** in embedding first (indexing
  empty vectors is not useful for this tutorial).
- The index's **operator class** (the index's matching rule) has to
  match the distance operator used in search (for this demo, the cosine
  operator `<=>`).

Skip the index in the first migration unless a later step has a reason
to add it.

## Environment values (high level—no secrets in this file)

Names only. Never put real keys, tokens, or connection strings in this
doc, in git, or in chat logs.

Already named in `.env.example` (server-only; no `VITE_` prefix):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If migrations run via the CLI (command-line tools), a **database
connection string** is also needed (often named `DATABASE_URL`). That
name is not in `.env.example` today. Document the **name** only if it is
added later.

For the later embedding step, an embedding-provider key such as
`OPENAI_API_KEY` (a typical provider-key **name**; this plan does not
choose the model).

**The embedding provider key is server-only and must never take a
`VITE_` prefix.** A `VITE_` variable ships in the browser bundle, and
anyone could then spend against the account.

This provider key is **not yet in `.env.example`** and will need adding
before the embedding step. Do not add it in this plan's change set. Do
not store a real value here.

## Verification queries (run after migration)

These are **intents** plus short illustrative sketches — not a migration
script, and not complete table-create or table-alter statements.

1. **Confirm the vector extension is installed.**
   The database should list an extension named `vector`.

   ```sql
   -- intent: vector (pgvector) is installed
   select extname from pg_extension where extname = 'vector';
   ```

2. **Confirm public.property_listings now has an embedding column of type
   vector with the planned dimension.**
   The column name is embedding. The size must be **DIMENSION_TODO**
   (same spelling as the data model), not a guessed number.

   ```sql
   -- intent: embedding exists on public.property_listings as vector(DIMENSION_TODO)
   select column_name, udt_name
   from information_schema.columns
   where table_schema = 'public'
     and table_name = 'property_listings'
     and column_name = 'embedding';
   ```

   Also check the type's size reports DIMENSION_TODO. If it shows a real
   number, the migration disagreed with the data model and must be
   fixed.

3. **Confirm a row with a null embedding is allowed.**
   The data model allows null as a temporary gap (insert before embed,
   or missing description). Inserting or inspecting a row with embedding
   left empty should succeed.

   ```sql
   -- intent: embedding may be null; a null vector is not a search hit
   select id, embedding
   from public.property_listings
   where embedding is null;
   ```

4. **Optional smoke test: compare two literal vectors with the chosen
   operator.**
   This checks that `<=>` runs and returns a distance. Use two short
   lists of the **same** length. This is not a substitute for checking
   the column's DIMENSION_TODO size.

   ```sql
   -- intent: cosine distance; smaller is closer; sort ascending
   select '[1,2,3]'::vector <=> '[1,2,4]'::vector as cosine_distance;
   ```

## Out of scope for this migration plan

- Generating real embeddings (calling a model and saving number lists).
- Search API routes and React UI.
- The buyer-read RLS policy.
- Hybrid keyword-plus-vector ranking.
- Rewriting `20250321000000_property_listings.sql` or
  `20250321000000_sponsors_properties_rls.sql`.
- Filling in DIMENSION_TODO with a real number.
- Putting secrets or `VITE_` copies of server keys in this file.

## Handoff to next step

After this plan is followed (in a later PR that adds the actual
migration):

1. Keep **public.property_listings**. One **embedding** column. Dimension
   stays **DIMENSION_TODO** until the model is chosen, then replace every
   copy in one pass (data model, this plan, migration, TypeScript types).
2. Generate embeddings only for rows with non-empty description. Leave
   others null and skip them in search.
3. Use cosine distance (`<=>`) for the beginner demo and sort
   **ascending**.
4. Carry forward this **open RLS question** from
   [docs/embedding-data-model.md](embedding-data-model.md):
   **property_listings** policies scope reads to `owner_id = auth.uid()`,
   so buyer-facing search returns nothing until a read policy exists.
   Enabling pgvector does **not** solve that, and it will block the
   search step. Do not write that policy in the pgvector migration.
5. Do not add `OPENAI_API_KEY` (or any provider key) as a `VITE_`
   variable. Add the **name** to `.env.example` only when the embedding
   step starts, with no real value.
