create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  mp_preference_id text,
  mp_payment_id text,
  -- Shipping address, captured at checkout.
  shipping_name text,
  shipping_phone text,
  shipping_address text,
  shipping_city text,
  shipping_province text,
  shipping_postal_code text,
  -- Set later from /pedidos when the order is dispatched / delivered.
  tracking_number text,
  shipped_at timestamptz,
  delivered_at timestamptz,
  -- Timestamped events: [{status, label, at}, ...] — shown in /pedidos.
  status_history jsonb not null default '[]'::jsonb,
  -- Unguessable token for the public /seguimiento?pedido=<token> page.
  access_token text unique default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);
