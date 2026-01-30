-- Vérifier les produits
SELECT 'Products' as section, COUNT(*) as count FROM sb_products;
SELECT 'Product Options' as section, COUNT(*) as count FROM product_options;

-- Vérifier les options par product_id
SELECT 'Options par product_id' as info, product_id, category, COUNT(*) as count 
FROM product_options 
GROUP BY product_id, category 
ORDER BY product_id, category;

-- Lister les produits disponibles
SELECT id, name, slug FROM sb_products LIMIT 10;

-- Lister les options pour le product_id 1 (défaut)
SELECT id, name, category, purchase_price_ht, sales_coefficient 
FROM product_options 
WHERE product_id = 1 
LIMIT 20;
