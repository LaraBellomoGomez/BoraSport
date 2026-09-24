-- Shipping address captured at checkout, and tracking info added later when
-- the order is dispatched (see /pedidos admin page + set-tracking function).
alter table public.orders
  add column if not exists shipping_name text,
  add column if not exists shipping_phone text,
  add column if not exists shipping_address text,
  add column if not exists shipping_city text,
  add column if not exists shipping_province text,
  add column if not exists shipping_postal_code text,
  add column if not exists tracking_number text,
  add column if not exists shipped_at timestamptz;
