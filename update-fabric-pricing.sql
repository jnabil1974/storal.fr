-- Clean existing fabric pricing mappings for store-banne subcategories
WITH fabric_options AS (
  SELECT o.id
  FROM product_options o
  JOIN product_option_groups g ON g.id = o.group_id
  WHERE g.slug = 'fabric'
),
store_banne_subcats AS (
  SELECT s.id
  FROM product_subcategories s
  JOIN product_categories c ON c.id = s.category_id
  WHERE c.slug = 'store-banne'
)
DELETE FROM subcategory_option_pricing sop
USING fabric_options f, store_banne_subcats sb
WHERE sop.option_id = f.id AND sop.subcategory_id = sb.id;

-- Re-insert fabric pricing per store-banne subcategory
WITH subcats AS (
  SELECT s.id AS subcategory_id, s.slug AS subcategory_slug
  FROM product_subcategories s
  JOIN product_categories c ON c.id = s.category_id
  WHERE c.slug = 'store-banne'
),
fabrics AS (
  SELECT o.id AS option_id, o.slug
  FROM product_options o
  JOIN product_option_groups g ON g.id = o.group_id
  WHERE g.slug = 'fabric'
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
  0 AS price_adjustment,
  CASE
    WHEN f.slug IN ('orchestra-dickson-290', 'satler-290', 'orchestra-max-320', 'latim-290') THEN 'per_sqm'
    ELSE 'fixed'
  END AS pricing_mode,
  CASE
    WHEN f.slug = 'orchestra-dickson-290' THEN 0
    WHEN f.slug = 'satler-290' THEN 0
    WHEN f.slug = 'latim-290' THEN 8
    WHEN f.slug = 'orchestra-max-320' AND s.subcategory_slug IN ('semi-coffre', 'monoblocs') THEN 27
    ELSE 0
  END AS price_per_sqm,
  CASE
    WHEN f.slug = 'orchestra-max-320' AND s.subcategory_slug NOT IN ('semi-coffre', 'monoblocs') THEN FALSE
    ELSE TRUE
  END AS is_available
FROM subcats s
CROSS JOIN fabrics f;
