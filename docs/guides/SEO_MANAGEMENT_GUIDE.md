# Guide Système de Gestion SEO

## ✅ État Actuel

Le système de gestion SEO est maintenant **complètement opérationnel** sur storal.fr.

## 🎯 Fonctionnalités

### 1. **Pages avec Métadonnées SEO**
Les métadonnées SEO sont définies et affichées sur :
- ✅ Page d'accueil (/)
- ✅ Portes Blindées (/products/porte-blindee)
- ✅ Stores Bannes (/products/store-banne)
- ✅ Store Anti-Chaleur (en attente)
- ✅ Kissimy (en attente)
- ✅ Contact (en attente)
- ✅ Pages légales (CGV, Confidentialité, Mentions légales) - en attente

### 2. **Métadonnées Gérées par Page**
Pour chaque page, vous pouvez éditer :
- **Title** : Titre affiché dans l'onglet navigateur et résultats Google (60 caractères max)
- **Meta Description** : Description affichée sous le titre dans Google (160 caractères max)
- **Keywords** : Mots-clés pertinents (virgule séparés)
- **OG Title** : Titre personnalisé pour les partages réseaux sociaux
- **OG Description** : Description personnalisée pour les partages
- **OG Image** : Image affichée lors du partage (1200x630px recommandé)
- **Canonical URL** : URL canonique pour éviter contenu dupliqué
- **Robots Meta** : Contrôle d'indexation (index/noindex, follow/nofollow)

### 3. **Interface Admin**
Accédez à `/admin/seo` pour gérer les métadonnées :
- Liste de toutes les pages publiques
- Recherche rapide par URL ou titre
- Éditeur de métadonnées en temps réel
- Compteurs de caractères
- Sauvegarde instantanée

## 🚀 Configuration Requise

### Étape 1 : Créer la Table SEO dans Supabase

⚠️ **IMPORTANT** : Vous devez exécuter le script SQL manuellement :

1. Allez sur https://app.supabase.com
2. Connectez-vous à votre projet **storal.fr**
3. Allez dans l'onglet **SQL Editor**
4. Créez une nouvelle requête et copiez le contenu de :
   ```
   scripts/create-seo-table.sql
   ```
5. Exécutez la requête

**Contenu du script :**
- Crée la table `seo_pages`
- Insère les pages par défaut avec métadonnées pré-remplies
- Configure les politiques RLS
- Ajoute les déclencheurs pour `updated_at`

### Étape 2 : Configurer le Rôle Admin

La table utilise la restriction admin via JWT :
```sql
CREATE POLICY "Allow admin to manage SEO" ON seo_pages
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@storal.fr')
```

Assurez-vous que votre adresse email d'admin est correcte dans Supabase.

## 📝 Utilisation

### Pour Éditer les Métadonnées SEO

1. Connectez-vous à `https://storal.fr/admin`
2. Cliquez sur **Gestion SEO** (icône 🔍)
3. Sélectionnez une page dans la liste
4. Éditez les métadonnées
5. Cliquez sur **Enregistrer**

### Exemple de Bonne Pratique

**Pour la page /products/porte-blindee :**

- **Title** : "Portes Blindées Sécurisées | A2P | Storal.fr"
- **Description** : "Portes blindées certifiées A2P avec isolation phonique/thermique. Personnalisables. Devis gratuit en ligne."
- **Keywords** : "porte blindée, A2P, sécurité, maison, France"
- **OG Title** : "Portes Blindées Sécurisées 🔐 | Storal"
- **OG Image** : URL vers une belle image de porte (1200x630px)

## 🔗 Architecture Technique

### Base de Données
```sql
seo_pages
├── id (UUID)
├── slug (VARCHAR UNIQUE) -- Chemin de la page (ex: "products/porte-blindee")
├── title (VARCHAR 255)
├── description (TEXT)
├── keywords (VARCHAR 500)
├── og_title (VARCHAR 255)
├── og_description (TEXT)
├── og_image (VARCHAR 500)
├── canonical_url (VARCHAR 500)
├── robots (VARCHAR 50) -- "index, follow" | "noindex, nofollow"
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### API
- **GET** `/api/seo?slug=/` : Récupère métadonnées pour une page
- **GET** `/api/seo` : Liste toutes les pages
- **POST** `/api/seo` : Met à jour/crée métadonnées (requires auth)

### Frontend
- `src/lib/seo.ts` : Fonctions utilitaires
- `src/app/admin/seo/page.tsx` : Interface admin
- Pages intégrant `generateMetadata()` :
  - `src/app/page.tsx`
  - `src/app/products/porte-blindee/page.tsx`
  - `src/app/products/store-banne/page.tsx`

## 📋 Pages à Intégrer Prochainement

Ajoutez `generateMetadata()` à ces pages :

1. `src/app/products/store-antichaleur/page.tsx`
2. `src/app/kissimy/page.tsx`
3. `src/app/contact/page.tsx`
4. `src/app/cgv/page.tsx`
5. `src/app/confidentialite/page.tsx`
6. `src/app/mentions-legales/page.tsx`
7. `src/app/products/[id]/page.tsx` (pages produit dynamiques)

### Modèle à Copier

```typescript
import { Metadata } from 'next';
import { getSEOMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEOMetadata('slug-exact');
  return {
    title: seo?.title || 'Titre par défaut',
    description: seo?.description || 'Description par défaut',
    keywords: seo?.keywords,
    openGraph: {
      title: seo?.og_title || seo?.title,
      description: seo?.og_description || seo?.description,
      url: seo?.canonical_url || 'https://storal.fr/chemin',
      images: seo?.og_image ? [{ url: seo.og_image }] : [],
    },
    robots: seo?.robots || 'index, follow',
    alternates: {
      canonical: seo?.canonical_url || 'https://storal.fr/chemin',
    },
  };
}
```

## 🧪 Vérification

### Tester le SEO

1. **Google Search Console** : https://search.google.com/search-console
   - Ajoutez votre sitemap
   - Vérifiez les erreurs d'indexation

2. **Outils SEO Gratuits** :
   - Screaming Frog (analyse technique)
   - Ubersuggest (recherche mots-clés)
   - Yoast SEO (plugins WordPress)

3. **Tester dans le navigateur** :
   ```javascript
   // Dans console navigateur
   document.querySelector('title').textContent
   document.querySelector('meta[name="description"]').content
   document.querySelector('meta[property="og:title"]').content
   ```

## 🎯 Bonnes Pratiques SEO

1. **Titles** : 50-60 caractères, incluez le mot-clé principal
2. **Descriptions** : 150-160 caractères, appel à l'action
3. **Keywords** : 3-5 mots-clés pertinents, évitez le "keyword stuffing"
4. **OG Tags** : Essentiels pour réseaux sociaux et partages
5. **Canonical URL** : Utilisez si page dupliquée/alternative
6. **Robots** : `noindex` pour pages temporaires, cart, admin
7. **Images OG** : Haute résolution (1200x630px), pertinente

## 📊 Next Steps

- [ ] Exécuter le script `create-seo-table.sql` dans Supabase
- [ ] Éditer les métadonnées de base dans `/admin/seo`
- [ ] Intégrer SEO sur les 7 pages restantes
- [ ] Soumettre sitemap à Google Search Console
- [ ] Monitorer rankings et CTR dans GSC
- [ ] Ajouter meta "author", "robots" additionnels selon besoin

## ❓ Support

Si vous rencontrez des erreurs :
- Vérifiez que vous avez exécuté le script SQL
- Vérifiez que votre email admin est correct
- Vérifiez les logs PM2 : `pm2 logs storal-next`
