-- Supprimer l'ancienne contrainte de check si elle existe
ALTER TABLE matest_colors DROP CONSTRAINT IF EXISTS matest_colors_finish_check;

-- Ajouter la nouvelle contrainte avec le type "promo"
ALTER TABLE matest_colors ADD CONSTRAINT matest_colors_finish_check 
  CHECK (finish IN ('brillant', 'sablé', 'mat', 'promo', 'spéciale'));
