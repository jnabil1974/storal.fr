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
