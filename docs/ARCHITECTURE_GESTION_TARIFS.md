# 🏗️ Architecture Système de Gestion des Tarifs Storal

> **Date**: 21 février 2026  
> **Version**: 1.0.0  
> **Objectif**: Gestion centralisée des prix d'achat et coefficients de vente avec génération automatique du fichier `catalog-data.ts`

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Base de Données](#architecture-base-de-données)
3. [Structure des Fichiers](#structure-des-fichiers)
4. [Flux de Travail](#flux-de-travail)
5. [Interface Admin](#interface-admin)
6. [Sécurité](#sécurité)
7. [Avantages](#avantages)
8. [Workflow Pratique](#workflow-pratique)
9. [Commandes Utiles](#commandes-utiles)
10. [Migration Future](#migration-future)

---

## 🎯 Vue d'ensemble

### Problématique Actuelle

- Prix d'achat HT en dur dans le code (`catalog-data.ts`)
- Modification des marges = modifier le code manuellement
- Risque d'erreurs lors des mises à jour
- Pas d'historique des changements de prix

### Solution Proposée

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE GLOBALE                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  catalog-data    │ ──Import──┐
│  .backup.ts      │           │
│ (Prix d'achat HT)│           ▼
└──────────────────┘    ┌─────────────┐      ┌──────────────┐
                        │   SQLite    │◄─────│ Interface    │
                        │  Database   │      │   Admin      │
                        │   (Local)   │──────►│ (localhost)  │
                        └─────────────┘      └──────────────┘
                               │
                               │ Génération
                               ▼
                        ┌─────────────┐
                        │catalog-data │
                        │    .ts      │
                        │  (Généré)   │
                        └─────────────┘
                               │
                               │ Git Push
                               ▼
                        ┌─────────────┐
                        │ PRODUCTION  │
                        │  (Statique) │
                        └─────────────┘
```

### Principes Clés

✅ **DB Locale uniquement** : SQLite sur machine de développement  
✅ **Production statique** : Reçoit uniquement `catalog-data.ts`  
✅ **Aucune dépendance DB en prod** : Pas de connexion, pas de secrets  
✅ **Git est la source de vérité** : Historique complet des prix  
✅ **Évolutif** : Prêt pour stores, portes, fermetures, etc.

---

## 🗄️ Architecture Base de Données

### Choix Technologique : SQLite

**Pourquoi SQLite ?**

| Critère | SQLite | PostgreSQL | Verdict |
|---------|--------|------------|---------|
| Configuration | ✅ Zéro (1 fichier) | ❌ Serveur requis | **SQLite** |
| Performance (local) | ✅ Excellent | ⚠️ Latence réseau | **SQLite** |
| Concurrence | ⚠️ 1 utilisateur | ✅ Multi-users | **SQLite** (usage admin seul) |
| Backup | ✅ Copier fichier | ⚠️ pg_dump | **SQLite** |
| Migration future | ✅ Prisma compatible | ✅ Prisma compatible | **Égalité** |
| Production | N/A (pas utilisé) | N/A (pas utilisé) | **Égalité** |

**Conclusion** : SQLite est parfait pour ce cas d'usage (1 admin, local, pas de prod DB)

### Schéma Prisma (SQLite)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// ============================================
// MODÈLE PRODUIT (Store, Porte, Fermeture...)
// ============================================
model Product {
  id                String   @id @default(uuid())
  modelId           String   @unique // "kissimy_promo", "kitanguy", etc.
  name              String
  slug              String   @unique
  productType       String   @default("store") // "store", "door", "shutter"
  salesCoefficient  Float    @default(1.8) // Coefficient de marge global du produit
  isActive          Boolean  @default(true)
  isPromo           Boolean  @default(false)
  
  // Relations
  prices            ProductPrice[]
  optionCoefficients OptionCoefficient[]
  
  // Audit
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([productType])
  @@index([isActive])
}

// ============================================
// GRILLE DES PRIX D'ACHAT HT
// ============================================
model ProductPrice {
  id          String  @id @default(uuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Dimensions
  projection  Int     // Avancée en mm (1500, 1750, 2000, etc.)
  maxWidth    Int     // Largeur max en mm (2470, 3650, 4830, etc.)
  
  // Prix fournisseur
  priceHT     Float   // Prix d'achat HT fournisseur (€)
  
  // Metadata
  supplierRef String? // Référence fournisseur (optionnel)
  notes       String? // Notes internes
  
  updatedAt   DateTime @updatedAt
  
  @@unique([productId, projection, maxWidth])
  @@index([productId])
}

// ============================================
// COEFFICIENTS PAR OPTION
// ============================================
model OptionCoefficient {
  id          String  @id @default(uuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  optionType  String  // "LED_ARMS", "LED_CASSETTE", "LAMBREQUIN_FIXE", etc.
  coefficient Float   @default(1.0) // Coefficient de marge pour cette option
  
  description String? // Description de l'option
  updatedAt   DateTime @updatedAt
  
  @@unique([productId, optionType])
  @@index([productId])
}

// ============================================
// COEFFICIENTS GLOBAUX
// ============================================
model GlobalCoefficient {
  id          String   @id @default(uuid())
  key         String   @unique // "DEFAULT_MARGIN", "PROMO_MARGIN", "PREMIUM_MARGIN"
  value       Float    // Valeur du coefficient (ex: 1.8)
  description String?  // Description du coefficient
  category    String?  // "margin", "vat", "shipping", etc.
  
  updatedAt   DateTime @updatedAt
  
  @@index([category])
}

// ============================================
// HISTORIQUE DES GÉNÉRATIONS
// ============================================
model CatalogGeneration {
  id           String   @id @default(uuid())
  version      String   // Format: "YYYY-MM-DD-HHmmss" (ex: "2026-02-21-143022")
  generatedAt  DateTime @default(now())
  generatedBy  String?  // Email ou nom de l'admin
  
  // Statistiques
  productsCount Int     // Nombre de produits traités
  pricesCount   Int     // Nombre total de prix générés
  fileSize      Int?    // Taille du fichier catalog-data.ts en bytes
  
  // Statut
  status       String   // "success", "error", "partial"
  errorLog     String?  // Logs d'erreur si échec
  
  // Metadata
  gitCommit    String?  // Hash du commit git associé
  notes        String?  // Notes supplémentaires
  
  @@index([generatedAt])
  @@index([status])
}

// ============================================
// PRIX DE FIXATION PLAFOND
// ============================================
model CeilingMountPrice {
  id          String  @id @default(uuid())
  productId   String
  
  maxWidth    Int     // Largeur max concernée (mm)
  priceHT     Float   // Prix fixation plafond HT (€)
  
  updatedAt   DateTime @updatedAt
  
  @@index([productId])
}
```

### Migrations Prisma

```bash
# Créer la migration initiale
npx prisma migrate dev --name init

# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface DB)
npx prisma studio
```

---

## 📁 Structure des Fichiers

```
storal.fr/
│
├── prisma/
│   ├── schema.prisma              ✅ Schéma SQLite ci-dessus
│   ├── dev.db                     ✅ Base de données (généré)
│   └── migrations/
│       └── YYYYMMDD_init/
│           └── migration.sql
│
├── scripts/
│   └── pricing/
│       ├── import-prices.ts       ✅ Import depuis catalog-data.backup.ts
│       ├── generate-catalog.ts    ✅ Génère catalog-data.ts depuis DB
│       ├── seed-defaults.ts       ✅ Coefficients par défaut
│       └── validate-prices.ts     ⚙️ Validation cohérence prix
│
├── src/
│   ├── lib/
│   │   ├── catalog-data.ts        ⚠️ GÉNÉRÉ AUTOMATIQUEMENT (ne pas éditer!)
│   │   ├── catalog-data.backup.ts ✅ Source originale (prix d'achat HT)
│   │   └── pricing/
│   │       ├── db-client.ts       ✅ Client Prisma singleton
│   │       ├── queries.ts         ✅ Fonctions lecture DB
│   │       └── calculator.ts      ✅ Calcul prix avec coefficients
│   │
│   ├── app/
│   │   ├── admin/
│   │   │   └── pricing/
│   │   │       ├── page.tsx                   ✅ Dashboard tarifs
│   │   │       ├── products/
│   │   │       │   └── [id]/page.tsx          ✅ Édition produit
│   │   │       ├── coefficients/page.tsx      ✅ Coefficients globaux
│   │   │       └── history/page.tsx           ✅ Historique générations
│   │   │
│   │   └── api/
│   │       └── admin/
│   │           └── pricing/
│   │               ├── products/route.ts      ✅ CRUD produits
│   │               ├── prices/route.ts        ✅ CRUD prix
│   │               ├── coefficients/route.ts  ✅ CRUD coefficients
│   │               └── generate/route.ts      ✅ Génération catalog-data.ts
│   │
│   └── generated/
│       └── prisma/                ✅ Client Prisma (généré)
│
├── docs/
│   ├── ARCHITECTURE_GESTION_TARIFS.md  📝 Ce fichier
│   └── GUIDE_COEFFICIENTS_ADMIN.md     📝 Guide utilisateur admin
│
└── package.json
```

---

## 🔄 Flux de Travail

### Phase 1 : Initialisation (Une seule fois)

```bash
# 1. Créer le schéma SQLite
npx prisma migrate dev --name init

# 2. Importer les prix d'achat depuis backup
npm run pricing:import
# → Lit catalog-data.backup.ts
# → Insère ~348 prix d'achat HT dans SQLite
# → Crée 15 produits avec coefficients par défaut

# 3. Seed coefficients globaux
npm run pricing:seed
# → Crée coefficients: DEFAULT_MARGIN (1.8), PROMO_MARGIN (1.4), etc.

# 4. Générer premier catalog-data.ts
npm run pricing:generate
# → Lit DB SQLite
# → Calcule tous les prix de vente
# → Génère catalog-data.ts (production-ready)
```

**Résultat** : 
- ✅ SQLite avec 348 prix d'achat
- ✅ 15 produits avec coefficients
- ✅ catalog-data.ts généré et fonctionnel

### Phase 2 : Utilisation Quotidienne (Local)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. MODIFICATION COEFFICIENTS (Interface Admin)             │
└─────────────────────────────────────────────────────────────┘
http://localhost:3000/admin/pricing
→ Admin modifie coefficient KITANGUY: 1.8 → 1.9
→ Click "Sauvegarder" → UPDATE dans SQLite

┌─────────────────────────────────────────────────────────────┐
│ 2. GÉNÉRATION NOUVEAU CATALOG                               │
└─────────────────────────────────────────────────────────────┘
Click "Générer catalog-data.ts"
→ Script lit SQLite
→ Calcule 348 prix avec nouveaux coefficients
→ Génère catalog-data.ts (45KB)
→ Affiche: "✅ 348 prix recalculés en 0.3s"

┌─────────────────────────────────────────────────────────────┐
│ 3. VALIDATION + COMMIT                                      │
└─────────────────────────────────────────────────────────────┘
$ git diff src/lib/catalog-data.ts
# Vérifier les changements de prix

$ git add src/lib/catalog-data.ts
$ git commit -m "fix: augmenter marge KITANGUY à 1.9 (+5.56%)"
$ git push origin main

┌─────────────────────────────────────────────────────────────┐
│ 4. DÉPLOIEMENT PRODUCTION                                   │
└─────────────────────────────────────────────────────────────┘
$ ssh ubuntu@51.210.244.26 "cd /var/www/storal.fr && git pull && pm2 restart storal-fr"

✅ Nouveaux prix en ligne en 10 secondes !
```

### Phase 3 : Production (Serveur)

```
┌─────────────────────────────────────────────────────────────┐
│ PRODUCTION: AUCUNE BASE DE DONNÉES                          │
└─────────────────────────────────────────────────────────────┘

Production reçoit UNIQUEMENT:
- catalog-data.ts (fichier statique TypeScript)
- Pas de SQLite sur le serveur
- Pas de connexion DB
- Pas de secrets/credentials
- Build Next.js standard
- PM2 restart → Nouveaux prix actifs

AVANTAGES:
✅ Zero latence (pas de requête DB)
✅ Ultra sécurisé (pas de DB exposée)
✅ Simple à déployer (git pull + restart)
✅ Rollback facile (git revert + restart)
```

---

## 🎨 Interface Admin

### Page Principale : Dashboard Tarifs

```
┌────────────────────────────────────────────────────────────┐
│ 💰 Gestion des Tarifs Storal                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ 📊 COEFFICIENTS GLOBAUX                                   │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Marge Standard:     [1.80] ───────────── [💾 Sauver]  ││
│ │ Marge Promo:        [1.40] ───────────── [💾 Sauver]  ││
│ │ Marge Premium:      [2.20] ───────────── [💾 Sauver]  ││
│ │ TVA Réduite:        [1.10] ───────────── [💾 Sauver]  ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ 🏗️ PRODUITS (15 stores)                    [+ Ajouter]   │
│ ┌────────────────────────────────────────────────────────┐│
│ │ ☑️ STORAL COMPACT (Promo)                             ││
│ │    Coeff: 1.40  |  348 prix  |  Actif                ││
│ │    [✏️ Éditer] [📊 Voir Prix] [🔄 Recalculer]        ││
│ │                                                        ││
│ │ ☑️ STORAL COMPACT +                                   ││
│ │    Coeff: 1.80  |  16 prix  |  Actif                 ││
│ │    [✏️ Éditer] [📊 Voir Prix] [🔄 Recalculer]        ││
│ │                                                        ││
│ │ ☑️ STORAL SELECT                                      ││
│ │    Coeff: 1.90  |  20 prix  |  Actif                 ││
│ │    [✏️ Éditer] [📊 Voir Prix] [🔄 Recalculer]        ││
│ │                                                        ││
│ │ ... (12 autres produits)                              ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ 🚀 ACTIONS GLOBALES                                       │
│ [📥 Importer Prix] [🔄 Recalculer Tout] [💾 Générer Catalog]│
│                                                            │
│ 📜 DERNIÈRES GÉNÉRATIONS                                  │
│ ┌────────────────────────────────────────────────────────┐│
│ │ 2026-02-21 14:30 | 348 prix | 45KB | ✅ Success      ││
│ │ 2026-02-20 09:15 | 348 prix | 44KB | ✅ Success      ││
│ │ 2026-02-19 16:45 | 348 prix | 44KB | ⚠️ Partial       ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Page Édition Produit

```
┌────────────────────────────────────────────────────────────┐
│ ✏️ Édition: STORAL COMPACT + (kitanguy)                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ 📝 INFORMATIONS GÉNÉRALES                                 │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Nom:             [STORAL COMPACT +              ]     ││
│ │ Slug:            [store-banne-coffre-compact-re...]   ││
│ │ Model ID:        [kitanguy                      ]     ││
│ │ Type Produit:    [🔽 Store Banne               ]     ││
│ │ Actif:           ☑️ Produit visible sur le site       ││
│ │ Promo:           ☐ Afficher badge promo               ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ 💰 COEFFICIENT DE VENTE                                   │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Marge du produit: [1.80] ──────────── [💾 Sauver]    ││
│ │                                                        ││
│ │ 💡 Simulation:                                         ││
│ │   Prix achat: 1353€ HT                                ││
│ │   × Coefficient: 1.80                                 ││
│ │   = Prix vente: 2435€ HT                              ││
│ │   + TVA 10%: 2678€ TTC                                ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ 📋 GRILLE DES PRIX D'ACHAT HT (16 entrées)               │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Avancée 1500mm                                         ││
│ │   ├─ ≤ 2470mm:  1353€ → Vente: 2678€ TTC [✏️ Éditer]││
│ │   ├─ ≤ 3650mm:  1435€ → Vente: 2839€ TTC [✏️ Éditer]││
│ │   ├─ ≤ 4830mm:  1561€ → Vente: 3088€ TTC [✏️ Éditer]││
│ │   ├─ ≤ 5610mm:  1657€ → Vente: 3278€ TTC [✏️ Éditer]││
│ │   └─ ≤ 5850mm:  1794€ → Vente: 3549€ TTC [✏️ Éditer]││
│ │                                                        ││
│ │ Avancée 1750mm                                         ││
│ │   ├─ ≤ 2470mm:  1388€ → Vente: 2746€ TTC [✏️ Éditer]││
│ │   └─ ... (5 entrées)                                  ││
│ │                                                        ││
│ │ ... (autres avancées)                                  ││
│ │                                                        ││
│ │ [+ Ajouter Palier]                                     ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ⚙️ COEFFICIENTS OPTIONS                                   │
│ ┌────────────────────────────────────────────────────────┐│
│ │ LED Bras:            [1.80] ──────── [💾 Sauver]     ││
│ │ LED Coffre:          [1.80] ──────── [💾 Sauver]     ││
│ │ Lambrequin Fixe:     [1.80] ──────── [💾 Sauver]     ││
│ │ Lambrequin Enroul.:  [1.80] ──────── [💾 Sauver]     ││
│ │ Fixation Plafond:    [1.00] ──────── [💾 Sauver]     ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ [💾 Sauvegarder Tout] [🔄 Recalculer Prix] [❌ Annuler]   │
└────────────────────────────────────────────────────────────┘
```

### Modale Génération Catalog

```
┌────────────────────────────────────────────────────────────┐
│ 🚀 Génération catalog-data.ts                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ⚙️ Génération en cours...                                 │
│                                                            │
│ [████████████████░░░░░░░░] 75%                            │
│                                                            │
│ ✅ Produits chargés: 15/15                                │
│ ✅ Prix calculés: 261/348                                 │
│ ⏱️ Temps écoulé: 2.3s                                     │
│                                                            │
│ 📝 Logs:                                                  │
│ ┌────────────────────────────────────────────────────────┐│
│ │ [14:30:22] Connexion SQLite OK                         ││
│ │ [14:30:22] Lecture 15 produits actifs                  ││
│ │ [14:30:23] Calcul prix STORAL COMPACT (23 entrées)    ││
│ │ [14:30:23] Calcul prix STORAL COMPACT + (16 entrées)  ││
│ │ [14:30:24] Calcul prix STORAL SELECT (20 entrées)     ││
│ │ ...                                                     ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
└────────────────────────────────────────────────────────────┘

Après succès:
┌────────────────────────────────────────────────────────────┐
│ ✅ catalog-data.ts généré avec succès !                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ 📊 Statistiques:                                          │
│   • Produits: 15                                          │
│   • Prix calculés: 348                                    │
│   • Taille fichier: 45.2 KB                               │
│   • Temps total: 3.1s                                     │
│                                                            │
│ 📁 Fichier généré:                                        │
│   src/lib/catalog-data.ts                                 │
│                                                            │
│ 📝 Prochaines étapes:                                     │
│   1. Vérifier les changements: git diff                   │
│   2. Commiter: git add + git commit                       │
│   3. Déployer: git push origin main                       │
│                                                            │
│ [📋 Copier Commandes] [🔍 Voir Diff] [✅ Fermer]          │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 Sécurité

### Authentification Admin

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protection des routes /admin/pricing
  if (request.nextUrl.pathname.startsWith('/admin/pricing')) {
    
    // Option 1: Simple mot de passe (dev)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer YOUR_SECRET_TOKEN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Option 2: Session-based (production)
    const session = request.cookies.get('admin_session');
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/pricing/:path*',
};
```

### Protection SQLite

```bash
# Fichier .gitignore
prisma/dev.db         # Ne jamais commiter la DB
prisma/dev.db-journal
*.db
*.db-journal

# Backup réguliers (local uniquement)
cp prisma/dev.db prisma/backups/dev-$(date +%Y%m%d).db
```

### Logs d'Audit

Tous les changements sont tracés :
- Qui a modifié (admin email)
- Quand (timestamp)
- Quoi (ancien/nouveau coefficient)
- Pourquoi (notes optionnelles)

```typescript
// Exemple log
{
  timestamp: "2026-02-21T14:30:22Z",
  user: "admin@storal.fr",
  action: "UPDATE_COEFFICIENT",
  productId: "kitanguy",
  field: "salesCoefficient",
  oldValue: 1.8,
  newValue: 1.9,
  reason: "Augmentation marge pour compenser coûts fournisseur"
}
```

---

## ⚡ Avantages

### 1. Production Ultra Légère

```
AVANT (prix en code):
- catalog-data.ts (45KB, statique) ✅
- 0 dépendance runtime ✅

APRÈS (système proposé):
- catalog-data.ts (45KB, statique) ✅
- 0 dépendance runtime ✅

Aucun changement côté production !
```

### 2. Flexibilité Business

```bash
# Scenario: Black Friday -20% sur tout
Admin → Multiplier tous coefficients × 0.8
Click "Générer"
Git push
→ Tous les prix mis à jour en 2 minutes
```

### 3. Historique Complet via Git

```bash
# Voir l'évolution du prix d'un produit
$ git log -p -- src/lib/catalog-data.ts | grep "kissimy_promo"

# Annuler une modification de prix
$ git revert abc123
$ git push
→ Retour arrière immédiat
```

### 4. Testing Facile

```typescript
// tests/pricing.test.ts
import { calculatePrice } from '@/lib/pricing/calculator';

test('Prix KITANGUY avec coefficient 1.8', () => {
  const price = calculatePrice({
    priceHT: 1353,
    coefficient: 1.8,
    vat: 1.10
  });
  expect(price).toBe(2678); // 1353 × 1.8 × 1.10
});
```

### 5. Extensible pour Nouveaux Produits

```typescript
// Ajouter portes blindées
const door = await prisma.product.create({
  data: {
    modelId: 'door_model_x',
    name: 'Porte Blindée Model X',
    productType: 'door', // ← Nouveau type
    salesCoefficient: 2.5,
    prices: {
      create: [
        { width: 800, height: 2000, priceHT: 1200 },
        { width: 900, height: 2100, priceHT: 1350 }
      ]
    }
  }
});

// Script génération supporte automatiquement
```

---

## 🛠️ Workflow Pratique

### Cas d'Usage 1 : Augmenter Marge de 5%

```bash
# 1. Interface admin
http://localhost:3000/admin/pricing
→ Click produit "STORAL COMPACT +"
→ Coefficient: 1.80 → 1.89 (+5%)
→ Click "Sauvegarder"

# 2. Vérifier impact
→ Page affiche simulation:
   "Prix moyen passe de 2678€ à 2813€ TTC (+5%)"
→ Click "Appliquer"

# 3. Générer catalog
→ Click "Générer catalog-data.ts"
→ Attendre 3 secondes
→ ✅ "348 prix recalculés"

# 4. Git workflow
$ git diff src/lib/catalog-data.ts
# Vérifier les lignes modifiées

$ git add src/lib/catalog-data.ts
$ git commit -m "fix: augmenter marge COMPACT+ de 5% suite hausse fournisseur"
$ git push origin main

# 5. Déployer
$ ssh ubuntu@51.210.244.26 "cd /var/www/storal.fr && git pull && pm2 restart storal-fr"

✅ Terminé ! Nouveaux prix en ligne
```

### Cas d'Usage 2 : Ajouter Nouveau Produit

```bash
# 1. Interface admin
http://localhost:3000/admin/pricing
→ Click "+ Ajouter Produit"
→ Remplir formulaire:
   - Nom: "STORAL ULTRA PREMIUM"
   - Model ID: "ultra_premium"
   - Coefficient: 2.5
   
# 2. Ajouter grille de prix
→ Click "+ Ajouter Palier"
→ Avancée: 2000mm, Max largeur: 3000mm, Prix HT: 2500€
→ Click "+ Ajouter Palier"
→ Avancée: 2000mm, Max largeur: 4000mm, Prix HT: 2800€
→ ...

# 3. Sauvegarder
→ Click "Sauvegarder produit"
→ ✅ "Produit créé avec 12 paliers de prix"

# 4. Générer catalog
→ Click "Générer catalog-data.ts"
→ ✅ "364 prix recalculés (16 produits)"

# 5. Compléter metadata
→ Éditer src/lib/catalog-data.backup.ts (ajouter descriptions, images, etc.)
→ Relancer génération

# 6. Git + Deploy (comme avant)
```

### Cas d'Usage 3 : Corriger Prix Fournisseur

```bash
# Scenario: Fournisseur augmente prix KISSIMY de 1010€ → 1050€

# 1. Interface admin
→ Éditer produit KISSIMY
→ Trouver ligne: "Avancée 1500mm, ≤2470mm: 1010€"
→ Click ✏️ Éditer
→ Prix HT: [1050        ]
→ Click 💾 Sauver

# 2. Impact automatique
→ Système recalcule automatiquement:
   Avant: 1010 × 1.4 × 1.10 = 1555€ TTC
   Après: 1050 × 1.4 × 1.10 = 1617€ TTC (+4%)
   
# 3. Générer + Deploy (comme avant)
```

---

## 📜 Commandes Utiles

```json
// package.json - Ajouter ces scripts
{
  "scripts": {
    // Prisma
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "db:seed": "tsx scripts/pricing/seed-defaults.ts",
    
    // Pricing
    "pricing:import": "tsx scripts/pricing/import-prices.ts",
    "pricing:generate": "tsx scripts/pricing/generate-catalog.ts",
    "pricing:validate": "tsx scripts/pricing/validate-prices.ts",
    
    // Admin
    "admin:dev": "next dev",
    
    // Backup
    "db:backup": "cp prisma/dev.db prisma/backups/dev-$(date +%Y%m%d-%H%M%S).db"
  }
}
```

### Commandes Fréquentes

```bash
# Développement
npm run admin:dev              # Démarrer interface admin
npm run db:studio              # Ouvrir Prisma Studio (UI DB)

# Gestion Tarifs
npm run pricing:generate       # Générer catalog-data.ts
npm run pricing:validate       # Vérifier cohérence prix
npm run db:backup              # Backup SQLite

# Git Workflow
git diff src/lib/catalog-data.ts        # Voir changements prix
git log --oneline -- src/lib/catalog-data.ts  # Historique commits prices

# Déploiement
git add src/lib/catalog-data.ts
git commit -m "fix: update margins"
git push origin main

# Production
ssh ubuntu@51.210.244.26 "cd /var/www/storal.fr && git pull && pm2 restart storal-fr"
```

---

## 🔮 Migration Future

### Si besoin de PostgreSQL plus tard

```bash
# 1. Changer datasource
# prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Export SQLite → SQL
sqlite3 prisma/dev.db .dump > export.sql

# 3. Import dans PostgreSQL
psql -U postgres -d storal < export.sql

# 4. Recréer migrations
npx prisma migrate dev --name migrate_to_postgres

# 5. Générer client
npx prisma generate

✅ Aucun changement code applicatif grâce à Prisma !
```

### Extensibilité Produits

Le système supporte déjà :
- ✅ Stores bannes (15 modèles)
- ✅ Portes blindées (à venir)
- ✅ Fermetures (à venir)
- ✅ Pergolas (à venir)
- ✅ Volets roulants (à venir)

Ajout nouveau type :
```typescript
// 1. Table reste identique (champ productType)
model Product {
  productType: "store" | "door" | "shutter" | "pergola" | "blind"
}

// 2. Adapter script génération
if (product.productType === 'door') {
  // Logique spécifique portes
}

// 3. Interface admin supporte automatiquement
```

---

## 📞 Support & Maintenance

### Logs Importants

```bash
# Logs génération catalog
tail -f logs/catalog-generation.log

# Erreurs Prisma
tail -f logs/prisma-errors.log

# Modifications admin
tail -f logs/admin-changes.log
```

### Résolution Problèmes Courants

**Problème** : Génération échoue
```bash
# Vérifier DB accessible
npx prisma studio

# Vérifier migrations à jour
npx prisma migrate status

# Régénérer client
npx prisma generate
```

**Problème** : Prix incohérents
```bash
# Lancer validation
npm run pricing:validate

# Comparer avec backup
diff <(grep priceHT src/lib/catalog-data.backup.ts) \
     <(sqlite3 prisma/dev.db "SELECT price FROM ProductPrice")
```

**Problème** : Rollback nécessaire
```bash
# Annuler dernier commit
git revert HEAD
git push origin main

# Ou retour à version spécifique
git checkout abc123 -- src/lib/catalog-data.ts
git commit -m "rollback: revert to version abc123"
git push
```

---

## ✅ Checklist Implémentation

### Phase 1 : Setup (2-3 heures)
- [ ] Créer schéma Prisma SQLite
- [ ] Générer migration initiale
- [ ] Créer script import-prices.ts
- [ ] Importer 348 prix depuis backup
- [ ] Créer script seed-defaults.ts
- [ ] Seed coefficients globaux
- [ ] Créer script generate-catalog.ts
- [ ] Tester génération catalog-data.ts

### Phase 2 : Interface Admin (4-6 heures)
- [ ] Page dashboard tarifs
- [ ] Page édition produit
- [ ] Page coefficients globaux
- [ ] Page historique générations
- [ ] API routes CRUD
- [ ] Authentification admin

### Phase 3 : Scripts & Validation (2-3 heures)
- [ ] Script validation prix
- [ ] Tests unitaires calculateur
- [ ] Documentation utilisateur
- [ ] Commandes npm

### Phase 4 : Production (1 heure)
- [ ] Test génération complète
- [ ] Git commit initial
- [ ] Déploiement test
- [ ] Validation production

**Total estimé** : 9-13 heures de développement

---

## 🎯 Conclusion

Cette architecture offre :

✅ **Simplicité** : SQLite, pas de serveur DB à gérer  
✅ **Performance** : Production statique, zéro latence  
✅ **Sécurité** : DB locale uniquement, pas exposée  
✅ **Flexibilité** : Modifier marges sans toucher code  
✅ **Traçabilité** : Git historise tous changements  
✅ **Évolutivité** : Prêt pour stores, portes, fermetures  

**Prochaine étape** : Commencer implémentation Phase 1 ! 🚀

---

**Document créé le** : 21 février 2026  
**Auteur** : Claude (GitHub Copilot)  
**Version** : 1.0.0  
**License** : Propriétaire Storal
