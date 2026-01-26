-- Script pour insérer les catégories de base dans product_categories
-- À exécuter dans Supabase SQL Editor

-- Vérifier d'abord si les catégories existent déjà
SELECT id, slug, name, display_name FROM product_categories ORDER BY order_index;

-- Si la table est vide, insérer les catégories de base
INSERT INTO product_categories (slug, name, display_name, description, gradient_from, gradient_to, order_index)
VALUES
  (
    'store-banne',
    'store-banne',
    'Stores Bannes',
    'Protégez-vous du soleil avec nos stores bannes sur mesure, disponibles en différents modèles et coloris.',
    'blue-100',
    'blue-200',
    1
  ),
  (
    'store-antichaleur',
    'store-antichaleur',
    'Stores Anti-chaleur',
    'Réduisez la chaleur et les UV avec nos stores anti-chaleur haute performance.',
    'red-100',
    'red-200',
    2
  ),
  (
    'porte-blindee',
    'porte-blindee',
    'Portes Blindées',
    'Sécurisez votre domicile avec nos portes blindées certifiées et sur mesure.',
    'gray-100',
    'gray-200',
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  gradient_from = EXCLUDED.gradient_from,
  gradient_to = EXCLUDED.gradient_to,
  order_index = EXCLUDED.order_index,
  updated_at = NOW();

-- Vérifier que les catégories ont été insérées
SELECT id, slug, name, display_name, order_index FROM product_categories ORDER BY order_index;
