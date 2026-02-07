-- Delete old motorization options
DELETE FROM product_options 
WHERE group_id = (SELECT id FROM product_option_groups WHERE slug = 'motorization');

-- Insert new motorization packages
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Manuel (chaîne)', 'manual-chain', 0, 1 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur SUNEA iO + Situo 1 iO', 'sunea-situo1', 0, 2 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur SUNEA iO + Smoove Origin iO', 'sunea-smoove-origin', 0, 3 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur SUNEA iO + Situo 5 iO', 'sunea-situo5', 14, 4 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur SUNEA iO + Situo 5 iO Variation', 'sunea-situo5-variation', 25, 5 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Sans télécommande (Moteur seul)', 'sunea-no-remote', -15, 6 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur CSI + Manivelle (pas télécommande)', 'csi-manual-no-remote', 93, 7 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur CSI + Manivelle + Situo 1 iO', 'csi-manual-situo1', 122, 8 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur CSI + Manivelle + Situo 5 iO', 'csi-manual-situo5', 132, 9 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Moteur CSI + Manivelle + Situo 5 Variation', 'csi-manual-situo5-variation', 132, 10 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Treuil latéral + Manivelle (remplace moteur)', 'lateral-winch-manual', -69, 11 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

-- Map motorization options to all store-banne subcategories with fixed pricing
WITH subcats AS (
  SELECT s.id AS subcategory_id
  FROM product_subcategories s
  JOIN product_categories c ON c.id = s.category_id
  WHERE c.slug = 'store-banne'
),
motor_options AS (
  SELECT o.id AS option_id, o.price_adjustment
  FROM product_options o
  JOIN product_option_groups g ON g.id = o.group_id
  WHERE g.slug = 'motorization'
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
  m.option_id,
  m.price_adjustment,
  'fixed' AS pricing_mode,
  0 AS price_per_sqm,
  TRUE AS is_available
FROM subcats s
CROSS JOIN motor_options m
ON CONFLICT (subcategory_id, option_id) DO UPDATE SET
  price_adjustment = EXCLUDED.price_adjustment;
