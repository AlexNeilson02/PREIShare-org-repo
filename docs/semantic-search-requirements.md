# PREIshare semantic search — requirements brief

This is a requirements brief only. It does not add application code or SQL.
`docs/sponsor-auth-requirements.md` is **not in this tree**; actor language
below is checked against
[`docs/requirements/sponsor-auth-and-listings-brief.md`](requirements/sponsor-auth-and-listings-brief.md),
[`docs/data-model-and-rls-matrix.md`](data-model-and-rls-matrix.md), and
[`supabase/migrations/20250321000000_property_listings.sql`](../supabase/migrations/20250321000000_property_listings.sql).

## Problem (one paragraph)

Buyers describe lifestyle and investment intent in everyday language. A
**keyword search** (matching the exact words someone typed) only hits listings
that already contain those words, so a phrase like “quiet cabin near water
with good rental upside” misses strong matches when those words never appear
together. This tutorial adds a small **semantic search** slice: search by
meaning, not by shared spelling. It uses Supabase **PostgreSQL** (the
relational database behind the project) with **pgvector** (a PostgreSQL
extension that stores lists of numbers and can rank rows by how close those
lists are). An **embedding** is that list of numbers for a piece of text;
similar ideas sit close together even when the wording differs.
**Similarity** is the score of that closeness. The search ranks listings by
similarity instead of counting overlapping words.

## Actors

| Actor | Goal |
|-------|------|
| Property buyer / investor | Describe what they want in plain language and get a ranked list of listings whose **description** text matches that intent, even when the listing does not reuse the query’s words. |
| PREIshare operator | Keep a small sample of listings with real description text and stored vectors, then confirm a search returns relevant matches first. |
| Coding agent | Follow this brief for a tutorial-sized slice (embeddings, pgvector, helpers, a minimal search page) without adding product features that are out of scope. |

These three names are labels for this tutorial. They are **not** a decision
that buyer, investor, and sponsor are the same role. See
[Assumptions and open questions](#assumptions-and-open-questions).

## Example queries (must drive later tests)

Later verification should run these four queries, in this order. No SQL here.
A “good top result” is what a person would expect to see **first** in a
ranked list, not a claim about a specific row in the database.

1. **“quiet cabin near water with good rental upside”** — A good top result
   reads as a small, low-key stay near a lake, river, or coast, with some
   mention of guests, income, or investment — even if it never uses the words
   cabin, quiet, water, or rental together.
2. **“family-friendly home close to good schools”** — A good top result reads
   as a house or similar home suited to a household with children, near
   schooling, even if it never says “family-friendly” or “schools.”
3. **“downtown condo walkable to restaurants”** — A good top result reads as
   an urban condominium (or similar) where daily life is on foot and food is
   nearby, even if it never says “walkable” or “restaurants.”
4. **Near-miss control: “industrial warehouse with loading docks and highway
   access.”** A correct search ranks lifestyle homes and cabins **low** for
   this query: it describes logistics space, not a place to live or stay.
   Keyword overlap (for example “water” or “downtown” appearing somewhere
   else) must not pull the cabin, family home, or condo to the top. This
   query is how we prove the search **discriminates** instead of returning
   the same listings for every phrase.

## Success criteria (observable)

Things a beginner can see in a browser or a terminal. Unchecked until a later
step actually demonstrates them.

- [ ] Sample properties exist with **description** text and stored vectors
      (the number lists produced by the embedding step).
- [ ] A search returns a **ranked list**, best match first (highest
      similarity at the top).
- [ ] At least one demo query (from the list above) returns a relevant
      property even when that query’s key words are **absent** from the
      listing text.
- [ ] A beginner can explain why keyword search fails on that query (the
      listing never contains those exact words, so a word-matcher has
      nothing to hit, while meaning-based search can still rank it).
- [ ] The near-miss control query does **not** put the cabin / family-home /
      downtown-condo samples at the top.
- [ ] Listings with no description are skipped: they cannot be embedded, so
      they do not appear as if they had a vector.

## In scope for this tutorial

Later steps may implement these. This file only names them.

- Plain-language understanding of embeddings and similarity (as defined
  above).
- A data model for listings **plus** vectors (shape chosen in the data-model
  step — not in this brief).
- A migration enabling pgvector. The current listings migration enables
  `pgcrypto` only; pgvector is product direction and is **not** in that file
  yet.
- A TypeScript helper to generate embeddings.
- A seed or backfill path for a **small** sample set.
- Similarity search SQL plus a TypeScript helper (written in a later step,
  not here).
- A minimal API route and a simple React search page.
- Verification notes and a handoff doc.

Search in this tutorial is over **listing text** — the existing nullable
description on the listings table already in the migration. Do not add map
search, price/beds filters, or ranking features beyond similarity of that
text.

## Out of scope (explicit non-goals)

- Production embedding billing, rate-limit operations, or batch jobs at
  scale.
- Map search.
- Filters for price or beds.
- Auth, payments, messaging.
- Advanced ranking or personalization.
- Design polish.
- Mobile-specific work.
- Inventing table names, column names, embedding dimensions, or a distance
  metric in this brief (those belong to the data-model step).
- Renaming or duplicating the existing listings table.
- Turning on a broad “anyone can read every row” database policy so search
  “just works.”
- Any product slice that is not semantic search over listing text.

## Assumptions and open questions

1. **Actor naming is unresolved.** Sprint 3 built an **investor** dashboard.
   Sprint 4’s brief names **sponsors**. This brief names **buyers** (and
   uses “property buyer / investor” as a search actor). Do **not** assume
   these are one role or three. The matrix already flags investor vs sponsor
   as open; this tutorial does not close it. Do not relabel the dashboard
   Header or nav to “buyer” to make this slice look finished.
2. **Listing description text may not exist yet.** In
   `supabase/migrations/20250321000000_property_listings.sql`, `description`
   is nullable (`text` with no `not null`). The table may also be empty.
   Sample listings with **real descriptive sentences** are a prerequisite
   for every later step. Listings with no description cannot be embedded;
   they have no meaning-vector to compare. Do not pretend a title or address
   alone is enough for this tutorial.
3. **Embedding provider, vector dimension, and distance metric are deferred**
   to the data-model step. Once chosen, they must stay consistent end to
   end: the stored vectors, the query embedding, and the similarity SQL must
   all use the same provider, the same length of number list, and the same
   way of scoring closeness. This brief does not pick them.
4. **Who can search whose rows?** The listings table currently allows a
   signed-in owner to read only their own rows. A buyer-facing search over
   other people’s listings is a policy question for later, not a reason to
   invent a public-read rule here. The Sprint 4 handoff already says
   pgvector search is not a reason to bypass row-level security.

## Handoff note for later steps

Do this work in order. Do not skip the sample text.

1. Confirm there are sample listing rows with non-empty **description**
   text. If the table is empty or every description is null, stop and seed
   descriptions before generating embeddings.
2. In the data-model step, choose embedding provider, vector dimension, and
   distance metric **once**. Write them down. Use the same three choices in
   the migration, the TypeScript embed helper, the backfill, and the search
   helper. Do not invent column names in chat; put them in that data-model
   doc.
3. Enable pgvector in a **new** migration. Do not rewrite the existing
   listings migration.
4. Keep the listings table name that already exists. Do not rename it, and
   do not add a second listings table for search.
5. Generate embeddings only for rows that have description text. Backfill
   must skip null or blank descriptions.
6. Wire a thin search path (SQL + TypeScript helper, then a minimal API
   route and React page) that returns a ranked list. Drive tests from the
   four example queries above, including the near-miss control.
7. Write verification notes a beginner can repeat in a browser or terminal.
   A later handoff doc should record provider / dimension / metric, which
   sample rows were embedded, and which query proved that keyword search
   fails.

This brief is done when a later agent can implement that sequence without
guessing the problem, the four queries, or the non-goals.
