
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
  certifications = EXCLUDED.certifications;
