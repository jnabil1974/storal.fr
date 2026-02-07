-- Vérifier l'ordre d'affichage des stores bannes
-- Ce script permet de visualiser l'ordre actuel

-- 1. Vérifier si la colonne existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'sb_products' 
  AND column_name = 'display_order';

-- 2. Afficher tous les produits avec leur ordre
SELECT 
  id,
  name,
  slug,
  display_order,
  active,
  created_at
FROM sb_products
ORDER BY display_order ASC NULLS LAST, name ASC;

-- 3. Compter les produits par statut d'ordre
SELECT 
  CASE 
    WHEN display_order IS NULL THEN 'Sans ordre (NULL)'
    WHEN display_order = 0 THEN 'Ordre zéro'
    ELSE 'Ordre défini'
  END as status,
  COUNT(*) as count
FROM sb_products
GROUP BY 
  CASE 
    WHEN display_order IS NULL THEN 'Sans ordre (NULL)'
    WHEN display_order = 0 THEN 'Ordre zéro'
    ELSE 'Ordre défini'
  END;

-- 4. Trouver les doublons d'ordre (si applicable)
SELECT display_order, COUNT(*) as count, STRING_AGG(name, ', ') as products
FROM sb_products
WHERE display_order IS NOT NULL
GROUP BY display_order
HAVING COUNT(*) > 1
ORDER BY display_order;
