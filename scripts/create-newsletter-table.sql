-- Création de la table newsletter
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active' -- active, unsubscribed
);

-- Index for email lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter(status);

-- Colonnes pour double opt-in et désinscription
ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP NULL;
ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255) NULL;
ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS unsubscribe_token VARCHAR(255) NULL;
ALTER TABLE newsletter ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS idx_newsletter_verified_at ON newsletter(verified_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_verification_token ON newsletter(verification_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_unsubscribe_token ON newsletter(unsubscribe_token);

-- Activer la RLS
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Nettoyage des anciennes policies
DROP POLICY IF EXISTS "Public can insert newsletter" ON newsletter;
DROP POLICY IF EXISTS "Admins can manage newsletter" ON newsletter;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter;
DROP POLICY IF EXISTS "Admins can read newsletter" ON newsletter;

-- Autoriser l'insert pour les rôles anon/auth (utilisé par l'API newsletter)
CREATE POLICY "Newsletter insert" ON newsletter
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Autoriser la lecture aux utilisateurs authentifiés (dashboard admin passe par Supabase auth)
CREATE POLICY "Newsletter select" ON newsletter
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Newsletter update" ON newsletter
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Newsletter delete" ON newsletter
  FOR DELETE
  TO authenticated
  USING (true);
