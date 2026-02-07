## Mise à jour: Gestion des Types de Finition Matest

### Qu'est-ce qui a changé ?

Les types de finition (brillant, sablé, mat, promo, spéciale) sont maintenant **gérés depuis la base de données** au lieu d'être codés en dur dans l'interface.

**Nouveau:** Chaque type peut être associé à des produits spécifiques (stores) via des cases à cocher.

### Étapes pour activer cette fonctionnalité

#### 1. Exécuter la migration SQL

Accédez à votre Dashboard Supabase et exécutez le contenu du fichier:
```bash
scripts/add-matest-finish-types.sql
```

Ou copie colle ce code dans l'SQL Editor:
```sql
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

-- Insert default finish types
INSERT INTO public.matest_finish_types (name, order_index) VALUES
  ('brillant', 1),
  ('sablé', 2),
  ('mat', 3),
  ('promo', 4),
  ('spéciale', 5)
ON CONFLICT (name) DO NOTHING;
```

**Si la table existe déjà**, exécutez plutôt:
```bash
scripts/add-product-slugs-to-finish-types.sql
```

#### 2. Redémarrer le serveur Next.js

```bash
npm run dev
```

### Nouvelles fonctionnalités

#### ✅ Ajouter un type de finition
- Rendez-vous sur `/admin/matest-colors`
- Cliquez sur **"+ Ajouter type"**
- Remplissez les champs:
  - **Nom du type** (ex: "mat lisse")
  - **Icône** optionnelle (ex: 🎨)
  - **Couleur** en hex optionnelle (ex: #ff6b6b)
- **Nouveau:** Cochez les produits compatibles (stores) pour ce type
- Cliquez sur **"Créer"**

#### ✅ Modifier un type
- Cliquez sur l'icône **"✏️"** à côté du type
- Modifiez les informations (nom, icône, couleur)
- Cochez/décochez les produits compatibles
- Cliquez sur **"Enregistrer"**

#### ✅ Supprimer un type
- Cliquez sur le **"✕"** à côté du type dans la section "Types de finition"
- Le type sera supprimé de la liste

#### ✅ Association produits
- Chaque type peut être associé à un ou plusieurs stores bannes
- Les cases à cocher permettent de sélectionner facilement les produits compatibles
- Le nombre de produits associés s'affiche entre parenthèses

#### ✅ Utiliser les types
- Lors de l'ajout ou modification d'une couleur, le dropdown **"Type"** affichera tous les types créés
- Les icônes et noms seront affichés dynamiquement

### Fichiers modifiés

- `src/app/admin/matest-colors/page.tsx` - Interface complète avec gestion des produits compatibles
- `src/app/api/admin/matest-finish-types/route.ts` - API CRUD (GET, POST, PUT, DELETE) avec product_slugs
- `src/app/api/admin/products/route.ts` - Nouvelle API pour récupérer la liste des produits
- `scripts/add-matest-finish-types.sql` - Migration SQL initiale
- `scripts/add-product-slugs-to-finish-types.sql` - Migration pour ajouter la colonne product_slugs

### Avantages

✅ Gestion flexible des types sans modification du code  
✅ Ajout/modification/suppression en un clic depuis l'interface admin  
✅ Possibilité d'ajouter des icônes et couleurs aux types  
✅ **Association directe entre types et produits via cases à cocher**  
✅ **Filtrage futur possible: afficher uniquement les types compatibles avec un produit**  
✅ Fallback automatique aux types par défaut si la BDD est vide
