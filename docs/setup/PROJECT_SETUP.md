# 🎨 Site E-Commerce Menuiserie sur Mesure

## 📋 Overview

Site de vente de menuiserie sur mesure avec configurateurs produits interactifs et calcul de prix dynamique. Architecture adaptée pour supporter plusieurs types de produits avec leurs propres spécifications.

## ✨ Fonctionnalités Actuelles

### 1. **Configurateurs Produits**
- **Store Banne** : Configuration des dimensions, motorisation, tissu, couleurs, options capteurs
- **Porte Blindée** : Configuration des dimensions, matériaux, niveau de sécurité, vitrage, options d'isolation

### 2. **Calcul de Prix Dynamique**
- Prix qui s'adapte en temps réel selon les choix
- Détail du prix avec breakdown des éléments
- Formules tarifaires indépendantes par type de produit

### 3. **Structure de Base de Données Flexible**
- Support de multiples types de produits
- Spécifications uniques par type
- Extensible pour de nouveaux produits

## 🗂️ Architecture du Projet

```
src/
├── app/
│   ├── page.tsx                 # Accueil avec liste produits
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx         # Page produit dynamique
│   └── layout.tsx
├── components/
│   ├── StoreBanneConfigurator.tsx    # Configurateur Store Banne
│   ├── PorteBlindeeConfigurator.tsx  # Configurateur Porte Blindée
│   └── ...
├── lib/
│   ├── database.ts              # Couche données (mock)
│   ├── pricing.ts               # Calcul de prix
│   └── ...
├── types/
│   └── products.ts              # Types TypeScript
└── ...
```

## 🔧 Stack Technique

- **Frontend** : Next.js 14, React, TypeScript, Tailwind CSS
- **Base de données** : En mémoire (à remplacer par Supabase)
- **UI Components** : Tailwind CSS (sans dépendance externe)

## 🚀 Démarrage Rapide

### Installation
```bash
cd /Applications/MAMP/htdocs/store_menuiserie
npm install
```

### Mode Développement
```bash
npm run dev
```
Puis accédez à `http://localhost:3000`

### Build Production
```bash
npm run build
npm start
```

## 📦 Prochaines Étapes - Roadmap

### Phase 1 : Base de Données (Priorité Haute)
- [ ] Intégrer Supabase PostgreSQL
- [ ] Créer les tables produits
- [ ] Migrer les données de mock à la BDD
- [ ] API routes pour CRUD produits

### Phase 2 : Panier et Commande
- [ ] Système de panier (localStorage + API)
- [ ] Page récapitulatif commande
- [ ] Génération de devis PDF
- [ ] Système de commande

### Phase 3 : Paiement
- [ ] Intégration Stripe/PayPal
- [ ] Processus checkout sécurisé
- [ ] Confirmations par email

### Phase 4 : Admin
- [ ] Dashboard d'administration
- [ ] Gestion produits
- [ ] Gestion commandes
- [ ] Analytics

### Phase 5 : Nouveaux Types de Produits
- [ ] Fenêtre Menuiserie
- [ ] Armoire/Placard
- [ ] Autres produits sur mesure
- [ ] Adapter base de données

## 🧮 Modèle de Tarification

### Store Banne
- **Prix de base** : À partir de 350€
- **Dimensions** : +50€ par m²
- **Motorisation** : Manuel 0€ / Électrique +350€ / Smarty +650€
- **Tissu** : Acrylique 0€ / Polyester +150€ / Micro-perforé +250€
- **Capteurs** : Vent/Pluie +120€ chacun
- **Type bras** : Ouvert 0€ / Semi-coffre +100€ / Coffre +200€

### Porte Blindée
- **Prix de base** : À partir de 890€
- **Dimensions** : +40€ par m²
- **Type porte** : Battante 0€ / Coulissante +300€ / Pliante +500€
- **Matériau** : Acier 0€ / Alu +200€ / Composite +350€ / Bois +400€
- **Sécurité** : A2P_1 0€ / A2P_2 +250€ / A2P_3 +600€
- **Serrure** : Simple 0€ / Double +150€ / Triple +350€
- **Options** : Insonorisation +200€ / Isolation +180€

## 📝 Types TypeScript

Tous les produits étendent l'interface `BaseProduct` avec leurs propres spécifications :

- **StoreBanneProduct** : Spécifications store banne
- **PorteBlindeeProduct** : Spécifications porte blindée
- **Union type** : `Product = StoreBanneProduct | PorteBlindeeProduct`

## 🔗 Fichiers Clés

| Fichier | Description |
|---------|-------------|
| [types/products.ts](src/types/products.ts) | Définition des types produits |
| [lib/database.ts](src/lib/database.ts) | Couche données (mock) |
| [lib/pricing.ts](src/lib/pricing.ts) | Calcul de prix et breakdown |
| [components/StoreBanneConfigurator.tsx](src/components/StoreBanneConfigurator.tsx) | Configurateur Store Banne |
| [components/PorteBlindeeConfigurator.tsx](src/components/PorteBlindeeConfigurator.tsx) | Configurateur Porte Blindée |

## 💡 Conseils d'Extension

### Ajouter un Nouveau Type de Produit

1. **Ajouter l'enum** dans `types/products.ts`
2. **Créer l'interface config** (ex: `FenetreConfig`)
3. **Créer l'interface produit** (ex: `FenetreProduct`)
4. **Ajouter au union type** `Product`
5. **Implémenter pricing** dans `pricing.ts`
6. **Créer component configurateur** (ex: `FenetreConfigurator.tsx`)
7. **Ajouter au rendu** dans `app/products/[id]/page.tsx`

### Migrer vers Supabase

1. Créer projet Supabase
2. Définir schéma BDD (tables, migrations)
3. Remplacer `lib/database.ts` par appels API Supabase
4. Mettre en place authentification
5. Implémenter API routes pour les opérations

## 📚 Ressources Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 🎯 Notes

- La BDD est actuellement en mémoire (rechargement à chaque restart)
- Les images sont des placeholders (à remplacer par de vraies images)
- Les prix sont fictifs et à adapter selon vos coûts
- À adapter selon votre marché et vos spécificités produit
