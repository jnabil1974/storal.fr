-- Création de la table newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active' -- active, unsubscribed
);

-- Enable RLS
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Only admins can read all
CREATE POLICY "Admins can read newsletter" ON newsletter
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'email' = 'admin@storal.fr');

-- Index for email lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter(status);
