-- Modifier la contrainte unique pour permettre les mêmes références sur différents types
-- Au lieu de ref UNIQUE, on utilise (toile_type_id, ref) UNIQUE

-- 1. Supprimer l'ancienne contrainte unique sur ref
ALTER TABLE toile_colors DROP CONSTRAINT IF EXISTS toile_colors_ref_key;

-- 2. Créer une nouvelle contrainte composite
ALTER TABLE toile_colors ADD CONSTRAINT toile_colors_type_ref_unique UNIQUE (toile_type_id, ref);

-- Vérifier que la contrainte a été créée
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'toile_colors'::regclass 
AND contype = 'u';
