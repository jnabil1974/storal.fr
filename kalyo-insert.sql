
-- Ajouter les données pour KALI'O (depuis kalyo.html)
INSERT INTO sb_products (
  name, slug, description, sales_coefficient, category,
  image_hero, min_width, max_width, min_projection, max_projection, product_type,
  hero_title, hero_subtitle, hero_tagline, hero_text, hero_points, tags,
  features, warranty, guarantees, options_description, options_cards, comparison_table, certifications
) VALUES (
  'KALI''O',
  'store-banne-kalyo',
  'Store coffre design architectural - Lignes épurées et protection intégrale',
  1.5,
  'store-banne',
  '/images/store-banne/kalyo-hero.jpg',
  2000,
  6000,
  1000,
  3500,
  'Design Contemporain',
  'Store Coffre KALI''O',
  'L''équilibre parfait entre esthétique moderne et protection intégrale',
  NULL,
  'Le KALI''O est le store coffre qui répond aux codes de l''architecture moderne grâce à ses lignes sobres et ses finitions soignées. Son coffre intégral protège totalement la toile et l''armature une fois refermé, assurant une discrétion absolue sur votre façade.',
  '["Largeur sur-mesure jusqu''à 6 000 mm", "Projection maximale de 3 500 mm", "Design aux angles travaillés pour une intégration parfaite"]'::jsonb,
  '["Design Contemporain", "Architecture Moderne", "Discrétion"]'::jsonb,
  '{
    "arm_type": "Articulés",
    "coffre_height": 200,
    "coffre_depth": 240,
    "materials": "Aluminium première fusion et visserie inox",
    "inclination": "Réglable pour s''adapter à l''ensoleillement",
    "fabrication": "Sur-mesure en France",
    "certifications": ["QUALICOAT", "QUALIMARINE"],
    "design_focus": true
  }'::jsonb,
  '{"armature": 12, "paint": 10, "motor": 5, "fabric": 5}'::jsonb,
  '[{"years": 12, "label": "Garantie Armature"}, {"years": 10, "label": "Garantie Laquage"}, {"years": 5, "label": "Moteur & Toile"}]'::jsonb,
  '{
    "LED": "Intégrez des LED sous le coffre ou dans les bras pour créer une ambiance chaleureuse en soirée",
    "Motorisation_Somfy": "Pilotage intelligent via technologie io-homecontrol pour une gestion par smartphone",
    "Wind_Security": "Automatisme Eolis 3D qui referme le store si les vibrations dues au vent sont trop fortes",
    "Toiles_Techniques": "Large choix de toiles acryliques ou micro-perforées pour un confort thermique optimal"
  }'::jsonb,
  '[
    {"title": "Éclairage LED", "description": "Intégrez des LED sous le coffre ou dans les bras pour créer une ambiance chaleureuse en soirée."},
    {"title": "Motorisation Somfy®", "description": "Pilotage intelligent via technologie io-homecontrol pour une gestion par smartphone."},
    {"title": "Sécurité Vent", "description": "Automatisme Eolis 3D qui referme le store si les vibrations dues au vent sont trop fortes."},
    {"title": "Toiles Techniques", "description": "Large choix de toiles acryliques ou micro-perforées pour un confort thermique optimal."}
  ]'::jsonb,
  '{
    "title": "Spécifications Techniques",
    "headers": ["Caractéristique", "Détails du Modèle KALI''O"],
    "rows": [
      {"label": "Encombrement Coffre", "values": ["Hauteur : 200 mm | Profondeur : 240 mm"]},
      {"label": "Structure", "values": ["Aluminium première fusion et visserie inox"]},
      {"label": "Inclinaison", "values": ["Réglable pour s''adapter à l''ensoleillement de votre terrasse"]},
      {"label": "Fabrication", "values": ["Sur-mesure en France"]},
      {"label": "Largeur", "values": ["Jusqu''à 6 000 mm"]},
      {"label": "Projection", "values": ["Jusqu''à 3 500 mm"]}
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
