-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Table produits avec specs JSON
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  type text not null check (type in ('store_banne','porte_blindee','fenetre_menuiserie','armoire_placard')),
  base_price numeric(12,2) not null,
  image text,
  category text,
  specifications jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index pour performance
create index if not exists idx_products_type on public.products(type);
create index if not exists idx_products_created_at on public.products(created_at);

-- Trigger updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.handle_updated_at();

-- RLS
alter table public.products enable row level security;

-- Lecture publique (produits)
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public"
  on public.products for select
  using (true);

-- Écriture réservée aux clés service_role
drop policy if exists "products_write_service" on public.products;
create policy "products_write_service"
  on public.products for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Insertion des produits de démo
insert into public.products (id, name, description, type, base_price, image, category, specifications)
values
  (
    'store-1'::uuid,
    'Store Banne Standard',
    'Store banne classique avec motorisation électrique',
    'store_banne',
    350.00,
    '/images/store-banne-1.jpg',
    'Extérieur',
    '{
      "minWidth": 100,
      "maxWidth": 600,
      "minDepth": 50,
      "maxDepth": 250,
      "availableFabrics": ["acrylique", "polyester", "micro-perforé"],
      "availableFrameColors": ["blanc", "gris", "noir", "bronze"],
      "motorOptions": ["manuel", "electrique", "smarty"]
    }'::jsonb
  ),
  (
    'porte-1'::uuid,
    'Porte Blindée Standard A2P',
    'Porte blindée entrée avec certification A2P 2 étoiles',
    'porte_blindee',
    890.00,
    '/images/porte-blindee-1.jpg',
    'Entrée',
    '{
      "minWidth": 70,
      "maxWidth": 100,
      "minHeight": 200,
      "maxHeight": 240,
      "availableMaterials": ["acier", "aluminium", "composite"],
      "availableTypes": ["battante", "coulissante"],
      "securityLevels": ["A2P_1", "A2P_2", "A2P_3"],
      "availableColors": ["blanc", "gris", "noir", "bois"]
    }'::jsonb
  )
on conflict (id) do nothing;
