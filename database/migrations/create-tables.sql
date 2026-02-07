-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_svg TEXT,
  gradient_from VARCHAR(50),
  gradient_to VARCHAR(50),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_subcategories table
CREATE TABLE IF NOT EXISTS product_subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Add column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES product_subcategories(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_product_subcategories_category_id ON product_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);

-- Insert categories
INSERT INTO product_categories (slug, name, display_name, description, gradient_from, gradient_to, order_index)
VALUES
  ('store-banne', 'store_banne', 'Stores Bannes', 'Protection solaire élégante pour terrasses et balcons', 'orange-100', 'yellow-100', 1),
  ('store-antichaleur', 'store_antichaleur', 'Stores Anti-Chaleur', 'Solutions thermiques pour fenêtres et vérandas', 'red-100', 'orange-100', 2),
  ('porte-blindee', 'porte_blindee', 'Portes Blindées', 'Sécurité maximale avec certification A2P', 'gray-100', 'slate-100', 3)
ON CONFLICT (slug) DO NOTHING;
