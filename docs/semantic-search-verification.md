# Semantic search verification report (PREIshare)

## Scope checked
- Requirements source: `docs/semantic-search-requirements.md` (still on open PR #55; queries copied from that brief)
- UI: `src/routes/search.tsx`
- API: `src/routes/api/properties/search.ts`
- Search helper: `src/lib/property-search.ts`
- Seed inputs: `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`

Queries planned before touching the UI (from the requirements brief, plus one extra short/nonsense pair):

1. “quiet cabin near water with good rental upside” — top hit should read as a small, low-key stay near a lake/shore with guest or income language, even without those exact words.
2. “family-friendly home close to good schools” — a house suited to children, near schooling.
3. “downtown condo walkable to restaurants” — urban condominium, daily life on foot, food nearby.
4. Near-miss: “industrial warehouse with loading docks and highway access” — logistics first; cabin / family home / downtown condo must not win.
5. Keyword trap paraphrase of listing 1 that avoids its exact nouns (see below).

Success criteria tested: ranked list with highest similarity first; meaning-not-keywords; empty/nonsense fail safely; null embeddings excluded from matches.

## Environment
- Date tested: November 5, 2026 (America/New_York)
- Supabase project (name or ref only, no secrets): **none in this environment** (no `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` / `EMBEDDING_API_KEY`)
- App run method (e.g. local dev server): `npm run dev` (Vite on http://localhost:3000/)
- Embedding model / dimension expected: request body `process.env.EMBEDDING_MODEL ?? 'text-embedding-3-small'`; stored/query size `EMBEDDING_DIMENSIONS` = **1536**; SQL cosine distance `<=>`, returned `similarity = 1 - distance` (higher is better)

## Data checks
| Check | Result | Notes |
| --- | --- | --- |
| Sample properties present | FAIL | Hosted `public.properties` could not be queried. JSON seed has **8** listings in `data/sample-properties.json`. |
| Embeddings non-null for all samples | FAIL | Hosted null count unknown. Local SQL dry-run of the schema had a deliberate null-embedding row that `match_properties` skipped. Seed never ran here. |
| Seed script re-runnable without breaking search | SKIPPED | `npx tsx scripts/seed-property-embeddings.ts` exited 1: `Missing SUPABASE_URL`. No secrets were added to git. |

## Query results (semantic)
Live `POST /api/properties/search` for every non-empty query returned HTTP **500** `{ "error": "Search failed", "results": [] }` because the helper cannot embed without `EMBEDDING_API_KEY` and cannot call RPC without Supabase. Top-3 titles below are **not available from the running app**.

| # | Query | Top 3 results (title or id) | Sensible neighbors? | Notes |
| --- | --- | --- | --- | --- |
| 1 | quiet cabin near water with good rental upside | (none — API 500) | NO | Could not judge ranking. UI would show the same `Search failed` string as the JSON `error` field. |
| 2 | family-friendly home close to good schools | (none — API 500) | NO | Same 500. Expected neighbor if seeded: “Roomy house on a cul-de-sac”. |
| 3 | downtown condo walkable to restaurants | (none — API 500) | NO | Same 500. Expected neighbor if seeded: “Compact core condominium”. |
| 4 | industrial warehouse with loading docks and highway access | (none — API 500) | NO | Same 500. Expected top: “Distribution warehouse off the interstate”; cabin/family/condo should not lead. |

`GET /search` returned HTTP 200 with the form and placeholder text. Empty submit is handled in the page before fetch (“Type a description of the property you want.”).

Local **SQL-only** ranking (synthetic 1536-d vectors, not OpenAI) after the IVFFlat refine: a cabin-like vector scored similarity **1.000** first; an orthogonal warehouse vector scored **0.000** second; a null-embedding row was omitted. That proves distance order and null skip, not live semantic quality.

## Keyword-trap check
- Trap query (paraphrase, not exact listing text): `quiet cabin near water with good rental upside`
- Expected kind of property: shoreline / woodland hideaway with guest-season income (JSON id `11111111-1111-4111-8111-111111111111`, title “Cedar hideaway among the pines”)
- Actual top results: **none from the API** (HTTP 500)
- Did semantic search beat exact-keyword matching? NO
- Evidence (one sentence): The hideaway listing never uses the words quiet, cabin, water, or rental, so a keyword matcher would miss it, but this run never returned embeddings to prove a semantic hit—only that the sample copy is *designed* as a trap.

## Safety / edge cases
| Case | Expected | Actual | PASS / FAIL |
| --- | --- | --- | --- |
| Empty query | Clear error or empty list, no crash | `POST {}` and `"   "` → HTTP 400 `{ "error": "Query is required", "results": [] }`; UI empty submit does not crash | PASS |
| Nonsense tokens | Low similarity or empty, no crash | `zzzzqxxq 12## not-a-property` → HTTP 500 `{ "error": "Search failed", "results": [] }` (failed before ranking, because env is missing). No crash. | PARTIAL |
| Very short query | Stable response | `"hi"` → same HTTP 500 envelope, no crash | PARTIAL |

## Refine cycle (required)
- Failing or weak example (query + bad ranking or error): Local `match_properties` against two non-zero 1536-d vectors, with the IVFFlat index from `20250315000000_enable_pgvector_properties.sql` (`lists = 100`). Query equal to the cabin vector returned **only** “Cedar hideaway among the pines” (similarity 1.000) and **dropped** the orthogonal warehouse neighbor. pgvector logged: `ivfflat index created with little data` / low recall.
- Suspected layer (seed data / embedding text / SQL distance / helper / API / UI): SQL / index on `public.properties` (not the helper, API, or UI).
- Change made (files touched): added `supabase/migrations/20250315000002_drop_properties_ivfflat_for_sample_scale.sql` (`DROP INDEX IF EXISTS public.properties_embedding_ivfflat_idx`). Did not rewrite the original migration.
- Re-test result: After the drop, the same query returned both rows in the correct order (cabin 1.000, warehouse 0.000). Null embedding still omitted.
- Keep or revert decision: **Keep.** Tutorial scale (8 sample rows) should sequential-scan. Re-add IVFFlat only after row count can support a sane `lists` value.

A second tweak considered and **rejected**: changing `ORDER BY` to `similarity DESC` instead of `embedding <=> query_embedding`. Cosine distance already sorts best-first; switching to the derived similarity would risk floating-point ties and does not fix recall.

## Requirements traceability
| Requirement / success criterion | Met? | Evidence |
| --- | --- | --- |
| Sample properties exist with description text and stored vectors | NO | JSON has 8 full-sentence listings; hosted table was never seeded (no Supabase env). |
| Search returns a ranked list, best match first (highest similarity at the top) | PARTIAL | SQL function orders by cosine distance ascending and exposes `similarity`; live API never returned a list. IVFFlat refine was required for small-N recall. |
| At least one demo query returns a relevant property when key words are absent from the listing | NO | Trap listing exists in JSON; API 500 blocked the proof. |
| Beginner can explain why keyword search fails on that query | YES | Cedar hideaway uses shoreline / guests / seasonal income, not quiet+cabin+water+rental. |
| Near-miss warehouse query does not put cabin / family-home / downtown-condo on top | NO | Not executed against real embeddings. |
| Listings with no embedding are skipped | YES | Local `match_properties` omitted the null-embedding row. |
| Empty query fails safely | YES | HTTP 400 + UI message, no crash. |

## Remaining limitations (honest handoff)
- What this tutorial slice does **not** do yet (filters, auth, production embedding jobs, etc.): no hosted seed in this environment; no buyer-read RLS story; no price/beds/map filters; no production embedding batch; search uses the service-role client; `properties` is a tutorial table alongside `property_listings`.
- Known ranking weaknesses on the sample set: IVFFlat `lists = 100` on tiny data hid neighbors (now dropped for sample scale). Live OpenAI ranking is **unverified**. Warehouse copy includes the words “water” and “downtown” as distractors—once seeded, confirm they do not outrank lifestyle homes on cabin/family queries.
- Follow-ups for the next topic: set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `EMBEDDING_API_KEY` locally (not in git); apply migrations including `20250315000002_...`; run `npx tsx scripts/seed-property-embeddings.ts`; re-hit the four brief queries and fill in real top-3 titles; stakeholder handoff from this file.

## Sign-off
- Verified by: Cursor cloud agent (this run), November 5, 2026 (America/New_York)
- Ready to demo to a stakeholder? NO
- Blockers before demo: missing embedding and Supabase credentials; `public.properties` not seeded in a hosted project; live semantic ranking (including the keyword trap) not yet observed in the UI.
