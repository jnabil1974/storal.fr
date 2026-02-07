-- INSERT pour Store Monobloc BRAS CROISÉS
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
    'store-banne-bras-croises',
    'Store Monobloc BRAS CROISÉS',
    'L''ombre généreuse pour les façades les plus étroites - Plus d''avancée que de largeur.',
    '/images/stores/bras-croises-hero.jpg',
    1500,
    4000,
    1500,
    4000,
    'store-banne',
    'Expertise Technique',
    '["Expertise Technique", "Balcons Étroits", "Avancée Maximale", "Bras Croisés"]'::jsonb,
    '{
        "structure": "Structure monobloc sur tube porteur acier galvanisé 40 x 40 mm laqué haute résistance",
        "coffre_height": 220,
        "coffre_depth": 250,
        "mecanisme": "Bras articulés avec câbles gainés et supports décalés en hauteur",
        "visserie": "Intégralement en Inox pour une protection anti-corrosion",
        "particularite": "Système de supports décalés permettant aux bras de se replier l''un sur l''autre",
        "usage_ideal": "Entrées de commerces et balcons citadins profonds mais étroits"
    }'::jsonb,
    '{
        "armature": "12 ans",
        "laquage": "10 ans",
        "moteur": "5 ans",
        "toile": "5 ans"
    }'::jsonb,
    '{
        "title": "Options de Confort & Sécurité",
        "description": "Des équipements adaptés aux configurations étroites et urbaines."
    }'::jsonb,
    'Store BRAS CROISÉS',
    'L''ombre généreuse pour les façades les plus étroites',
    'Expertise Technique',
    'Le store BRAS CROISÉS est la solution d''ingénierie parfaite pour les balcons profonds mais étroits. Grâce à un système de supports décalés en hauteur, les bras se replient l''un sur l''autre, permettant une projection de toile supérieure à la largeur du store.',
    '[
        "Idéal pour les entrées de commerces ou balcons citadins",
        "Avancée jusqu''à 4 000 mm même sur de petites largeurs",
        "Structure monobloc sur tube porteur acier galvanisé 40 x 40 mm"
    ]'::jsonb,
    '{
        "title": "Détails de la Structure",
        "headers": ["Composant", "Détails Techniques"],
        "rows": [
            ["Mécanisme", "Bras articulés avec câbles gainés et supports décalés"],
            ["Tube Porteur", "Acier galvanisé 40 x 40 mm laqué haute résistance"],
            ["Encombrement", "Hauteur : env. 220 mm | Profondeur : env. 250 mm"],
            ["Visserie", "Intégralement en Inox pour une protection anti-corrosion"]
        ]
    }'::jsonb,
    '[
        {
            "title": "Auvent en Aluminium",
            "description": "Protégez votre toile des salissures et de l''humidité lorsqu''elle est enroulée."
        },
        {
            "title": "Éclairage LED",
            "description": "Rampes LED fixées sous les bras pour transformer votre balcon en espace de vie nocturne."
        },
        {
            "title": "Motorisation Somfy®",
            "description": "Pilotage intelligent via technologie iO ou RTS pour une manipulation sans effort."
        },
        {
            "title": "Capteur Eolis 3D",
            "description": "Fermeture automatique du store en cas de détection de vent trop fort."
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
        "Solutions pour configurations complexes"
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
