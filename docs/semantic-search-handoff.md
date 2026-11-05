# PREIshare semantic search — handoff

## 1. Client story recap
PREIshare helps people discover investment properties. Keyword search fails when a buyer types intent-heavy phrases (example: “quiet cabin near water with good rental upside”) that may never appear word-for-word in a listing. This tutorial shipped a beginner slice of **semantic search**: property text → embedding vector → pgvector storage → similarity ranking → minimal API + search UI.

The requirements brief names that cabin/water/rental phrase as the problem, plus family-near-schools, downtown-condo-on-foot, and a warehouse near-miss control. Success is a ranked list (best meaning first), at least one hit when the listing does not reuse the query’s words, and the warehouse query not promoting lifestyle homes.

## 2. Stakeholder goals ↔ deliverables
| Stakeholder goal | What we delivered | Where to look |
| --- | --- | --- |
| Search by meaning, not only exact words | App-side `generatePropertyEmbedding` + `searchPropertiesByText` | `src/lib/embeddings/`, `src/lib/property-search.ts` |
| Store vectors next to property data | pgvector on a tutorial `properties` table (`vector(1536)`) | `supabase/migrations/20250315000000_enable_pgvector_properties.sql` |
| Rankable matches for demo queries | `match_properties` SQL + TS helper (cosine `<=>`, default top-K 5) | `supabase/migrations/20250315000001_match_properties_function.sql` |
| Something stakeholders can try | POST API + `/search` form (title, snippet, server similarity) | `src/routes/api/properties/search.ts`, `src/routes/search.tsx` |
| Proof it works on sample listings | 8-listing JSON + seed script + verification report | `data/sample-properties.json`, `scripts/seed-property-embeddings.ts`, `docs/semantic-search-verification.md` |

Several of those paths landed on sprint PRs (#61–#64) rather than `main` at handoff time. Cite the files; merge those PRs before treating the demo as one branch.

## 3. Architectural decisions (record what you actually chose)
Filled from the four source docs plus the code they describe. Where the data-model/plan and the tutorial migrations disagree, this handoff records **both** and states what the running slice uses.

- **What text is embedded:** Data model canonical recipe is `{title}`, a blank line, then `{description}`; ids, price, status, timestamps, and address parts are not meaning-text. The data model’s picked rule is **do not embed title alone** if description is missing. The implemented helper `buildEmbeddingText` joins trimmed `title`, `description`, and optional `locationSummary` with blank lines; seed passes `location` as `locationSummary`; buyer queries are embedded as title-only (`description: ''`). That title-only query path is a tutorial convenience, not the data-model skip-missing-description rule.
- **Embedding dimensions:** Data model and pgvector **plan** still spell the size **DIMENSION_TODO** (no model locked there). The tutorial schema and TypeScript constant are **1536** (`vector(1536)` on `public.properties.embedding`, `EMBEDDING_DIMENSIONS = 1536`). Request model fallback is `text-embedding-3-small`. Do not mix 1536 stored rows with another size at query time.
- **Distance / similarity metric:** Plan beginner-demo choice is **cosine distance** operator `<=>`. Smaller distance = closer; SQL **orders ascending** by `p.embedding <=> query_embedding`. The RPC also returns `similarity = 1 - distance` so a stakeholder can read **higher = better**. That conversion is display; sort is still distance.
- **Top-K / match count:** `match_properties(..., match_count int default 5)` and `searchPropertiesByText(query, matchCount = 5)`.
- **Where embeddings are created:** **App-side TypeScript**, not a database trigger. `generatePropertyEmbedding` reads `process.env.EMBEDDING_API_KEY` (never `VITE_`), POSTs to OpenAI `https://api.openai.com/v1/embeddings`, then the seed/search helpers store or query the `number[]`.
- **Seed / backfill path:** `scripts/seed-property-embeddings.ts` loads `data/sample-properties.json` (8 full-sentence listings), calls `generatePropertyEmbedding`, upserts `id`, `title`, `description`, `location`, `price_usd`, `embedding` into `public.properties`. Needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY`. Verification: seed was **not** run in the agent environment (`Missing SUPABASE_URL`).

**Table split (do not paper over):** `docs/embedding-data-model.md` and `docs/pgvector-setup-plan.md` say add `embedding` on existing **`public.property_listings`** and do not create a second listings table. The tutorial grading path added **`public.properties`** (`20250315000000_...`) and later also added `embedding` on `property_listings` (`20250322000000_...`). Search RPC/UI use **`properties`**. Sponsor dashboard CRUD still uses **`property_listings`**. Next owner must not assume one table.

**Index:** Plan said skip IVFFlat at tens of rows. The first `properties` migration created `properties_embedding_ivfflat_idx` (`lists = 100`). Verification dry-run showed it hiding neighbors; `20250315000002_drop_properties_ivfflat_for_sample_scale.sql` drops it so sample scale sequential-scans.

## 4. In scope vs out of scope (this tutorial)
**In scope (code for the demo slice)**
- Sample listing **copy** (8 rows in JSON) and a seed script that *would* write embeddings
- One similarity path: `match_properties` + `searchPropertiesByText` (no client re-rank)
- Minimal API (`POST /api/properties/search`) + React page (`/search`)
- Verification notes for the brief’s queries, empty-input safety, and the IVFFlat refine

**Not yet true in the environment we tested (do not demo as green)**
- Hosted `public.properties` was never seeded; live API returned 500 for every non-empty query (`docs/semantic-search-verification.md`)
- Keyword-trap listing is written so a word-matcher would miss “Cedar hideaway among the pines”; semantic beat-keyword was **not** observed end-to-end

**Out of scope (explicit non-goals for this handoff)**
- Production auth, rate limits, or multi-tenant isolation hardening (buyer-read RLS on listings is still an open question in the data model)
- Hybrid keyword + vector ranking
- Filters (price, beds, location, property type) combined with vectors
- Automatic re-embed on every property update in production
- Large evaluation sets / offline quality metrics dashboards
- CI pipeline that regenerates embeddings on every PR

## 5. Demo limitations (be honest)
- Results quality depends on **small sample data** (8 JSON listings); odd rankings may reflect thin coverage, not a broken metric.
- Embedding **provider/model and API keys** must be configured; without `EMBEDDING_API_KEY` and Supabase service-role env, generate/search paths fail (verified: HTTP 500 `Search failed`).
- No claim of production latency, cost controls, or full PREIshare catalog coverage.
- Ranking explainability is basic (similarity score + listing text)—not a full “why this matched” UI.
- **Not ready to demo to a stakeholder** until migrations (including the IVFFlat drop) are applied, seed succeeds, and the four brief queries return real top-3 titles (`docs/semantic-search-verification.md` sign-off).
- Search helper uses the **service-role** client; that is a tutorial shortcut, not a buyer RLS design.
- Warehouse sample copy includes the distractor words “water” and “downtown”; after a real seed, confirm they do not steal cabin/family rankings.

## 6. How to re-run the demo (handoff checklist)
1. Merge or check out the sprint PRs that contain the files above if they are not on `main` yet.
2. Apply migrations in filename order: pgvector + `properties`, `match_properties`, IVFFlat drop (`20250315000002_...`), and the later `property_listings` files already on `main`.
3. Configure env var **names** only in a local untracked `.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `EMBEDDING_API_KEY` (optional `EMBEDDING_MODEL`). Never `VITE_` for those secrets.
4. Run `npx tsx scripts/seed-property-embeddings.ts` from the repo root so sample rows have non-null `embedding`.
5. Confirm in SQL: row count 8 (or the JSON length) and `embedding is null` count 0.
6. `npm run dev`; open `/search`; try the four queries from `docs/semantic-search-requirements.md` (cabin, family, downtown condo, warehouse near-miss).
7. Compare observed ranking to `docs/semantic-search-verification.md` and fill in real top-3 titles when they exist.

## 7. Next actions for later Sprint 5 work
Make these concrete enough that another learner could pick one up:

1. **Filters + vector search** — Add structured filters (e.g. max `price_usd`) in `match_properties` / the API `where` clause without dropping `ORDER BY embedding <=> query_embedding`.
2. **Hybrid search** — Combine keyword (or full-text) signals with vector similarity; document how scores are merged (do not silently sort twice in the React page).
3. **Re-embed on update** — When title/description changes, call `generatePropertyEmbedding` and write `embedding`; keep null embeddings out of `match_properties` (already `where p.embedding is not null`).
4. **Grow the evaluation set** — Expand `data/sample-properties.json` and a fixed query list with expected “good” matches; re-run the verification table.
5. **CI considerations** — Lint/typecheck helpers and migration SQL in CI; **do not** call the live embedding API on every PR (cost/secrets).
6. **Observability** — Log latency and top similarity scores; treat raw query text as sensitive.
7. **Reconcile tables** — Decide whether buyer search stays on `public.properties` or moves onto `public.property_listings` as the data model required; do not keep two embed columns forever without a written choice.
8. **Finish verification** — After seed, prove the keyword trap (hideaway listing vs “quiet cabin near water…”) and the warehouse near-miss in the UI.

## 8. Open questions for mentor / next owner
- Confirm final production embedding model and dimension lock-in (replace remaining **DIMENSION_TODO** in the data model/plan in **one pass** with 1536, or change 1536 everywhere if the model is not `text-embedding-3-small`).
- Confirm distance metric standard for PREIshare (stay on cosine `<=>` app-wide, or document a switch).
- Decide ownership of embedding cost budgets and key rotation (`EMBEDDING_API_KEY` is server-only).
- Prioritize filter set for the next stakeholder demo.
- Answer the data-model RLS question: `property_listings` is owner-scoped; buyer search over other people’s rows needs an explicit read policy—do not `USING (true)` to make search “just work.”
- Which listing statuses are searchable (draft vs published) if/when search sits on `property_listings`.

## 9. Sources used for this handoff
- `docs/semantic-search-requirements.md` (PR #55 at time of writing; problem, four queries, success checks, non-goals)
- `docs/embedding-data-model.md` (PR #58; `property_listings`, embed recipe, DIMENSION_TODO, null-description rule, RLS open question)
- `docs/pgvector-setup-plan.md` (cosine `<=>`, ascending distance, skip index at sample scale, no secrets in git)
- `docs/semantic-search-verification.md` (November 5, 2026 America/New_York: empty query PASS; live ranking FAIL/500; IVFFlat refine kept; not ready to demo)
