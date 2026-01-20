-- Migration: Create pricing_rules table for dynamic pricing management
-- This table allows overriding default coefficients with promos/special rules

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  coefficient DECIMAL(5, 2) NOT NULL,
  reason TEXT, -- e.g., "PROMO_JANUARY", "BULK_DISCOUNT", "CUSTOM"
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT coefficient_positive CHECK (coefficient > 0),
  CONSTRAINT valid_date_range CHECK (valid_until IS NULL OR valid_until > valid_from)
);

-- Index for efficient querying
CREATE INDEX idx_pricing_rules_product_id ON public.pricing_rules(product_id);
CREATE INDEX idx_pricing_rules_active ON public.pricing_rules(is_active, valid_from, valid_until);

-- Enable RLS
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can read active pricing rules
CREATE POLICY "Allow read pricing rules" ON public.pricing_rules
  FOR SELECT
  USING (is_active = true AND valid_from <= NOW() AND (valid_until IS NULL OR valid_until > NOW()));

-- RLS Policy: Only admins can write pricing rules
CREATE POLICY "Allow admin write pricing rules" ON public.pricing_rules
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert default pricing rule for KISSIMY (example)
-- Uncomment and modify as needed:
-- INSERT INTO public.pricing_rules (product_id, coefficient, reason, valid_from, is_active)
-- SELECT id, 2.0, 'DEFAULT_KISSIMY', NOW(), true
-- FROM public.products
-- WHERE name = 'Store Banne Coffre KISSIMY'
-- AND is_active = true
-- LIMIT 1;
