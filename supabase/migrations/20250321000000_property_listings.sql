-- First property_listings table for signed-in sponsors.
-- Columns and RLS follow docs/data-model/property-listings-schema.md.
-- Status values match src/types/listing-status.ts.

create extension if not exists "pgcrypto";

create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  address_line1 text,
  address_line2 text,
  address_city text,
  address_region text,
  address_postal_code text,
  address_country text,
  price numeric,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint property_listings_status_check
    check (
      status in (
        'draft',
        'published',
        'under_offer',
        'sold',
        'archived'
      )
    )
);

create index if not exists property_listings_owner_id_idx
  on public.property_listings (owner_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_property_listings_updated_at
  on public.property_listings;

create trigger set_property_listings_updated_at
  before update on public.property_listings
  for each row
  execute function public.set_updated_at();

alter table public.property_listings enable row level security;

create policy listings_select_own
  on public.property_listings
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy listings_insert_own
  on public.property_listings
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy listings_update_own
  on public.property_listings
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy listings_delete_own
  on public.property_listings
  for delete
  to authenticated
  using (owner_id = auth.uid());
