-- Create table to map options to subcategories with specific pricing
CREATE TABLE IF NOT EXISTS subcategory_option_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id UUID NOT NULL REFERENCES product_subcategories(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
  price_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
  pricing_mode VARCHAR(20) NOT NULL DEFAULT 'fixed', -- 'fixed' or 'per_sqm'
  price_per_sqm DECIMAL(10,2) DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subcategory_id, option_id)
);

-- Ensure new columns exist when table already created
ALTER TABLE subcategory_option_pricing ADD COLUMN IF NOT EXISTS pricing_mode VARCHAR(20) NOT NULL DEFAULT 'fixed';
ALTER TABLE subcategory_option_pricing ADD COLUMN IF NOT EXISTS price_per_sqm DECIMAL(10,2) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_subcategory_option_pricing_subcategory ON subcategory_option_pricing(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_subcategory_option_pricing_option ON subcategory_option_pricing(option_id);

-- Get the Stores Bannes subcategories
SELECT id, slug FROM product_subcategories 
WHERE category_id = (SELECT id FROM product_categories WHERE slug = 'store-banne')
ORDER BY order_index;
