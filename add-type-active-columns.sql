-- Ajouter les colonnes 'type' et 'active' à la table sb_products

ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'Monobloc' CHECK (type IN ('Store Coffre', 'Semi-coffre', 'Monobloc', 'Traditionnel'));
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Créer un index sur la colonne 'active' pour optimiser les requêtes de filtrage
CREATE INDEX IF NOT EXISTS idx_sb_products_active ON sb_products(active);

-- Mettre à jour les produits existants avec un type par défaut basé sur leur catégorie ou product_type
UPDATE sb_products SET type = 'Monobloc' WHERE type IS NULL AND product_type LIKE '%Monobloc%';
UPDATE sb_products SET type = 'Store Coffre' WHERE type IS NULL AND (product_type LIKE '%Coffre%' OR product_type LIKE '%HELiOM%' OR product_type LIKE '%BELHARRA%');
UPDATE sb_products SET type = 'Semi-coffre' WHERE type IS NULL AND (product_type LIKE '%KISSIMY%' OR product_type LIKE '%KITANGUY%');
UPDATE sb_products SET type = 'Monobloc' WHERE type IS NULL;

-- Tous les produits existants sont actifs par défaut (déjà défini via DEFAULT true)
