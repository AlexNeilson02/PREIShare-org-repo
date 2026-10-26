-- Sponsor identity row plus re-asserted RLS on the existing listings table.
-- Does not create public.properties. Listings stay on public.property_listings.

CREATE TABLE IF NOT EXISTS public.sponsors (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sponsors_select_own"
  ON public.sponsors
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "sponsors_insert_own"
  ON public.sponsors
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "sponsors_update_own"
  ON public.sponsors
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- No DELETE policy on sponsors. The matrix denies sponsor-row delete this sprint.

-- property_listings was created by 20250321000000_property_listings.sql.
-- owner_id is the link to the signed-in sponsor (auth.uid()).
-- The statements below are written to be safe to re-run.

ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS listings_select_own ON public.property_listings;
CREATE POLICY listings_select_own
  ON public.property_listings
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS listings_insert_own ON public.property_listings;
CREATE POLICY listings_insert_own
  ON public.property_listings
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS listings_update_own ON public.property_listings;
CREATE POLICY listings_update_own
  ON public.property_listings
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS listings_delete_own ON public.property_listings;
CREATE POLICY listings_delete_own
  ON public.property_listings
  FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Review checklist (must all be true against docs/data-model-and-rls-matrix.md):
-- [ ] RLS enabled on every sponsor-owned table
-- [ ] No open USING (true) on sponsor or listing data
-- [ ] INSERT/UPDATE policies include WITH CHECK tied to auth.uid()
-- [ ] Column list and FKs match the matrix
