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
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS hero_title TEXT;
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS hero_subtitle TEXT;
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS hero_tagline TEXT;
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS hero_text TEXT;
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS hero_points JSONB; -- Liste de points clés
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS comparison_table JSONB; -- Tableau comparatif
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS options_cards JSONB; -- Cartes d'options
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS guarantees JSONB; -- Garanties avec libellés
ALTER TABLE sb_products ADD COLUMN IF NOT EXISTS certifications JSONB; -- Certifications

-- Ajouter les données pour HELiOM
UPDATE sb_products SET
  image_hero = '/images/store-banne/heliom-hero.jpg',
  min_width = 2340,
  max_width = 6000,
  min_projection = 1000,
  max_projection = 3500,
  product_type = 'HELiOM',
  hero_title = 'Store HELiOM & HELiOM PLUS',
  hero_subtitle = 'Le coffre intégral haute performance pour une protection absolue',
  hero_tagline = 'Coffre Intégral',
  hero_text = 'Le store HELiOM est conçu pour abriter intégralement la toile et les bras dans un coffre hermétique une fois refermé. Cette conception garantit une longévité maximale à vos composants face à la pollution et aux intempéries.',
  hero_points = '["Largeur : de 2 340 mm à 6 000 mm", "Avancée HELiOM : jusqu''à 3 500 mm", "Avancée HELiOM PLUS : jusqu''à 4 000 mm"]'::jsonb,
  tags = '["Coffre Intégral", "Protection Totale", "Performance"]'::jsonb,
  features = '{
    "arm_type": "Articulés standard",
    "coffre_height": 288,
    "coffre_depth": 206,
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "integrated_structure": true
  }'::jsonb,
  warranty = '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  guarantees = '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Tenue du Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  options_description = '{
    "LED": "Bandeaux LED intégrés sous le coffre ou directement dans les bras",
    "Motorisation": "Pilotage par télécommande ou smartphone via io-homecontrol",
    "Wind_Security": "Capteur Eolis 3D qui remonte automatiquement le store en cas de rafales",
    "Bi_Color": "Personnalisez votre design avec une couleur différente pour le coffre et les bras"
  }'::jsonb,
  options_cards = '[
    {"title": "Éclairage LED", "description": "Bandeaux LED intégrés sous le coffre ou directement dans les bras pour illuminer vos soirées."},
    {"title": "Motorisation Somfy", "description": "Pilotage par télécommande ou smartphone via la technologie io-homecontrol®."},
    {"title": "Sécurité Vent", "description": "Capteur Eolis 3D qui remonte automatiquement le store en cas de rafales de vent."},
    {"title": "Bi-Coloration", "description": "Personnalisez votre design en choisissant une couleur différente pour le coffre et les bras."}
  ]'::jsonb,
  comparison_table = '{
    "title": "HELiOM vs HELiOM PLUS",
    "headers": ["Caractéristiques", "HELiOM", "HELiOM PLUS"],
    "rows": [
      {"label": "Type de Bras", "values": ["Articulés standard", "Bras renforcés haute performance"]},
      {"label": "Projection Max", "values": ["3,50 m (8 choix)", "4,00 m (5 choix)"]},
      {"label": "Lambrequin Déroulant", "values": ["Non disponible", "Optionnel (Manuel ou Motorisé)"]},
      {"label": "Encombrement Coffre", "values": ["Hauteur 288 mm x Profondeur 206 mm", "Hauteur 288 mm x Profondeur 206 mm"]}
    ]
  }'::jsonb,
  certifications = '["QUALICOAT", "QUALIMARINE"]'::jsonb
WHERE slug = 'store-banne-heliom';

-- Ajouter les données pour HELiOM PLUS (créer le produit s'il n'existe pas)
INSERT INTO sb_products (
  name, slug, description, sales_coefficient, image_hero, min_width, max_width,
  min_projection, max_projection, product_type, tags, features, warranty,
  options_description, hero_title, hero_subtitle, hero_tagline, hero_text,
  hero_points, comparison_table, options_cards, guarantees, certifications
)
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
  }'::jsonb,
  'Store HELiOM & HELiOM PLUS',
  'Le coffre intégral haute performance pour une protection absolue',
  'Coffre Intégral',
  'Le store HELiOM est conçu pour abriter intégralement la toile et les bras dans un coffre hermétique une fois refermé. Cette conception garantit une longévité maximale à vos composants face à la pollution et aux intempéries.',
  '["Largeur : de 2 340 mm à 6 000 mm", "Avancée HELiOM : jusqu''à 3 500 mm", "Avancée HELiOM PLUS : jusqu''à 4 000 mm"]'::jsonb,
  '{
    "title": "HELiOM vs HELiOM PLUS",
    "headers": ["Caractéristiques", "HELiOM", "HELiOM PLUS"],
    "rows": [
      {"label": "Type de Bras", "values": ["Articulés standard", "Bras renforcés haute performance"]},
      {"label": "Projection Max", "values": ["3,50 m (8 choix)", "4,00 m (5 choix)"]},
      {"label": "Lambrequin Déroulant", "values": ["Non disponible", "Optionnel (Manuel ou Motorisé)"]},
      {"label": "Encombrement Coffre", "values": ["Hauteur 288 mm x Profondeur 206 mm", "Hauteur 288 mm x Profondeur 206 mm"]}
    ]
  }'::jsonb,
  '[
    {"title": "Éclairage LED", "description": "Bandeaux LED intégrés sous le coffre ou directement dans les bras pour illuminer vos soirées."},
    {"title": "Motorisation Somfy", "description": "Pilotage par télécommande ou smartphone via la technologie io-homecontrol®."},
    {"title": "Sécurité Vent", "description": "Capteur Eolis 3D qui remonte automatiquement le store en cas de rafales de vent."},
    {"title": "Bi-Coloration", "description": "Personnalisez votre design en choisissant une couleur différente pour le coffre et les bras."}
  ]'::jsonb,
  '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Tenue du Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  '["QUALICOAT", "QUALIMARINE"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  image_hero = EXCLUDED.image_hero,
  min_width = EXCLUDED.min_width,
  max_width = EXCLUDED.max_width,
  min_projection = EXCLUDED.min_projection,
  max_projection = EXCLUDED.max_projection,
  product_type = EXCLUDED.product_type,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty,
  options_description = EXCLUDED.options_description,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_text = EXCLUDED.hero_text,
  hero_points = EXCLUDED.hero_points,
  comparison_table = EXCLUDED.comparison_table,
  options_cards = EXCLUDED.options_cards,
  guarantees = EXCLUDED.guarantees,
  certifications = EXCLUDED.certifications;

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
