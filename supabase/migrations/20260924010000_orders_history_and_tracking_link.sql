-- Timestamped event history (pago recibido, despachado, entregado) and a
-- private, unguessable token so a customer can check their order status on
-- a public page (/seguimiento) without logging in or exposing sequential
-- order ids.
alter table public.orders
  add column if not exists status_history jsonb not null default '[]'::jsonb,
  add column if not exists delivered_at timestamptz,
  add column if not exists access_token text;

update public.orders
  set access_token = replace(gen_random_uuid()::text, '-', '')
  where access_token is null;

alter table public.orders
  alter column access_token set default replace(gen_random_uuid()::text, '-', '');

create unique index if not exists orders_access_token_idx on public.orders (access_token);
