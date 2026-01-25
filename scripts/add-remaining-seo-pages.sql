-- Ajout des pages restantes qui seront intégrées progressivement

-- Ajouter Store Anti-Chaleur si absent
INSERT INTO seo_pages (slug, title, description, keywords, og_title, og_description, robots) 
VALUES (
  'products/store-antichaleur',
  'Stores Anti-Chaleur | Storal.fr',
  'Stores anti-chaleur pour fenêtres et vérandas. Réduction efficace de la température intérieure. Personnalisables.',
  'store anti-chaleur, fenêtre, véranda, isolation thermique, réduction température',
  'Stores Anti-Chaleur | Storal.fr',
  'Réduisez la température intérieure avec nos stores anti-chaleur premium',
  'index, follow'
) ON CONFLICT (slug) DO NOTHING;

-- Ajouter pages de contact/legal si absentes
INSERT INTO seo_pages (slug, title, description, keywords, og_title, og_description, robots) VALUES
(
  'contact',
  'Contactez-nous | Storal.fr',
  'Contactez notre équipe pour vos projets de stores et portes blindées. Devis gratuit et conseils personnalisés.',
  'contact, devis, conseil, stores, portes blindées',
  'Contactez Storal.fr',
  'Demandez votre devis gratuit pour vos stores et portes blindées',
  'index, follow'
),
(
  'cgv',
  'Conditions Générales de Vente | Storal.fr',
  'Conditions générales de vente et conditions d''utilisation du site Storal.fr',
  'CGV, conditions vente, légal',
  'CGV | Storal.fr',
  'Conditions de vente Storal.fr',
  'index, follow'
),
(
  'confidentialite',
  'Politique de Confidentialité | Storal.fr',
  'Politique de confidentialité et protection des données personnelles - RGPD',
  'confidentialité, données personnelles, RGPD, protection données',
  'Confidentialité | Storal.fr',
  'Protection de vos données personnelles',
  'index, follow'
),
(
  'mentions-legales',
  'Mentions Légales | Storal.fr',
  'Informations légales et éditeur du site Storal.fr',
  'mentions légales, éditeur, SIRET, contact',
  'Mentions Légales | Storal.fr',
  'Informations légales Storal.fr',
  'index, follow'
) ON CONFLICT (slug) DO NOTHING;
