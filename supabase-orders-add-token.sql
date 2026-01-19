-- Add verification_token to orders (for guest order lookup)
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS verification_token uuid DEFAULT gen_random_uuid();
CREATE INDEX IF NOT EXISTS idx_orders_verification_token ON public.orders(verification_token);
