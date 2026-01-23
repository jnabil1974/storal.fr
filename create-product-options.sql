-- Create option groups table
CREATE TABLE IF NOT EXISTS product_option_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  display_order INT DEFAULT 0,
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create options table
CREATE TABLE IF NOT EXISTS product_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES product_option_groups(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, slug)
);

-- Create product option availability table
CREATE TABLE IF NOT EXISTS product_option_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES product_options(id) ON DELETE CASCADE,
  price_override DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, option_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_option_groups_slug ON product_option_groups(slug);
CREATE INDEX IF NOT EXISTS idx_options_group ON product_options(group_id);
CREATE INDEX IF NOT EXISTS idx_option_availability_product ON product_option_availability(product_id);

-- Insert option groups
INSERT INTO product_option_groups (name, slug, description, is_required, display_order)
VALUES
  ('Type de toile', 'fabric', 'Choix de toile', TRUE, 1),
  ('Motorisation', 'motorization', 'Manuel ou motorisé', TRUE, 2),
  ('Finitions', 'finishes', 'Options de finition', FALSE, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert fabric options
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toile Acrylique Standard', 'acrylic-standard', 0, 1 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toile Acrylique Premium', 'acrylic-premium', 150, 2 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toile Microfibre', 'microfiber', 250, 3 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Toile Polyester Imperméable', 'polyester-waterproof', 200, 4 FROM product_option_groups WHERE slug = 'fabric'
ON CONFLICT (group_id, slug) DO NOTHING;

-- Insert motorization options
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Manuel (chaîne)', 'manual-chain', 0, 1 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Motorisation standard', 'motorized-standard', 350, 2 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Motorisation + Télécommande', 'motorized-remote', 500, 3 FROM product_option_groups WHERE slug = 'motorization'
ON CONFLICT (group_id, slug) DO NOTHING;

-- Insert finish options
INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Protection anti-UV renforcée', 'uv-protection', 100, 1 FROM product_option_groups WHERE slug = 'finishes'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Revêtement hydrophobe', 'hydrophobic', 120, 2 FROM product_option_groups WHERE slug = 'finishes'
ON CONFLICT (group_id, slug) DO NOTHING;

INSERT INTO product_options (group_id, name, slug, price_adjustment, display_order)
SELECT id, 'Traitement ignifuge', 'fireproof', 150, 3 FROM product_option_groups WHERE slug = 'finishes'
ON CONFLICT (group_id, slug) DO NOTHING;
