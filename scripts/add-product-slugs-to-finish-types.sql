-- Migration: Ajouter la colonne product_slugs à la table matest_finish_types

-- Ajouter la colonne si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'matest_finish_types' 
    AND column_name = 'product_slugs'
  ) THEN
    ALTER TABLE public.matest_finish_types 
    ADD COLUMN product_slugs TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- Mettre à jour les types existants pour initialiser product_slugs si NULL
UPDATE public.matest_finish_types
SET product_slugs = '{}'
WHERE product_slugs IS NULL;
