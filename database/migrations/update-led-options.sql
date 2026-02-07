-- Insert advance-tier prices for LED in arms option
WITH led_arms AS (
  SELECT o.id AS option_id
  FROM product_options o
  JOIN product_option_groups g ON g.id = o.group_id
  WHERE g.slug = 'lighting' AND o.slug = 'led-arms-dimmer-situo5-var'
)
INSERT INTO option_advance_pricing (option_id, advance_mm, price)
SELECT led_arms.option_id, v.advance_mm, v.price
FROM led_arms,
(VALUES
  (1500, 441.00),
  (2000, 481.00),
  (2500, 524.00),
  (2750, 553.00),
  (3000, 567.00),
  (3250, 595.00),
  (3500, 603.00),
  (4000, 641.00)
) AS v(advance_mm, price)
ON CONFLICT (option_id, advance_mm) DO UPDATE SET
  price = EXCLUDED.price;