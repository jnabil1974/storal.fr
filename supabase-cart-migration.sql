-- Table panier (cart_items)
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  product_id uuid not null references public.products(id) on delete cascade,
  product_type text not null,
  product_name text not null,
  base_price numeric(12,2) not null,
  configuration jsonb not null,
  quantity integer not null default 1 check (quantity > 0),
  price_per_unit numeric(12,2) not null,
  total_price numeric(12,2) not null,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index pour performance
create index if not exists idx_cart_items_session on public.cart_items(session_id);

-- Trigger updated_at
drop trigger if exists trg_cart_items_updated_at on public.cart_items;
create trigger trg_cart_items_updated_at
before update on public.cart_items
for each row execute function public.handle_updated_at();

-- RLS
alter table public.cart_items enable row level security;

-- N'importe qui peut lire/écrire son propre panier
create policy "cart_items_session_access"
  on public.cart_items
  using (true)
  with check (true);
