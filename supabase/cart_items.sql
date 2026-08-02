create table if not exists public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  product_slug text not null,
  product_type text not null check (product_type in ('apparel', 'accessory')),
  size text,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (user_id, product_slug, size)
);

alter table public.cart_items enable row level security;

create policy "Users can view their own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);
