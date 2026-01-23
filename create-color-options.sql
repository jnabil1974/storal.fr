-- Create color option groups
INSERT INTO product_option_groups (name, slug, description, is_required, display_order)
VALUES ('Couleur armature', 'frame-color', 'Couleurs RAL de la structure', TRUE, 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_option_groups (name, slug, description, is_required, display_order)
VALUES ('Couleur de toile', 'fabric-color', 'Couleur de la toile (nuancier fabricant)', FALSE, 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert common RAL colors for frame
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Blanc (RAL 9010)', 'ral-9010', 0, 1 FROM product_option_groups WHERE slug = 'frame-color'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Anthracite (RAL 7016)', 'ral-7016', 0, 2 FROM product_option_groups WHERE slug = 'frame-color'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Noir (RAL 9005)', 'ral-9005', 50, 3 FROM product_option_groups WHERE slug = 'frame-color'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Gris (RAL 7035)', 'ral-7035', 0, 4 FROM product_option_groups WHERE slug = 'frame-color'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Personnalisé RAL', 'ral-custom', 120, 5 FROM product_option_groups WHERE slug = 'frame-color'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Beige (RAL 1015)', 'ral-1015', 0, 6 FROM product_option_groups WHERE slug = 'frame-color'
ON CONFLICT (group_id, slug) DO NOTHING;

-- Insert fabric color placeholder (no price change, choose via nuancier)
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Choix via nuancier (sans surcoût)', 'fabric-color-select', 0, 1 FROM product_option_groups WHERE slug = 'fabric-color'
ON CONFLICT (group_id, slug) DO NOTHING;

-- Map frame colors to all store-banne subcategories
WITH subcats AS (
  SELECT s.id AS subcategory_id
  FROM product_subcategories s
  JOIN product_categories c ON c.id = s.category_id
  WHERE c.slug = 'store-banne'
),
frame_colors AS (
  SELECT o.id AS option_id, o.price_adjustment
  FROM product_options o
  JOIN product_option_groups g ON g.id = o.group_id
  WHERE g.slug = 'frame-color'
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
  f.option_id,
  f.price_adjustment,
  'fixed' AS pricing_mode,
  0 AS price_per_sqm,
  TRUE AS is_available
FROM subcats s
CROSS JOIN frame_colors f
ON CONFLICT (subcategory_id, option_id) DO UPDATE SET
  price_adjustment = EXCLUDED.price_adjustment;
