-- Vérifier les produits existants dans sb_products
SELECT id, name, slug, category, product_type 
FROM sb_products 
ORDER BY name;

-- Vérifier si les nouvelles colonnes existent
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'sb_products' 
  AND column_name IN ('hero_title', 'hero_subtitle', 'tags', 'guarantees', 'options_cards')
ORDER BY column_name;
