-- Delete old fabric options
DELETE FROM product_options 
WHERE group_id = (SELECT id FROM product_option_groups WHERE slug = 'fabric');

-- Insert new fabric options
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toiles acrylique Orchestra Dickson (290g)', 'orchestra-dickson-290', 0, 1 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toiles acrylique Satler (290g)', 'satler-290', 0, 2 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toile LATIM (290g)', 'latim-290', 0, 3 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toile Orchestra MAX (320g)', 'orchestra-max-320', 0, 4 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;
