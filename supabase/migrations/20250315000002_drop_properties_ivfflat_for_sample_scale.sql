-- Sample-scale ranking: drop the IVFFlat index created in
-- 20250315000000_enable_pgvector_properties.sql.
--
-- Dry-run with ~2–8 rows showed IVFFlat (lists = 100) hiding valid
-- neighbors (pgvector "low recall" / little data). Sequential scan is
-- the right plan at tutorial size. Re-add an index only after the table
-- is large enough that lists can be chosen from real row counts.

DROP INDEX IF EXISTS public.properties_embedding_ivfflat_idx;
