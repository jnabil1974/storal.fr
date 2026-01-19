-- Add user_id to orders and index
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_id uuid NULL;

-- Optional: add a foreign key constraint to auth.users (requires privileges)
-- ALTER TABLE public.orders
--   ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id)
--   REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
