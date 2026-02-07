-- Créer la table pour les couleurs d'armatures Matest
CREATE TABLE IF NOT EXISTS matest_colors (
  id SERIAL PRIMARY KEY,
  ral_code VARCHAR(10),
  name VARCHAR(100),
  finish VARCHAR(20) NOT NULL CHECK (finish IN ('brillant', 'mat', 'sablé', 'spéciale')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CHECK (ral_code IS NOT NULL OR name IS NOT NULL),
  UNIQUE(ral_code, finish, name)
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_matest_colors_ral ON matest_colors(ral_code);
CREATE INDEX IF NOT EXISTS idx_matest_colors_finish ON matest_colors(finish);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matest_colors_updated_at BEFORE UPDATE ON matest_colors
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaires
COMMENT ON TABLE matest_colors IS 'Nuancier des couleurs Matest pour armatures de stores (91 couleurs)';
COMMENT ON COLUMN matest_colors.ral_code IS 'Code RAL de la couleur quand disponible (ex: 9016, 7016)';
COMMENT ON COLUMN matest_colors.name IS 'Nom de la couleur ou finition spéciale quand sans code';
COMMENT ON COLUMN matest_colors.finish IS 'Finition: brillant, mat, sablé, spéciale';
