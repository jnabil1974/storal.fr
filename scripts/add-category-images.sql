-- Add image columns to product_categories and product_subcategories tables

-- Add image URL column to product_categories
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Add image URL column to product_subcategories
ALTER TABLE product_subcategories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE product_subcategories ADD COLUMN IF NOT EXISTS image_alt TEXT;
