-- Configurer les politiques RLS pour permettre les mises à jour de display_order
-- Date: 2026-02-03

-- 1. Vérifier si RLS est activé sur sb_products
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'sb_products';

-- 2. Désactiver temporairement RLS sur sb_products (si nécessaire pour les admins)
-- Option A: Désactiver complètement RLS (NON RECOMMANDÉ en production)
-- ALTER TABLE sb_products DISABLE ROW LEVEL SECURITY;

-- Option B: Créer des politiques permissives pour les utilisateurs authentifiés
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Allow authenticated users to update sb_products" ON sb_products;
DROP POLICY IF EXISTS "Allow public read access to sb_products" ON sb_products;
DROP POLICY IF EXISTS "Allow authenticated users to insert sb_products" ON sb_products;
DROP POLICY IF EXISTS "Allow authenticated users to delete sb_products" ON sb_products;

-- Créer des politiques permissives pour tous les utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to select sb_products"
ON sb_products FOR SELECT
USING (true);

CREATE POLICY "Allow authenticated users to update sb_products"
ON sb_products FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert sb_products"
ON sb_products FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete sb_products"
ON sb_products FOR DELETE
USING (true);

-- 3. Activer RLS (au cas où il serait désactivé)
ALTER TABLE sb_products ENABLE ROW LEVEL SECURITY;

-- 4. Vérifier les politiques créées
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'sb_products'
ORDER BY policyname;
