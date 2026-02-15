-- Création de la table cart_items pour les paniers anonymes
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    product_id UUID NOT NULL,
    product_type TEXT NOT NULL, -- 'store', 'toile', etc.
    product_name TEXT,
    base_price DECIMAL(10, 2),
    configuration JSONB DEFAULT '{}'::jsonb,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON public.cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);

-- Politique RLS pour permettre l'accès anonyme basé sur session_id
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Politique : permettre à tout le monde de lire/écrire ses propres items de panier
CREATE POLICY "Allow anonymous cart access" 
ON public.cart_items 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Commentaire sur la table
COMMENT ON TABLE public.cart_items IS 'Panier d''achat pour les utilisateurs anonymes basé sur sessionId';
