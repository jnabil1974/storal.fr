-- Create hero carousel slides table
CREATE TABLE IF NOT EXISTS hero_slides (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  button_text VARCHAR(100),
  button_link VARCHAR(500),
  image_url VARCHAR(500),
  bg_gradient VARCHAR(100) DEFAULT 'from-blue-500 to-blue-600',
  text_color VARCHAR(50) DEFAULT 'text-white',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default slides
INSERT INTO hero_slides (title, subtitle, description, button_text, button_link, bg_gradient, text_color, display_order, is_active) VALUES
('Stores Bannes sur Mesure', 'Protection Solaire Élégante', 'Créez votre store banne personnalisé en quelques clics. Dimensions, coloris et motorisation au choix.', 'Configurer mon store', '/products/store-banne', 'from-orange-500 to-yellow-500', 'text-white', 1, true),
('Portes Blindées Certifiées A2P', 'Sécurité Maximale pour Votre Domicile', 'Protection renforcée avec certification A2P. Isolation phonique et thermique incluse.', 'Découvrir les portes', '/products/porte-blindee', 'from-gray-700 to-slate-600', 'text-white', 2, true),
('Stores Anti-Chaleur', 'Réduisez la Température Intérieure', 'Solutions thermiques efficaces pour fenêtres et vérandas. Confort garanti.', 'Voir les modèles', '/products/store-antichaleur', 'from-red-500 to-orange-500', 'text-white', 3, true);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON hero_slides
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to read all" ON hero_slides
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to manage slides" ON hero_slides
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@storal.fr')
  WITH CHECK (auth.jwt() ->> 'email' = 'admin@storal.fr');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_hero_slides_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_slides_timestamp();
