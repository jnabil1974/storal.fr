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
  category = 'store-banne',
  hero_title = 'Store HELiOM & HELiOM PLUS',
  hero_subtitle = 'Le coffre intégral haute performance pour une protection absolue',
  hero_tagline = NULL,
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
  min_projection, max_projection, product_type, category, tags, features, warranty,
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
  'store-banne',
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
  NULL,
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
  category = EXCLUDED.category,
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

-- Ajouter les données pour Kissimy (depuis kissimy.html)
UPDATE sb_products SET
  image_hero = '/images/store-banne/kissimy-hero.jpg',
  min_width = 1800,
  max_width = 5000,
  min_projection = 1000,
  max_projection = 3000,
  product_type = 'Capsule Hermétique',
  category = 'store-banne',
  hero_title = 'Store Coffre KISSIMY',
  hero_subtitle = 'L''élégance d''une capsule hermétique pour votre façade',
  hero_tagline = NULL,
  hero_text = 'Le store KISSIMY se distingue par sa conception en capsule hermétique. Une fois fermé, la barre de charge s''emboîte parfaitement dans le coffre, protégeant intégralement la toile et les bras des agressions extérieures (pollution, humidité, nids d''insectes).',
  hero_points = '["Largeur maximale : 5 000 mm", "Avancée maximale : 3 000 mm", "Inclinaison réglable : de 0° à 85°"]'::jsonb,
  tags = '["Compact & Galbé", "Capsule Hermétique", "Design"]'::jsonb,
  features = '{
    "arm_type": "Articulés",
    "coffre_height": 177,
    "coffre_depth": 240,
    "materials": "Aluminium première fusion et visserie inox",
    "installation_type": "Murale (face) ou Plafond",
    "inclination": "0° à 85°",
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "compact_design": true
  }'::jsonb,
  warranty = '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  guarantees = '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Garantie Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  options_description = '{
    "LED_Firelight": "Rampes LED haute intensité discrètement intégrées sous chaque bras pour illuminer vos soirées. Intensité réglable via télécommande.",
    "Motorisation_Somfy": "Moteur radio silencieux compatible avec les solutions domotiques TaHoma pour un pilotage via smartphone",
    "Wind_Security": "Capteur de vibration Eolis 3D qui ordonne la fermeture immédiate du store en cas de vent fort",
    "Toiles_Premium": "Compatible avec les 256 coloris Dickson® ou les toiles techniques Serge Ferrari® pour un bouclier thermique optimal"
  }'::jsonb,
  options_cards = '[
    {"title": "Éclairage LED \"Firelight\"", "description": "Des rampes LED haute intensité sont discrètement intégrées sous chaque bras pour illuminer vos soirées. Intensité réglable via votre télécommande."},
    {"title": "Motorisation Somfy®", "description": "Moteur radio silencieux compatible avec les solutions domotiques TaHoma pour un pilotage via smartphone."},
    {"title": "Sécurité Vent", "description": "Capteur de vibration Eolis 3D qui ordonne la fermeture immédiate du store en cas de vent fort."},
    {"title": "Toiles Premium", "description": "Compatible avec les 256 coloris Dickson® ou les toiles techniques Serge Ferrari® pour un bouclier thermique optimal."}
  ]'::jsonb,
  comparison_table = '{
    "title": "Caractéristiques Techniques",
    "headers": ["Élément", "Spécifications du KISSIMY"],
    "rows": [
      {"label": "Hauteur du coffre", "values": ["177 mm (Idéal pour linteaux réduits)"]},
      {"label": "Profondeur du coffre", "values": ["240 mm"]},
      {"label": "Matériaux", "values": ["Aluminium première fusion et visserie inox"]},
      {"label": "Type de pose", "values": ["Murale (face) ou Plafond"]},
      {"label": "Largeur maximale", "values": ["5 000 mm"]},
      {"label": "Avancée maximale", "values": ["3 000 mm"]},
      {"label": "Inclinaison", "values": ["0° à 85° réglable"]}
    ]
  }'::jsonb,
  certifications = '["QUALICOAT", "QUALIMARINE"]'::jsonb
WHERE slug = 'store-banne-kissimy';

-- Ajouter les données pour Kitanguy (depuis kitanguy.html)
UPDATE sb_products SET
  image_hero = '/images/store-banne/kitanguy-hero.jpg',
  min_width = 1895,
  max_width = 5850,
  min_projection = 1500,
  max_projection = 3250,
  product_type = 'Spécial Urbain',
  category = 'store-banne',
  hero_title = 'Store Coffre KITANGUY',
  hero_subtitle = 'Le confort du sur-mesure pour balcons et petites terrasses',
  hero_tagline = NULL,
  hero_text = 'Le KITANGUY est la solution idéale pour les environnements urbains. Sa conception en capsule hermétique protège intégralement la toile et les bras des intempéries et de la pollution une fois le store replié.',
  hero_points = '["Inclinaison jusqu''à 60° pour contrer le soleil rasant", "Largeur sur mesure : de 1 895 mm à 5 850 mm", "Pose polyvalente : de face ou sous plafond"]'::jsonb,
  tags = '["Spécial Urbain", "Compact", "Sur-Mesure"]'::jsonb,
  features = '{
    "arm_type": "Articulés",
    "coffre_height": 177,
    "coffre_depth": 240,
    "avancees": "De 1 500 mm à 3 250 mm (6 choix)",
    "materials": "Aluminium première fusion et visserie inox",
    "compact_design": true,
    "inclination": "Jusqu''à 60°",
    "certifications": ["NF EN 13561 Classe 2", "QUALICOAT", "QUALIMARINE"]
  }'::jsonb,
  warranty = '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  guarantees = '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Garantie Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  options_description = '{
    "LED_Firelight": "Éclairage haute intensité intégré sous les bras pour profiter de votre balcon en soirée",
    "Motorisation_Somfy": "Technologie radio iO pour un pilotage via télécommande ou smartphone",
    "Wind_Security": "Capteur Eolis 3D qui referme automatiquement le store en cas de vent fort",
    "Lambrequin_Fixe": "Disponible en 5 formes pour une touche décorative traditionnelle"
  }'::jsonb,
  options_cards = '[
    {"title": "LED \"Firelight\"", "description": "Éclairage haute intensité intégré sous les bras pour profiter de votre balcon en soirée."},
    {"title": "Motorisation Somfy®", "description": "Technologie radio iO pour un pilotage via télécommande ou smartphone."},
    {"title": "Sécurité Vent", "description": "Capteur Eolis 3D qui referme automatiquement le store en cas de vent fort."},
    {"title": "Lambrequin Fixe", "description": "Disponible en 5 formes pour une touche décorative traditionnelle."}
  ]'::jsonb,
  comparison_table = '{
    "title": "Fiche Technique KITANGUY",
    "headers": ["Caractéristique", "Détails Techniques"],
    "rows": [
      {"label": "Hauteur du coffre", "values": ["177 mm (Extrêmement compact)"]},
      {"label": "Profondeur du coffre", "values": ["240 mm"]},
      {"label": "Avancées disponibles", "values": ["De 1 500 mm à 3 250 mm (6 choix)"]},
      {"label": "Structure", "values": ["Aluminium première fusion et visserie inox"]},
      {"label": "Largeur", "values": ["De 1 895 mm à 5 850 mm"]},
      {"label": "Inclinaison", "values": ["Jusqu''à 60°"]}
    ]
  }'::jsonb,
  certifications = '["NF EN 13561 Classe 2", "QUALICOAT", "QUALIMARINE"]'::jsonb
WHERE slug = 'store-banne-kitanguy';

-- Ajouter les données pour Belharra (depuis belharra.html)
INSERT INTO sb_products (
  name, slug, description, sales_coefficient, category,
  image_hero, min_width, max_width, min_projection, max_projection, product_type,
  hero_title, hero_subtitle, hero_tagline, hero_text, hero_points, tags,
  features, warranty, guarantees, options_description, options_cards, comparison_table, certifications
) VALUES (
  'BELHARRA',
  'store-banne-belharra',
  'Store coffre intégral grand format jusqu''à 12m de large',
  1.5,
  'store-banne',
  '/images/store-banne/belharra-hero.jpg',
  1970,
  12000,
  1000,
  4000,
  'Grand Format Premium',
  'Store Coffre BELHARRA',
  'L''excellence du grand format et de la protection absolue',
  NULL,
  'Le BELHARRA est le store de référence pour les projets de grandes dimensions. Son coffre intégral en aluminium de première fusion abrite totalement la toile et les bras, garantissant une protection hermétique contre les agressions extérieures et prolongeant la vie de votre installation.',
  '["Largeur modulable : de 1 970 mm jusqu''à 12 000 mm", "Projection maximale : jusqu''à 4 000 mm pour une ombre généreuse", "Bras renforcés : conçus pour maintenir une tension de toile parfaite même sur de grandes avancées"]'::jsonb,
  '["Must-Have Matest", "Grand Format", "Premium"]'::jsonb,
  '{
    "arm_type": "Bras renforcés",
    "coffre_height": 230,
    "coffre_depth_min": 370,
    "coffre_depth_max": 380,
    "materials": "Aluminium de première fusion et visserie intégrale en inox",
    "inclination": "Réglable sur mesure (réglage usine standard à 11°)",
    "wind_resistance": "Certifié Classe 2 (NF EN 13561)",
    "certifications": ["NF EN 13561 Classe 2", "QUALICOAT", "QUALIMARINE"],
    "premium": true
  }'::jsonb,
  '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Garantie Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  '{
    "Lambrequin_Deroulant": "Protégez-vous du soleil rasant et du vis-à-vis grâce à une toile verticale intégrée (jusqu''à 6m de large)",
    "LED": "Rampes LED encastrées sous le coffre ou sous les bras avec variateur d''intensité pour vos soirées",
    "Motorisation_Somfy": "Technologie io-homecontrol pour un pilotage précis via télécommande ou smartphone",
    "Wind_Security_Eolis": "Capteur 3D Wirefree qui ordonne la remontée automatique du store en cas de rafales"
  }'::jsonb,
  '[
    {"title": "Lambrequin Déroulant", "description": "Protégez-vous du soleil rasant et du vis-à-vis grâce à une toile verticale intégrée (jusqu''à 6m de large)."},
    {"title": "Éclairage LED Intégré", "description": "Rampes LED encastrées sous le coffre ou sous les bras avec variateur d''intensité pour vos soirées."},
    {"title": "Motorisation Somfy®", "description": "Technologie io-homecontrol pour un pilotage précis via télécommande ou smartphone."},
    {"title": "Sécurité Vent Eolis", "description": "Capteur 3D Wirefree qui ordonne la remontée automatique du store en cas de rafales."}
  ]'::jsonb,
  '{
    "title": "Spécifications Techniques",
    "headers": ["Composant", "Détails du Modèle BELHARRA"],
    "rows": [
      {"label": "Dimensions du Coffre", "values": ["Hauteur : 230 mm | Profondeur : 370 mm à 380 mm"]},
      {"label": "Inclinaison", "values": ["Réglable sur mesure (réglage usine standard à 11°)"]},
      {"label": "Structure", "values": ["Aluminium de première fusion et visserie intégrale en inox"]},
      {"label": "Résistance au Vent", "values": ["Certifié Classe 2 (NF EN 13561)"]},
      {"label": "Largeur", "values": ["De 1 970 mm jusqu''à 12 000 mm"]},
      {"label": "Projection", "values": ["Jusqu''à 4 000 mm"]}
    ]
  }'::jsonb,
  '["NF EN 13561 Classe 2", "QUALICOAT", "QUALIMARINE"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  image_hero = EXCLUDED.image_hero,
  min_width = EXCLUDED.min_width,
  max_width = EXCLUDED.max_width,
  min_projection = EXCLUDED.min_projection,
  max_projection = EXCLUDED.max_projection,
  product_type = EXCLUDED.product_type,
  category = EXCLUDED.category,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_text = EXCLUDED.hero_text,
  hero_points = EXCLUDED.hero_points,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty,
  guarantees = EXCLUDED.guarantees,
  options_description = EXCLUDED.options_description,
  options_cards = EXCLUDED.options_cards,
  comparison_table = EXCLUDED.comparison_table,
  certifications = EXCLUDED.certifications;

-- Ajouter les données pour Belharra 2 (depuis belharra2.html)
INSERT INTO sb_products (
  name, slug, description, sales_coefficient, category,
  image_hero, min_width, max_width, min_projection, max_projection, product_type,
  hero_title, hero_subtitle, hero_tagline, hero_text, hero_points, tags,
  features, warranty, guarantees, options_description, options_cards, comparison_table, certifications
) VALUES (
  'BELHARRA 2',
  'store-banne-belharra-2',
  'Store coffre intégral sur tube porteur - Grand format jusqu''à 12m',
  1.5,
  'store-banne',
  '/images/store-banne/belharra2-hero.jpg',
  1970,
  12000,
  1500,
  4000,
  'Innovation Structurelle',
  'Store Coffre BELHARRA 2',
  'L''alliance parfaite du coffre intégral et de la structure monobloc',
  NULL,
  'Le BELHARRA 2 se distingue par son coffre autoporté monté sur un tube porteur carré de 40 x 40 mm en acier galvanisé laqué. Cette structure hybride permet une pose simplifiée et une rigidité accrue, idéale pour les très grandes largeurs.',
  '["Largeur exceptionnelle : de 1 970 mm à 12 000 mm", "Avancée sur mesure : de 1 500 mm à 4 000 mm (8 choix)", "Design compact : Un profil de coffre plus affiné que le Belharra standard"]'::jsonb,
  '["Innovation Structurelle", "Tube Porteur", "Grand Format"]'::jsonb,
  '{
    "arm_type": "Bras renforcés sur tube porteur",
    "coffre_height": 194,
    "coffre_depth": 230,
    "tube_porteur": "40 x 40 mm acier galvanisé laqué",
    "materials": "Aluminium première fusion et visserie inox",
    "protection": "Coffre intégral hermétique",
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "premium": true
  }'::jsonb,
  '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Garantie Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  '{
    "LED": "Rampes LED intégrées sous le coffre ou sur les bras pour prolonger vos soirées",
    "Lambrequin_Deroulant": "Option de protection contre le soleil rasant et le vis-à-vis (jusqu''à 1,60 m de haut)",
    "Motorisation_Somfy": "Technologie io-homecontrol pour un pilotage via télécommande ou smartphone",
    "Wind_Security": "Capteur Eolis 3D qui referme automatiquement le store en cas de vent fort"
  }'::jsonb,
  '[
    {"title": "Éclairage LED", "description": "Rampes LED intégrées sous le coffre ou sur les bras pour prolonger vos soirées."},
    {"title": "Lambrequin Déroulant", "description": "Option de protection contre le soleil rasant et le vis-à-vis (jusqu''à 1,60 m de haut)."},
    {"title": "Motorisation Somfy®", "description": "Technologie io-homecontrol pour un pilotage via télécommande ou smartphone."},
    {"title": "Sécurité Vent", "description": "Capteur Eolis 3D qui referme automatiquement le store en cas de vent fort."}
  ]'::jsonb,
  '{
    "title": "Spécifications Techniques",
    "headers": ["Caractéristique", "Détails du Modèle BELHARRA 2"],
    "rows": [
      {"label": "Dimensions du Coffre", "values": ["Hauteur : 194 mm | Profondeur : 230 mm"]},
      {"label": "Structure de Pose", "values": ["Tube porteur 40 x 40 mm pour une fixation modulable"]},
      {"label": "Matériaux", "values": ["Aluminium première fusion et visserie inox"]},
      {"label": "Protection", "values": ["Coffre intégral protégeant hermétiquement la toile et les bras"]},
      {"label": "Largeur", "values": ["De 1 970 mm à 12 000 mm"]},
      {"label": "Avancée", "values": ["De 1 500 mm à 4 000 mm (8 choix)"]}
    ]
  }'::jsonb,
  '["QUALICOAT", "QUALIMARINE"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  image_hero = EXCLUDED.image_hero,
  min_width = EXCLUDED.min_width,
  max_width = EXCLUDED.max_width,
  min_projection = EXCLUDED.min_projection,
  max_projection = EXCLUDED.max_projection,
  product_type = EXCLUDED.product_type,
  category = EXCLUDED.category,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_text = EXCLUDED.hero_text,
  hero_points = EXCLUDED.hero_points,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty,
  guarantees = EXCLUDED.guarantees,
  options_description = EXCLUDED.options_description,
  options_cards = EXCLUDED.options_cards,
  comparison_table = EXCLUDED.comparison_table,
  certifications = EXCLUDED.certifications;

-- Ajouter les données pour KITANGUY 2 (depuis kitanguy2.html)
INSERT INTO sb_products (
  name, slug, description, sales_coefficient, category,
  image_hero, min_width, max_width, min_projection, max_projection, product_type,
  hero_title, hero_subtitle, hero_tagline, hero_text, hero_points, tags,
  features, warranty, guarantees, options_description, options_cards, comparison_table, certifications
) VALUES (
  'KITANGUY 2',
  'store-banne-kitanguy-2',
  'Store coffre design - Nouveauté 2025 pour balcons et petites terrasses',
  1.5,
  'store-banne',
  '/images/store-banne/kitanguy2-hero.jpg',
  1910,
  5850,
  1500,
  3250,
  'Urbain Evolution',
  'Store Coffre KITANGUY 2',
  'L''évolution design de la protection solaire urbaine',
  NULL,
  'Le KITANGUY 2 est la toute nouvelle version du store coffre Matest, spécialement optimisée pour les balcons et les petites terrasses. Son design moderne s''accompagne d''une protection hermétique totale de la toile et des bras contre les agressions urbaines.',
  '["Inclinaison exceptionnelle jusqu''à 60° pour protection contre le soleil rasant", "Largeur sur-mesure : de 1 910 mm à 5 850 mm", "Conception française en aluminium de première fusion avec visserie inox"]'::jsonb,
  '["Nouveauté 2025", "Design Urbain", "Discrétion"]'::jsonb,
  '{
    "arm_type": "Articulés",
    "coffre_height": 177,
    "coffre_depth": 270,
    "avancees": "De 1 500 mm à 3 250 mm (6 choix)",
    "materials": "Aluminium première fusion et visserie inox",
    "compact_design": true,
    "inclination": "Jusqu''à 60°",
    "certifications": ["NF EN 13561 Classe 2", "QUALICOAT", "QUALIMARINE"],
    "pose_type": "Platines universelles pour pose face ou plafond"
  }'::jsonb,
  '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Garantie Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  '{
    "LED": "Rampes LED intégrables sous le coffre ou dans les bras pour illuminer votre terrasse avec élégance",
    "Motorisation_Somfy": "Pilotage via télécommande ou smartphone (iO / RTS) pour une gestion fluide de votre ombre",
    "Wind_Security": "Capteur Eolis 3D détecte les vibrations et ordonne la fermeture automatique en cas de rafales",
    "Manual_Backup": "Option de manivelle de secours disponible pour manipulation en cas de coupure électrique"
  }'::jsonb,
  '[
    {"title": "Éclairage LED", "description": "Rampes LED intégrables sous le coffre ou dans les bras pour illuminer votre terrasse avec élégance."},
    {"title": "Intelligence Somfy®", "description": "Pilotage via télécommande ou smartphone (iO / RTS) pour une gestion fluide de votre ombre."},
    {"title": "Sécurité Vent", "description": "Le capteur Eolis 3D détecte les vibrations et ordonne la fermeture automatique en cas de rafales."},
    {"title": "Secours Manuel", "description": "Option de manivelle de secours disponible pour une manipulation en cas de coupure électrique."}
  ]'::jsonb,
  '{
    "title": "Fiche Technique Détaillée",
    "headers": ["Caractéristique", "Détails du KITANGUY 2"],
    "rows": [
      {"label": "Hauteur du coffre", "values": ["177 mm (Compacité maximale pour linteaux réduits)"]},
      {"label": "Profondeur du coffre", "values": ["270 mm (Protection mécanique renforcée)"]},
      {"label": "Avancées disponibles", "values": ["6 choix : de 1 500 mm à 3 250 mm"]},
      {"label": "Type de Pose", "values": ["Platines universelles pour pose face ou plafond"]},
      {"label": "Largeur", "values": ["De 1 910 mm à 5 850 mm"]},
      {"label": "Inclinaison", "values": ["Jusqu''à 60°"]}
    ]
  }'::jsonb,
  '["NF EN 13561 Classe 2", "QUALICOAT", "QUALIMARINE"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  image_hero = EXCLUDED.image_hero,
  min_width = EXCLUDED.min_width,
  max_width = EXCLUDED.max_width,
  min_projection = EXCLUDED.min_projection,
  max_projection = EXCLUDED.max_projection,
  product_type = EXCLUDED.product_type,
  category = EXCLUDED.category,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_text = EXCLUDED.hero_text,
  hero_points = EXCLUDED.hero_points,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty,
  guarantees = EXCLUDED.guarantees,
  options_description = EXCLUDED.options_description,
  options_cards = EXCLUDED.options_cards,
  comparison_table = EXCLUDED.comparison_table,
  certifications = EXCLUDED.certifications;
-- Ajouter les données pour DYNASTA (depuis dynasta.html)
INSERT INTO sb_products (
  name, slug, description, sales_coefficient, category,
  image_hero, min_width, max_width, min_projection, max_projection, product_type,
  hero_title, hero_subtitle, hero_tagline, hero_text, hero_points, tags,
  features, warranty, guarantees, options_description, options_cards, comparison_table, certifications
) VALUES (
  'DYNASTA',
  'store-banne-dynasta',
  'Store coffre intégral sur structure porteuse - Jusqu''à 12m de large',
  1.5,
  'store-banne',
  '/images/store-banne/dynasta-hero.jpg',
  1970,
  12000,
  1000,
  4000,
  'Hybride Haute Résistance',
  'Store Coffre DYNASTA',
  'Le colosse architectural : Coffre intégral sur structure porteuse',
  NULL,
  'Le DYNASTA est le modèle "hors normes" conçu pour les très grandes terrasses. Sa force réside dans sa conception unique : un coffre en aluminium protégeant la toile, monté sur un tube porteur carré en acier très robuste. Cela permet de multiplier les points de fixation et les bras pour une stabilité inégalée.',
  '["Largeur record : jusqu''à 12 000 mm (12 mètres)", "Projection maximale : 4 000 mm (4 mètres)", "Structure : Tube porteur acier galvanisé 40x40 mm"]'::jsonb,
  '["Hybride Haute Résistance", "XXL", "Structure Porteuse"]'::jsonb,
  '{
    "type_structure": "Coffre intégral sur tube porteur",
    "coffre_height": 194,
    "coffre_depth": 230,
    "tube_porteur": "40 x 40 mm acier galvanisé",
    "modularite": "Jusqu''à 6 bras possibles",
    "materials": "Aluminium première fusion, Acier galvanisé (tube) et visserie inox",
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "premium": true
  }'::jsonb,
  '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  '[{"years": 12, "label": "Garantie Armature (Inclus tube porteur)"}, {"years": 10, "label": "Tenue du Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  '{
    "Lambrequin_Deroulable": "Protection supplémentaire contre le soleil rasant ou le vis-à-vis (toile verticale jusqu''à 1,60 m)",
    "LED": "Rampes LED intégrables sous le coffre ou sur les bras pour illuminer la terrasse",
    "Motorisation_Somfy": "Pilotage radio intelligent via télécommande ou smartphone (compatible TaHoma)",
    "Wind_Security_Eolis": "Capteur de vibrations 3D ordonnant la fermeture automatique en cas de rafales"
  }'::jsonb,
  '[
    {"title": "Lambrequin Déroulable", "description": "Protection supplémentaire contre le soleil rasant ou le vis-à-vis (toile verticale jusqu''à 1,60 m)."},
    {"title": "Éclairage LED Intégré", "description": "Rampes LED intégrables sous le coffre ou sur les bras pour illuminer la terrasse."},
    {"title": "Motorisation Somfy® IO", "description": "Pilotage radio intelligent via télécommande ou smartphone (compatible TaHoma)."},
    {"title": "Sécurité Vent Eolis", "description": "Capteur de vibrations 3D ordonnant la fermeture automatique en cas de rafales."}
  ]'::jsonb,
  '{
    "title": "Spécifications Techniques",
    "headers": ["Caractéristique", "Détails du Modèle DYNASTA"],
    "rows": [
      {"label": "Type de structure", "values": ["Coffre intégral sur tube porteur (Facilité de pose et robustesse)"]},
      {"label": "Dimensions du Coffre", "values": ["Hauteur : 194 mm | Profondeur : 230 mm"]},
      {"label": "Modularité", "values": ["Jusqu''à 6 bras possibles pour soutenir les grandes largeurs"]},
      {"label": "Matériaux", "values": ["Aluminium première fusion, Acier galvanisé (tube) et visserie inox"]},
      {"label": "Largeur", "values": ["Jusqu''à 12 000 mm (12 mètres)"]},
      {"label": "Projection", "values": ["Jusqu''à 4 000 mm (4 mètres)"]}
    ]
  }'::jsonb,
  '["QUALICOAT", "QUALIMARINE"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  image_hero = EXCLUDED.image_hero,
  min_width = EXCLUDED.min_width,
  max_width = EXCLUDED.max_width,
  min_projection = EXCLUDED.min_projection,
  max_projection = EXCLUDED.max_projection,
  product_type = EXCLUDED.product_type,
  category = EXCLUDED.category,
  hero_title = EXCLUDED.hero_title,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_tagline = EXCLUDED.hero_tagline,
  hero_text = EXCLUDED.hero_text,
  hero_points = EXCLUDED.hero_points,
  tags = EXCLUDED.tags,
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty,
  guarantees = EXCLUDED.guarantees,
  options_description = EXCLUDED.options_description,
  options_cards = EXCLUDED.options_cards,
  comparison_table = EXCLUDED.comparison_table,
  certifications = EXCLUDED.certifications;-- INSERT pour Store Monobloc ANTIBES
INSERT INTO sb_products (
    slug,
    name,
    description,
    image_hero,
    min_width,
    max_width,
    min_projection,
    max_projection,
  category,
    product_type,
    tags,
    features,
    warranty,
    options_description,
    hero_title,
    hero_subtitle,
    hero_tagline,
    hero_text,
    hero_points,
    comparison_table,
    options_cards,
    guarantees,
    certifications
) VALUES (
    'store-banne-antibes',
    'Store Monobloc ANTIBES',
    'Le standard de la robustesse et de la flexibilité avec structure monobloc et tube porteur carré 40x40mm.',
    '/images/stores/antibes-hero.jpg',
    2000,
    6000,
    1500,
    3000,
    'store-banne',
    'Monobloc Robuste',
    '["Solution Polyvalente", "Structure Ouverte", "Haute Résistance", "Installation Libre"]'::jsonb,
    '{
        "structure": "Monobloc avec tube porteur carré 40 x 40 mm en acier galvanisé laqué",
        "coffre_height": 220,
        "coffre_depth": 250,
        "installation": "Liberté de positionnement des supports pour tout type de façade ou sous plafond",
        "visserie": "Visserie intégrale en inox",
        "resistance_vent": "Certifié Classe 2 (NF EN 13561)",
        "largeur_max": "6 000 mm sur-mesure",
        "avancees": ["1 500 mm", "2 000 mm", "2 500 mm", "3 000 mm"]
    }'::jsonb,
    '{
        "armature": "12 ans",
        "laquage": "10 ans", 
        "moteur": "5 ans",
        "toile": "5 ans"
    }'::jsonb,
    '{
        "title": "Équipements & Options",
        "description": "Des options pour adapter l''ANTIBES à vos besoins spécifiques."
    }'::jsonb,
    'Store Monobloc ANTIBES',
    'Le standard de la robustesse et de la flexibilité',
    'Solution Polyvalente',
    'L''ANTIBES est un store à structure ouverte monté sur un tube porteur carré de 40 x 40 mm en acier galvanisé laqué. Cette conception monobloc permet de positionner les supports de pose avec une grande liberté, facilitant l''installation sur tout type de façade ou sous plafond.',
    '[
        "Idéal pour une pose sous débord de toit protecteur",
        "Largeur sur-mesure jusqu''à 6 000 mm",
        "Armature haute résistance avec visserie intégrale en inox"
    ]'::jsonb,
    '{
        "title": "Spécifications Techniques",
        "headers": ["Caractéristique", "Détails Techniques de l''ANTIBES"],
        "rows": [
            ["Tube Porteur", "Acier galvanisé 40 x 40 mm (laquage assorti)"],
            ["Avancées disponibles", "1 500 mm / 2 000 mm / 2 500 mm / 3 000 mm"],
            ["Encombrement", "Hauteur : 220 mm | Profondeur : 250 mm"],
            ["Résistance au Vent", "Certifié Classe 2 (NF EN 13561)"]
        ]
    }'::jsonb,
    '[
        {
            "title": "Auvent de Protection",
            "description": "Option recommandée pour abriter le rouleau de toile des salissures lorsqu''il est replié."
        },
        {
            "title": "Motorisation Somfy®",
            "description": "Pilotage par télécommande (io / RTS) pour une manipulation fluide et intelligente."
        },
        {
            "title": "Éclairage LED",
            "description": "Rampes LED optionnelles fixées sous les bras pour profiter de votre terrasse en soirée."
        },
        {
            "title": "Sécurité Vent",
            "description": "Capteur Eolis 3D qui referme automatiquement le store en cas de vibrations excessives."
        }
    ]'::jsonb,
    '[
        {
            "duration": "12 ANS",
            "type": "Garantie Armature"
        },
        {
            "duration": "10 ANS", 
            "type": "Garantie Laquage"
        },
        {
            "duration": "5 ANS",
            "type": "Moteur & Toile"
        }
    ]'::jsonb,
    '[
        "QUALICOAT®",
        "QUALIMARINE®",
        "Fabrication française sur-mesure"
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_hero = EXCLUDED.image_hero,
    min_width = EXCLUDED.min_width,
    max_width = EXCLUDED.max_width,
    min_projection = EXCLUDED.min_projection,
    max_projection = EXCLUDED.max_projection,
    category = EXCLUDED.category,
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

-- INSERT pour Store Monobloc MADRID
INSERT INTO sb_products (
    slug,
    name,
    description,
    image_hero,
    min_width,
    max_width,
    min_projection,
    max_projection,
    category,
    product_type,
    tags,
    features,
    warranty,
    options_description,
    hero_title,
    hero_subtitle,
    hero_tagline,
    hero_text,
    hero_points,
    comparison_table,
    options_cards,
    guarantees,
    certifications
) VALUES (
    'store-banne-madrid',
    'Store Monobloc MADRID',
    'L''excellence du sur-mesure pour les dimensions monumentales avec largeur jusqu''à 18m.',
    '/images/stores/madrid-hero.jpg',
    2000,
    18000,
    1000,
    4000,
    'store-banne',
    'Performances XXL',
    '["Performances XXL", "Grandes Largeurs", "Structure Renforcée", "Configuration Modulaire"]'::jsonb,
    '{
        "structure": "Tube porteur carré 40 x 40 mm en acier galvanisé laqué haute résistance",
        "coffre_height": 220,
        "coffre_depth": 250,
        "mecanisme": "Bras à compensation angulaire avec câbles gainés et ressorts puissants",
        "configuration": "De 2 à 6 bras pour soutien optimal",
        "certification": "Classe 2 de résistance au vent (Norme NF EN 13561)",
        "largeur_max": "18 000 mm (18 mètres)",
        "avancees": "8 choix disponibles jusqu''à 4 000 mm"
    }'::jsonb,
    '{
        "armature": "12 ans",
        "laquage": "10 ans",
        "moteur": "5 ans",
        "toile": "5 ans"
    }'::jsonb,
    '{
        "title": "Options & Équipements de Confort",
        "description": "Des équipements pour maximiser votre confort sur de grandes surfaces."
    }'::jsonb,
    'Store Monobloc MADRID',
    'L''excellence du sur-mesure pour les dimensions monumentales',
    'Performances XXL',
    'Le MADRID est le store monobloc par excellence pour couvrir des surfaces exceptionnelles. Sa structure repose sur un tube porteur carré de 40 x 40 mm en acier galvanisé laqué, offrant une rigidité et une flexibilité de pose inégalées pour les terrasses de villas ou de commerces.',
    '[
        "Largeur hors tout : jusqu''à 18 000 mm (18 mètres)",
        "Avancée maximale : jusqu''à 4 000 mm (8 choix disponibles)",
        "Configuration : de 2 à 6 bras pour un soutien optimal"
    ]'::jsonb,
    '{
        "title": "Spécifications Techniques",
        "headers": ["Caractéristique", "Détails du Modèle MADRID"],
        "rows": [
            ["Structure porteuse", "Tube carré acier galvanisé 40 x 40 mm (laqué haute résistance)"],
            ["Mécanisme des bras", "Bras à compensation angulaire avec câbles gainés et ressorts puissants"],
            ["Encombrement", "Hauteur : 220 mm | Profondeur : 250 mm"],
            ["Certification", "Classe 2 de résistance au vent (Norme NF EN 13561)"]
        ]
    }'::jsonb,
    '[
        {
            "title": "Auvent de Protection",
            "description": "Option indispensable pour abriter le rouleau de toile des intempéries et de la pollution."
        },
        {
            "title": "Lambrequin Déroulant",
            "description": "Protégez-vous du soleil rasant ou du vis-à-vis (jusqu''à 6m de large et 1,60m de haut)."
        },
        {
            "title": "Éclairage LED",
            "description": "Rampes LED haute performance fixées sous les bras pour illuminer votre terrasse en soirée."
        },
        {
            "title": "Domotique Somfy®",
            "description": "Pilotage radio intelligent (io-homecontrol) pour une gestion via télécommande ou smartphone."
        }
    ]'::jsonb,
    '[
        {
            "duration": "12 ANS",
            "type": "Garantie Armature"
        },
        {
            "duration": "10 ANS",
            "type": "Garantie Laquage"
        },
        {
            "duration": "5 ANS",
            "type": "Moteur & Toile"
        }
    ]'::jsonb,
    '[
        "QUALICOAT®",
        "QUALIMARINE®",
        "Fabrication française sur-mesure"
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image_hero = EXCLUDED.image_hero,
    min_width = EXCLUDED.min_width,
    max_width = EXCLUDED.max_width,
    min_projection = EXCLUDED.min_projection,
    max_projection = EXCLUDED.max_projection,
    category = EXCLUDED.category,
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