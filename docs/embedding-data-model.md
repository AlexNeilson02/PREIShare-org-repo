# PREIshare embedding data model

## Purpose

This note describes how PREIshare will store **embeddings** (lists of numbers
that stand for the *meaning* of listing text) so later search can rank
listings by closeness, not by shared spelling.

It does **not** design a new table. The listings table already exists:
**public.property_listings**. This tutorial adds one embedding column to that
table. Do not call the table properties. Do not add a second listings table
or a side table of vectors.

This file does not pick an embedding **model** (the program that turns text
into numbers) or a real **dimension** (how many numbers are in each list).

## Sources

Read in this order:

- [docs/semantic-search-requirements.md](semantic-search-requirements.md) —
  the problem, buyer queries, and success checks (search by meaning over
  listing text).
- [docs/embeddings-learner-notes.md](embeddings-learner-notes.md) —
  generation vs storage: make the number list, then save it with the row.
- [docs/vector-search-learner-notes.md](vector-search-learner-notes.md) —
  ranking: compare the query embedding to stored property embeddings,
  best-first, top-K, distance vs similarity.
- The existing listings migration
  `supabase/migrations/20250321000000_property_listings.sql` — real table
  and column names. Trust that file over generic examples.

## Overview

One existing table, one new column:

- Table: **public.property_listings** (already created and migrated).
- New column: **embedding**, a **vector** (a number list the database can
  store and compare) of size **DIMENSION_TODO**.
- Human-readable listing data stays in the columns that already exist
  (title, description, address_city, and the rest below).
- Meaning for search lives only in embedding.

Query embeddings (from the buyer's search phrase) and stored embeddings
(from listing text) must use the **same model** and the **same dimension**.
Mixing models or sizes makes closeness scores meaningless.

## Identifiers

These columns already exist. They are **not** meaning-text. Do not embed
them.

- **id** — uuid, required. The listing's stable identifier (primary key).
  Search results still return this id so a hit can be explained.
- **owner_id** — uuid, required. The signed-in sponsor who owns the row
  (points at the auth user). Today's read rules use this column; see Open
  questions for the buyer-search conflict.

## Core listing fields (this tutorial slice)

Scalar fields (ordinary values, not the vector) already on
public.property_listings. Names come from the migration. There is no
column named city — the city is **address_city**.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | text | yes | Short name shown on the listing. Part of the embed recipe. |
| description | text | no (nullable) | Longer summary. May be missing, especially on draft. Part of the embed recipe when present. |
| address_line1 | text | no (nullable) | Street number and name. Not embedded. |
| address_line2 | text | no (nullable) | Unit or suite. Not embedded. |
| address_city | text | no (nullable) | City. Not a column named city. Not embedded. |
| address_region | text | no (nullable) | State / province / region. Not embedded. |
| address_postal_code | text | no (nullable) | Postal code. Not embedded. |
| address_country | text | no (nullable) | Country. Not embedded. |
| price | numeric | no (nullable) | Asking price amount. A number, not meaning-text. Do not embed it. |
| status | text | yes | Closed set: draft, published, under_offer, sold, archived. Not embedded. Which values are searchable is an open question. |
| created_at | timestamptz | yes | When the row was created. Not embedded. |
| updated_at | timestamptz | yes | When the row last changed. Not embedded. |

Do not invent columns that are not in that migration (no property type, no
bed count, no extra financial fields in this slice).

## What text is embedded

The **canonical recipe** (the one text string we always send to the model)
is title, a blank line, then description, always built the same way so
re-embeds stay consistent:

{title}

{description}

Store the raw title and description **unchanged** in their own columns. The
vector is a separate column. Do not overwrite listing text with this
combined string. Do not embed ids, owner_id, price, status, timestamps, or
address parts as if they were meaning.

### When description is missing

description is nullable in this schema. A listing can exist with a title
and no description.

**Rule (picked):** do **not** embed from title alone. Leave embedding null
and **exclude** the listing from semantic search until description has
real text.

**Trade-off:** title-only embeddings would make every row look searchable,
but a short name is not the same kind of meaning as a full description, and
the requirements brief says not to pretend a title (or address) is enough.
Skipping is honest — we do not invent a vector — but those listings stay
invisible in meaning-search until someone writes a description. Blank
(whitespace-only) description is treated the same as null.

## Embedding column

One new column on the existing table. Not a new table.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| embedding | vector(DIMENSION_TODO) | required after backfill | Number list for the listing's meaning. Same model and DIMENSION_TODO as every query vector. |

A **backfill** is the later pass that generates embeddings for rows that
already exist. After that pass, searchable rows should have a vector.
Until then, null is only a gap in the lifecycle below.

### Dimension placeholder

Use the literal placeholder **DIMENSION_TODO** everywhere the size appears
— one spelling, no variations, no real number yet.

Query vectors and stored vectors must use the same model and the same
dimension. When the model is chosen, every occurrence of DIMENSION_TODO
gets replaced in **one pass** across this doc, the later migration, and
the TypeScript types. Do not replace some copies and leave others.

This file does not pick the model or the number.

### Nullability and backfill

Lifecycle for a listing that has description text:

1. Listing text created (title and description saved as ordinary columns).
2. Embedding generated (the recipe string goes into the model; a number
   list comes back).
3. Vector stored in embedding on the same public.property_listings row.
4. Listing eligible for search (it has a vector to compare).

Null on embedding is allowed **only** as a temporary state between insert
and embed, or while description is still missing (see the missing-text
rule). A null vector must not be treated as "similar to every query."
Those rows are skipped at search time.

## Separation of concerns

| Kind of information | Where it lives |
|---------------------|----------------|
| Human-readable listing | The scalar columns (title, description, address_city, price, status, and the other existing fields) |
| Meaning for search | The embedding column only |
| Similarity metric (the named rule for "how close") | Decided at query time, not stored in the row |

The vector never replaces description. You need text for the UI (what a
person reads) and the vector for ranking (what search compares).

## In scope vs out of scope (data model)

**In scope for this data-model note**

- Adding embedding to the existing public.property_listings table.
- The embed recipe and the null-description rule.
- DIMENSION_TODO as the unfilled size.
- The rule that query and stored vectors share one model and one dimension.

**Out of scope**

- Multiple embedding versions per listing.
- User accounts and saved searches.
- Keyword indexes as a replacement for vectors.
- Production model keys, rate limits, or batch infrastructure.
- A second table, a rename to properties, or new scalar columns.
- Writing the later migration, the embed helper, or search SQL (later
  steps).
- Picking the embedding model, a real dimension number, or the distance
  metric.

## Consistency checklist (must pass before migration)

- [ ] The table is still **public.property_listings**. No new listings
      table, no rename to properties.
- [ ] The new field is one column named **embedding**, type
      vector(DIMENSION_TODO).
- [ ] DIMENSION_TODO is the only size spelling in this doc; no real
      dimension number has been filled in yet.
- [ ] Query vectors and stored vectors are specified to use the same
      model and the same dimension.
- [ ] The embed recipe is always {title} then a blank line then
      {description}.
- [ ] ids, owner_id, price, address fields, status, and timestamps are
      not treated as meaning-text.
- [ ] Null description (or blank description) means no vector and no
      search hit — not a title-only embedding.
- [ ] Null embedding is only a temporary gap (insert → embed) or the
      missing-description case; it is not a match.
- [ ] The later change that adds the column is a **new** migration. Do
      not rewrite
      `supabase/migrations/20250321000000_property_listings.sql`.

## Open questions

1. **RLS conflict.** **Row Level Security (RLS)** is the database rule
   that limits which rows a caller can see. public.property_listings has
   four policies, all scoped to owner_id = auth.uid(), so a sponsor sees
   only their own rows. Semantic search is for buyers browsing listings
   they do not own, which under today's policies returns zero results. A
   new read policy is needed before search can work — likely public read
   limited to published listings. This is **unresolved**. Do not write
   the policy in this file.
2. **Which statuses are searchable?** The status column allows draft,
   published, under_offer, sold, and archived. Should drafts and archived
   listings be embedded and returned in buyer search, or only published?
3. **Exact embedding model name and final dimension**, and the **distance
   metric** for the later search (aligned with
   [docs/vector-search-learner-notes.md](vector-search-learner-notes.md):
   smaller is closer if the score is distance; larger is closer if the
   score is similarity). This file does not pick them. When they are
   chosen, replace DIMENSION_TODO in one pass.

## Handoff

Next agents should treat this file as the shape of storage, not as a
migration.

1. Keep public.property_listings. Add embedding there. Do not duplicate
   the table.
2. Do not fill DIMENSION_TODO until the model is chosen. Then replace
   every copy in this doc, the new migration, and the TypeScript types
   together.
3. Seed or confirm listing rows with non-empty description before
   generating vectors. Skip null or blank description.
4. Enable pgvector (the PostgreSQL add-on that stores and compares number
   lists) in a **new** migration that also adds the embedding column. Do
   not edit the original listings migration.
5. After vectors are stored, ranking follows the vector-search notes:
   same-model query embedding, compare to stored embedding, best-first,
   top-K.
6. Do not implement a buyer-wide read until the RLS open question is
   answered. Search is not a reason to bypass owner-scoped policies
   silently.
