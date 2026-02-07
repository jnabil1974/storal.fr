-- Create matest_finish_types table
CREATE TABLE IF NOT EXISTS public.matest_finish_types (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  product_slugs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.matest_finish_types ENABLE ROW LEVEL SECURITY;

-- Create policies for full access (adjust based on your auth needs)
CREATE POLICY "Enable read access for all users" ON public.matest_finish_types
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.matest_finish_types
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.matest_finish_types
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.matest_finish_types
  FOR DELETE USING (true);

-- Insert default finish types
INSERT INTO public.matest_finish_types (name, order_index) VALUES
  ('brillant', 1),
  ('sablé', 2),
  ('mat', 3),
  ('promo', 4),
  ('spéciale', 5)
ON CONFLICT (name) DO NOTHING;
