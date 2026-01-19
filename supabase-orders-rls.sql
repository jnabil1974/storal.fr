-- Ensure user_id column exists
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Simple policy: allow all SELECT (queries restricted server-side by filters)
DROP POLICY IF EXISTS "Enable read for all" ON public.orders;
CREATE POLICY "Enable read for all"
  ON public.orders
  FOR SELECT
  USING (true);

-- Allow INSERT for everyone (validation done server-side via reCAPTCHA)
DROP POLICY IF EXISTS "Enable insert for all" ON public.orders;
CREATE POLICY "Enable insert for all"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);
