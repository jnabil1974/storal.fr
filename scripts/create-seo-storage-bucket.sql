-- Create storage bucket for SEO images
-- Run this in Supabase SQL Editor

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('seo-images', 'seo-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable public access for reading
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'seo-images');

-- Allow authenticated users to upload to seo-images
CREATE POLICY "Allow authenticated uploads to seo-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'seo-images' AND auth.role() = 'authenticated');

-- Allow admin to delete
CREATE POLICY "Allow admin to delete seo images" ON storage.objects
  FOR DELETE USING (bucket_id = 'seo-images' AND auth.jwt() ->> 'email' = 'admin@storal.fr');
