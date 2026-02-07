-- Adapter la table Matest pour accepter les couleurs sans code RAL
ALTER TABLE matest_colors
  ALTER COLUMN ral_code DROP NOT NULL,
  ALTER COLUMN name DROP NOT NULL;

-- Ajouter une contrainte pour exiger au moins un des deux champs
ALTER TABLE matest_colors
  ADD CONSTRAINT matest_colors_code_or_name_chk
  CHECK (ral_code IS NOT NULL OR name IS NOT NULL);

-- Ajuster la contrainte d'unicité pour permettre plusieurs noms par code
ALTER TABLE matest_colors
  DROP CONSTRAINT IF EXISTS matest_colors_ral_code_finish_key;

ALTER TABLE matest_colors
  ADD CONSTRAINT matest_colors_ral_finish_name_key
  UNIQUE (ral_code, finish, name);

-- Mettre à jour le commentaire
COMMENT ON TABLE matest_colors IS 'Nuancier des couleurs Matest pour armatures de stores (91 couleurs)';
COMMENT ON COLUMN matest_colors.ral_code IS 'Code RAL de la couleur quand disponible (ex: 9016, 7016)';
COMMENT ON COLUMN matest_colors.name IS 'Nom de la couleur ou finition spéciale quand sans code';
COMMENT ON COLUMN matest_colors.finish IS 'Finition: brillant, mat, sablé, spéciale';
