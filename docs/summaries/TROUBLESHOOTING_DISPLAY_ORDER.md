# 🔧 Dépannage - Sauvegarde de l'ordre d'affichage

## Problème : "La table se met à jour puis ne sauvegarde pas"

### Diagnostic

1. **Vérifier que la colonne existe** :
   ```sql
   -- Dans Supabase SQL Editor
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'sb_products' 
     AND column_name = 'display_order';
   ```

2. **Vérifier les permissions RLS** :
   ```sql
   -- Vérifier si RLS est activé
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'sb_products';
   
   -- Voir les politiques existantes
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'sb_products';
   ```

3. **Tester l'API de permissions** :
   - Ouvrir : http://localhost:3000/api/admin/test-product-order-permissions
   - Vérifier que tous les tests passent (success: true)

### Solutions

#### Solution 1 : Exécuter les migrations SQL (OBLIGATOIRE)

Si la colonne n'existe pas encore :

```sql
-- Fichier: scripts/add-display-order-to-sb-products.sql
ALTER TABLE sb_products 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

WITH ordered_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
  FROM sb_products
)
UPDATE sb_products
SET display_order = ordered_products.row_num
FROM ordered_products
WHERE sb_products.id = ordered_products.id;

CREATE INDEX IF NOT EXISTS idx_sb_products_display_order ON sb_products(display_order);
```

#### Solution 2 : Configurer les permissions RLS

Si vous avez des erreurs de permissions :

```sql
-- Fichier: scripts/fix-sb-products-rls.sql

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Allow authenticated users to update sb_products" ON sb_products;
DROP POLICY IF EXISTS "Allow public read access to sb_products" ON sb_products;
DROP POLICY IF EXISTS "Allow authenticated users to insert sb_products" ON sb_products;
DROP POLICY IF EXISTS "Allow authenticated users to delete sb_products" ON sb_products;

-- Créer des politiques permissives
CREATE POLICY "Allow authenticated users to select sb_products"
ON sb_products FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update sb_products"
ON sb_products FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert sb_products"
ON sb_products FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete sb_products"
ON sb_products FOR DELETE USING (true);

-- Activer RLS
ALTER TABLE sb_products ENABLE ROW LEVEL SECURITY;
```

#### Solution 3 : Vérifier les variables d'environnement

Dans `.env.local`, vous devez avoir :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ⚠️ IMPORTANT pour bypasser RLS
```

**Note** : Le `SUPABASE_SERVICE_ROLE_KEY` est nécessaire pour les opérations admin.

#### Solution 4 : Utiliser la nouvelle API

Le système utilise maintenant une API dédiée qui bypass RLS :
- **Endpoint** : `/api/admin/update-product-order`
- **Méthode** : PUT
- **Auth** : Utilise le Service Role Key automatiquement

La page `/admin/product-order` a été mise à jour pour utiliser cette API au lieu d'appeler directement Supabase côté client.

### Vérification après corrections

1. **Tester l'API de permissions** :
   ```bash
   curl http://localhost:3000/api/admin/test-product-order-permissions
   ```
   
   Résultat attendu :
   ```json
   {
     "config": {
       "supabaseUrl": true,
       "supabaseServiceKey": true,
       "supabaseAnonKey": true
     },
     "tests": {
       "read": { "success": true, "count": 1 },
       "update": { "success": true },
       "columnExists": { "success": true }
     }
   }
   ```

2. **Tester l'interface** :
   - Aller sur http://localhost:3000/admin/product-order
   - Réorganiser quelques produits
   - Cliquer sur "💾 Sauvegarder l'ordre"
   - Vérifier le message : "✅ X produits mis à jour avec succès"
   - Rafraîchir la page → l'ordre doit être conservé

3. **Vérifier dans la base de données** :
   ```sql
   SELECT name, display_order 
   FROM sb_products 
   ORDER BY display_order ASC;
   ```

### Logs de débogage

Si le problème persiste, vérifier :

1. **Console navigateur** (F12) :
   - Chercher les erreurs réseau (onglet Network)
   - Chercher les erreurs JavaScript (onglet Console)
   - Vérifier la réponse de `/api/admin/update-product-order`

2. **Terminal du serveur Next.js** :
   - Chercher "❌ Erreur mise à jour produit"
   - Chercher "Erreur API update-product-order"

3. **Logs Supabase** :
   - Aller dans Supabase Dashboard → Logs
   - Chercher les requêtes UPDATE sur sb_products
   - Vérifier s'il y a des violations RLS

### Checklist complète

- [ ] Script SQL exécuté : `scripts/add-display-order-to-sb-products.sql`
- [ ] Permissions RLS configurées : `scripts/fix-sb-products-rls.sql`
- [ ] Variable `SUPABASE_SERVICE_ROLE_KEY` dans `.env.local`
- [ ] Serveur redémarré après ajout de la variable
- [ ] Test API permissions OK : `/api/admin/test-product-order-permissions`
- [ ] Interface drag-and-drop fonctionne : `/admin/product-order`
- [ ] Sauvegarde persiste après rafraîchissement
- [ ] Ordre visible dans le catalogue : `/store-banne`

### Exemple de test manuel

```bash
# 1. Tester l'API directement
curl -X PUT http://localhost:3000/api/admin/update-product-order \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"id": "1", "display_order": 10},
      {"id": "2", "display_order": 20}
    ]
  }'

# Réponse attendue:
# {"message":"2 produits mis à jour avec succès","results":[...]}
```

### Contact Support

Si rien ne fonctionne après avoir suivi toutes les étapes :

1. Exporter les logs :
   - Console navigateur (copier les erreurs)
   - Terminal serveur (copier les dernières lignes)
   - Résultat de `/api/admin/test-product-order-permissions`

2. Vérifier la configuration Supabase :
   - RLS activé/désactivé ?
   - Politiques configurées ?
   - Service Role Key correcte ?

---

**Dernière mise à jour** : 3 février 2026
