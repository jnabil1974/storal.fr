-- Create product_toile_colors table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.product_toile_colors (
  id BIGSERIAL PRIMARY KEY,
  option_id BIGINT NOT NULL REFERENCES public.product_options(id) ON DELETE CASCADE,
  color_name VARCHAR(255) NOT NULL,
  color_hex VARCHAR(7) NOT NULL DEFAULT '#000000',
  price_adjustment NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(option_id, color_name)
);

-- Grant permissions
GRANT SELECT ON public.product_toile_colors TO anon;
GRANT SELECT ON public.product_toile_colors TO authenticated;
GRANT ALL ON public.product_toile_colors TO service_role;

-- Insert sample colors for common toile options (colors by colorFamily)
-- White family - option_id will vary, adjust based on actual IDs
DO $$
DECLARE 
  v_toile_id BIGINT;
BEGIN
  -- Get a sample toile option ID (adjust this query to match your actual data)
  SELECT id INTO v_toile_id FROM public.product_options WHERE name ILIKE '%toile%' OR category = 'Toile' LIMIT 1;
  
  IF v_toile_id IS NOT NULL THEN
    INSERT INTO public.product_toile_colors (option_id, color_name, color_hex, price_adjustment) VALUES
      (v_toile_id, 'Blanc', '#FFFFFF', 0),
      (v_toile_id, 'Gris clair', '#D3D3D3', 0),
      (v_toile_id, 'Gris foncé', '#808080', 5),
      (v_toile_id, 'Marron', '#8B4513', 15),
      (v_toile_id, 'Noir', '#000000', 20),
      (v_toile_id, 'Bleu', '#0066CC', 10),
      (v_toile_id, 'Vert', '#228B22', 10),
      (v_toile_id, 'Beige', '#F5DEB3', 0)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
