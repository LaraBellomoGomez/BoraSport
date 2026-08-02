create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  items jsonb not null,
  total numeric not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);
