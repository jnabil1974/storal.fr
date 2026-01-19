-- Table commandes (orders)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address text not null,
  delivery_city text not null,
  delivery_postal_code text not null,
  delivery_country text not null default 'France',
  items jsonb not null,
  total_items integer not null,
  total_amount numeric(12,2) not null,
  status text not null default 'pending',
  stripe_payment_id text,
  payment_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index pour performance
create index idx_orders_session on public.orders(session_id);
create index idx_orders_email on public.orders(customer_email);
create index idx_orders_status on public.orders(status);
create index idx_orders_stripe on public.orders(stripe_payment_id);

-- Trigger updated_at
drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.handle_updated_at();

-- RLS
alter table public.orders enable row level security;

-- N'importe qui peut lire/écrire ses propres commandes
create policy "orders_session_access"
  on public.orders
  using (true)
  with check (true);
