-- Ajouter une colonne display_order à sb_products pour l'ordre d'affichage
-- Date: 2026-02-03

-- Ajouter la colonne display_order
ALTER TABLE sb_products 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Initialiser l'ordre pour les produits existants (par ordre alphabétique)
WITH ordered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
  FROM sb_products
)
UPDATE sb_products
SET display_order = ordered_products.row_num
FROM ordered_products
WHERE sb_products.id = ordered_products.id;

-- Créer un index pour améliorer les performances de tri
CREATE INDEX IF NOT EXISTS idx_sb_products_display_order ON sb_products(display_order);

-- Commentaire sur la colonne
COMMENT ON COLUMN sb_products.display_order IS 'Ordre d''affichage des stores bannes (ordre croissant)';
