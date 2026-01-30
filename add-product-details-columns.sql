-- Ajouter des colonnes détaillées à sb_products pour les pages de présentation

ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS image_hero TEXT;
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS min_width INTEGER DEFAULT 2000; -- mm
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS max_width INTEGER DEFAULT 6000; -- mm
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS min_projection INTEGER DEFAULT 1000; -- mm
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS max_projection INTEGER DEFAULT 3500; -- mm
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS product_type VARCHAR(100); -- 'HELiOM', 'HELiOM PLUS', 'Standard', etc.
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS tags JSONB; -- ['Coffre Intégral', 'Motorisable', etc.]
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS features JSONB; -- Caractéristiques principales
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS warranty JSONB; -- {"armature": 12, "paint": 10, "motor": 5}
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS options_description JSONB; -- Description des équipements

-- Exemple de structure pour features
-- {
--   "arm_type": "Articulés standard",
--   "coffre_height": 288,
--   "coffre_depth": 206,
--   "certification": "QUALICOAT",
--   "certifications": ["QUALICOAT", "QUALIMARINE"]
-- }

-- Exemple de structure pour warranty
-- {
--   "armature": 12,
--   "paint": 10,
--   "motor": 5,
--   "fabric": 5
-- }

-- Exemple de structure pour options_description
-- {
--   "LED": "Bandeaux LED intégrés sous le coffre ou directement dans les bras",
--   "Motorisation": "Pilotage par télécommande ou smartphone via io-homecontrol®",
--   "Wind_Security": "Capteur Eolis 3D qui remonte automatiquement en cas de rafales"
-- }

-- Ajouter les données pour HELiOM
UPDATE sb_products SET
  image_hero = '/images/store-banne/heliom-hero.jpg',
  min_width = 2340,
  max_width = 6000,
  min_projection = 1000,
  max_projection = 3500,
  product_type = 'HELiOM',
  tags = '["Coffre Intégral", "Protection Totale", "Performance"]'::jsonb,
  features = '{
    "arm_type": "Articulés standard",
    "coffre_height": 288,
    "coffre_depth": 206,
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "integrated_structure": true
  }'::jsonb,
  warranty = '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  options_description = '{
    "LED": "Bandeaux LED intégrés sous le coffre ou directement dans les bras",
    "Motorisation": "Pilotage par télécommande ou smartphone via io-homecontrol",
    "Wind_Security": "Capteur Eolis 3D qui remonte automatiquement le store en cas de rafales",
    "Bi_Color": "Personnalisez votre design avec une couleur différente pour le coffre et les bras"
  }'::jsonb
WHERE slug = 'store-banne-heliom';

-- Ajouter les données pour HELiOM PLUS (créer le produit s'il n'existe pas)
INSERT INTO sb_products (name, slug, description, sales_coefficient, image_hero, min_width, max_width, min_projection, max_projection, product_type, tags, features, warranty, options_description)
VALUES (
  'Store Banne HELiOM PLUS',
  'store-banne-heliom-plus',
  'Le coffre intégral haute performance avec projection maximale pour une protection absolue',
  1.5,
  '/images/store-banne/heliom-plus-hero.jpg',
  2340,
  6000,
  1000,
  4000,
  'HELiOM PLUS',
  '["Coffre Intégral", "Bras Renforcés", "Projection Maximale"]'::jsonb,
  '{
    "arm_type": "Bras renforcés haute performance",
    "coffre_height": 288,
    "coffre_depth": 206,
    "lambrequin": "Optionnel (Manuel ou Motorisé)",
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "integrated_structure": true
  }'::jsonb,
  '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  '{
    "LED": "Bandeaux LED intégrés sous le coffre ou directement dans les bras",
    "Motorisation": "Pilotage par télécommande ou smartphone via io-homecontrol",
    "Wind_Security": "Capteur Eolis 3D qui remonte automatiquement le store en cas de rafales",
    "Bi_Color": "Personnalisez votre design avec une couleur différente pour le coffre et les bras",
    "Lambrequin": "Protection supplémentaire avec option motorisation"
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty,
  options_description = EXCLUDED.options_description;

-- Ajouter les données pour Kissimy
UPDATE sb_products SET
  image_hero = '/images/store-banne/kissimy-hero.jpg',
  min_width = 1800,
  max_width = 5500,
  min_projection = 800,
  max_projection = 3000,
  product_type = 'Standard',
  tags = '["Coffre Standard", "Polyvalent", "Économique"]'::jsonb,
  features = '{
    "arm_type": "Articulés standard",
    "coffre_height": 250,
    "coffre_depth": 180,
    "certifications": ["QUALICOAT"],
    "good_value": true
  }'::jsonb,
  warranty = '{"armature": 10, "paint": 8, "motor": 3, "fabric": 3}'::jsonb,
  options_description = '{
    "LED": "Éclairage LED optionnel",
    "Motorisation": "Motorisation Somfy disponible",
    "Wind_Security": "Sécurité vent optionnelle"
  }'::jsonb
WHERE slug = 'kissimy';

-- Vérifier les données
SELECT id, name, slug, product_type, tags, warranty FROM sb_products;
