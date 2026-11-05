-- Rank public.properties by closeness of stored embeddings to a query vector.
-- Names, types, and vector(1536) match 20250315000000_enable_pgvector_properties.sql.
--
-- Metric: cosine distance (`<=>`). Smaller distance = closer match.
-- We still ORDER BY that distance (ascending) so the best rows come first.
-- The returned `similarity` column is 1 - distance so a stakeholder can read
-- HIGHER = better match.

create or replace function public.match_properties(
  query_embedding vector(1536),
  match_count int default 5
)
returns table (
  id uuid,
  title text,
  description text,
  location text,
  similarity float
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    p.id,
    p.title,
    p.description,
    p.location,
    -- cosine distance operator <=> ; convert to similarity so HIGHER = better match
    (1 - (p.embedding <=> query_embedding))::float as similarity
  from public.properties p
  where p.embedding is not null
  order by p.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

-- SECURITY INVOKER runs as the caller, so they also need to read properties.
grant select on table public.properties to authenticated;
grant select on table public.properties to service_role;

grant execute on function public.match_properties(vector(1536), int) to authenticated;
grant execute on function public.match_properties(vector(1536), int) to service_role;
