-- Create SEO metadata table
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  keywords VARCHAR(500),
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  canonical_url VARCHAR(500),
  robots VARCHAR(50) DEFAULT 'index, follow',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default pages
INSERT INTO seo_pages (slug, title, description, keywords, og_title, og_description, robots) VALUES
('/', 'Storal.fr - Stores et Fermetures sur mesure', 'Créez vos stores, portes blindées et fermetures sur mesure', 'stores, portes blindées, fermetures, stores bannes', 'Storal.fr - Stores et Fermetures', 'Vos solutions de stores et portes blindées personnalisées', 'index, follow'),
('products/porte-blindee', 'Portes Blindées sur mesure | Storal.fr', 'Portes blindées sécurisées, certifiées A2P avec isolation phonique et thermique. Personnalisables en dimensions et finitions.', 'porte blindée, sécurité, A2P, certification', 'Portes Blindées Sécurisées | Storal.fr', 'Protection maximale avec certification A2P', 'index, follow'),
('products/store-banne', 'Stores Bannes sur mesure | Storal.fr', 'Stores bannes élégants pour terrasses et balcons. Personnalisables en dimensions, coloris et motorisation.', 'store banne, terrasse, balcon, store motorisé', 'Stores Bannes Personnalisés | Storal.fr', 'Protégez votre terrasse avec nos stores bannes', 'index, follow'),
('products/store-antichaleur', 'Stores Anti-Chaleur | Storal.fr', 'Stores anti-chaleur pour fenêtres et vérandas. Réduction efficace de la température intérieure.', 'store anti-chaleur, fenêtre, véranda, isolation', 'Stores Anti-Chaleur | Storal.fr', 'Réduisez la température intérieure efficacement', 'index, follow'),
('kissimy', 'Store Banne Kissimy motorisée | Storal.fr', 'Store banne motorisée Kissimy avec télécommande. Installation facile sur balcon ou terrasse.', 'store kissimy, store motorisé, store balcon', 'Store Kissimy Motorisée | Storal.fr', 'Store banne motorisée de qualité premium', 'index, follow'),
('contact', 'Contactez-nous | Storal.fr', 'Contactez nos experts pour vos projets de stores et portes blindées. Devis gratuit et conseils personnalisés.', 'contact, devis, conseil, stores', 'Contactez Storal.fr', 'Demandez votre devis gratuit', 'index, follow'),
('cart', 'Panier | Storal.fr', 'Votre panier d''achat - Storal.fr', 'panier, achat, commander', 'Panier | Storal.fr', 'Consultez votre panier', 'noindex, nofollow'),
('checkout', 'Passer la commande | Storal.fr', 'Finalisez votre commande en toute sécurité', 'commande, paiement, sécurisé', 'Commande | Storal.fr', 'Finalisez votre achat', 'noindex, nofollow'),
('my-orders', 'Mes commandes | Storal.fr', 'Consultez l''historique de vos commandes', 'commandes, historique, compte', 'Mes Commandes | Storal.fr', 'Suivi de vos commandes', 'noindex, nofollow'),
('confidentialite', 'Politique de Confidentialité | Storal.fr', 'Politique de confidentialité et protection des données personnelles', 'confidentialité, données personnelles, RGPD', 'Confidentialité | Storal.fr', 'Protection de vos données', 'index, follow'),
('cgv', 'Conditions Générales de Vente | Storal.fr', 'Conditions générales de vente et conditions d''utilisation du site', 'CGV, conditions, légal', 'CGV | Storal.fr', 'Conditions de vente', 'index, follow'),
('mentions-legales', 'Mentions Légales | Storal.fr', 'Informations légales et éditeur du site Storal.fr', 'mentions légales, éditeur, SIRET', 'Mentions Légales | Storal.fr', 'Informations éditeur', 'index, follow')
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON seo_pages
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to read" ON seo_pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to manage SEO" ON seo_pages
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@storal.fr')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@storal.fr');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_seo_pages_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER seo_pages_updated_at
  BEFORE UPDATE ON seo_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_seo_pages_timestamp();
