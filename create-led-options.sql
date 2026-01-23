-- Ensure pricing_mode supports per-advance via free-form varchar (already present)
-- Create table to store prices by advance (depth) for options
CREATE TABLE IF NOT EXISTS option_advance_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
  advance_mm INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(option_id, advance_mm)
);

CREATE INDEX IF NOT EXISTS idx_option_advance_option ON option_advance_pricing(option_id);
CREATE INDEX IF NOT EXISTS idx_option_advance_mm ON option_advance_pricing(advance_mm);

-- Create lighting option group
INSERT INTO product_option_groups (name, slug, description, is_required, display_order)
VALUES ('Éclairage LED', 'lighting', 'Options d''éclairage LED', FALSE, 4)
ON CONFLICT (slug) DO NOTHING;

-- Create LED options
-- 1) LED dans les bras (variateur, télécommande Situo 5 iO Variation) - price depends on advance
INSERT INTO product_options (group_id, name, slug, description, price_adjustment, display_order)
SELECT id, 'LED dans les bras (variateur, télécommande Situo 5 iO Variation)', 'led-arms-dimmer-situo5-var', 'Prix selon avancée (2 bras)', 0, 1
FROM product_option_groups WHERE slug = 'lighting'
ON CONFLICT (group_id, slug) DO NOTHING;

-- 2) LED encastré sous le coffre (variateur) - fixed price +362
INSERT INTO product_options (group_id, name, slug, description, price_adjustment, display_order)
SELECT id, 'LED encastré sous le coffre (variateur)', 'led-coffre-embedded-dimmer', 'Disponible selon modèle', 362, 2
FROM product_option_groups WHERE slug = 'lighting'
ON CONFLICT (group_id, slug) DO NOTHING;

-- Map LED options to store-banne subcategories
WITH subcats AS (
  SELECT s.id AS subcategory_id, s.slug AS subcategory_slug
  FROM product_subcategories s
  JOIN product_categories c ON c.id = s.category_id
  WHERE c.slug = 'store-banne'
),
opts AS (
  SELECT o.id AS option_id, o.slug
  FROM product_options o
  JOIN product_option_groups g ON g.id = o.group_id
  WHERE g.slug = 'lighting'
)
INSERT INTO subcategory_option_pricing (
  subcategory_id,
  option_id,
  price_adjustment,
  pricing_mode,
  price_per_sqm,
  is_available
)
SELECT
  s.subcategory_id,
  o.option_id,
  CASE WHEN o.slug = 'led-coffre-embedded-dimmer' THEN 362 ELSE 0 END,
  CASE WHEN o.slug = 'led-arms-dimmer-situo5-var' THEN 'per_advance' ELSE 'fixed' END,
  0,
  CASE WHEN o.slug = 'led-coffre-embedded-dimmer' AND s.subcategory_slug = 'coffre' THEN TRUE
       WHEN o.slug = 'led-coffre-embedded-dimmer' AND s.subcategory_slug <> 'coffre' THEN FALSE
       ELSE TRUE END
FROM subcats s
CROSS JOIN opts o
ON CONFLICT (subcategory_id, option_id) DO UPDATE SET
  price_adjustment = EXCLUDED.price_adjustment,
  pricing_mode = EXCLUDED.pricing_mode,
  is_available = EXCLUDED.is_available;