-- Ajouter le produit store-banne-heliom
INSERT INTO sb_products (name, slug, description, sales_coefficient)
VALUES ('Store Banne Héliom', 'store-banne-heliom', 'Store banne Héliom haute qualité avec motorisation optionnelle', 1.5)
ON CONFLICT (slug) DO NOTHING;

-- Récupérer l'ID du produit (normalement 2 ou plus)
SELECT id, name, slug FROM sb_products WHERE slug = 'store-banne-heliom';

-- Ajouter des motorisations pour ce produit
INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'motorisation', 'Manuel (chaîne)', 0, true, 1 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'motorisation', 'Motorisation standard', 350, false, 2 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'motorisation', 'Motorisation + Télécommande', 500, false, 3 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

-- Ajouter des émetteurs pour ce produit
INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'emetteur', 'Télécommande Situo 1 RTS Pure', 35.00, false, 1 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'emetteur', 'Télécommande Situo 5 RTS Pure', 55.00, false, 2 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'emetteur', 'Télécommande Smoove Origin RTS', 45.00, false, 3 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

-- Ajouter des toiles pour ce produit
INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'toile', 'Toile Acrylique Standard', 12.50, true, 1 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'toile', 'Toile Acrylique Premium', 18.50, false, 2 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

INSERT INTO sb_product_options (product_id, option_type, option_name, price_ht, is_default, order_index)
SELECT id, 'toile', 'Toile Microfibre', 25.00, false, 3 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT DO NOTHING;

-- Ajouter des prix d'achat (dimensions/tarif)
INSERT INTO sb_product_purchase_prices (product_id, width_max, projection, price_ht)
SELECT id, 2000, 1200, 450 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT (product_id, width_max, projection) DO NOTHING;

INSERT INTO sb_product_purchase_prices (product_id, width_max, projection, price_ht)
SELECT id, 3000, 1200, 550 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT (product_id, width_max, projection) DO NOTHING;

INSERT INTO sb_product_purchase_prices (product_id, width_max, projection, price_ht)
SELECT id, 4000, 1500, 750 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT (product_id, width_max, projection) DO NOTHING;

INSERT INTO sb_product_purchase_prices (product_id, width_max, projection, price_ht)
SELECT id, 5000, 1500, 950 FROM sb_products WHERE slug = 'store-banne-heliom'
ON CONFLICT (product_id, width_max, projection) DO NOTHING;

-- Vérifier les données ajoutées
SELECT 'Options motorisation' as type, COUNT(*) FROM sb_product_options 
WHERE product_id = (SELECT id FROM sb_products WHERE slug = 'store-banne-heliom') AND option_type = 'motorisation';

SELECT 'Options émetteurs' as type, COUNT(*) FROM sb_product_options 
WHERE product_id = (SELECT id FROM sb_products WHERE slug = 'store-banne-heliom') AND option_type = 'emetteur';

SELECT 'Options toiles' as type, COUNT(*) FROM sb_product_options 
WHERE product_id = (SELECT id FROM sb_products WHERE slug = 'store-banne-heliom') AND option_type = 'toile';

SELECT 'Prix d''achat' as type, COUNT(*) FROM sb_product_purchase_prices
WHERE product_id = (SELECT id FROM sb_products WHERE slug = 'store-banne-heliom');
