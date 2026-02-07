-- Fix RLS policies for matest_finish_types table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.matest_finish_types;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.matest_finish_types;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.matest_finish_types;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.matest_finish_types;

-- Create policies for full access
CREATE POLICY "Enable read access for all users" ON public.matest_finish_types
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.matest_finish_types
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.matest_finish_types
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.matest_finish_types
  FOR DELETE USING (true);
