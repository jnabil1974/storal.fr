# 📦 Mise à Jour du Catalogue Statique

## Pourquoi des données statiques ?

Pour éviter les problèmes de rate limit OpenAI et améliorer les performances, nous utilisons des **données statiques** pour les toiles et couleurs au lieu d'appels API dynamiques.

## 📊 Données extraites

Le fichier `src/lib/static-catalog-data.ts` contient :
- ✅ **284 toiles** avec leurs types, collections et images
- ✅ **91 couleurs RAL** avec finitions et images
- ✅ **5 types de finitions** (Brillant, Sablé, Structuré, etc.)

## 🔄 Quand mettre à jour ?

Exécutez la commande d'export **après chaque modification** dans votre interface Admin :
- Ajout/modification d'une toile
- Ajout/modification d'une couleur RAL
- Changement de disponibilité

## 🚀 Comment mettre à jour

### Méthode 1 : Script NPM (recommandé)

```bash
npm run export-catalog
```

### Méthode 2 : Commande directe

```bash
npx tsx scripts/export-catalog-data.ts
```

### Méthode 3 : Avec variables d'environnement

```bash
source .env.local && npx tsx scripts/export-catalog-data.ts
```

## ✅ Vérification

Après l'export, le script affiche :
```
✨ Fichier généré avec succès :
   📁 /Users/nabiljlaiel/Documents/PROJETS/Storal/src/lib/static-catalog-data.ts

📊 Statistiques :
   - 284 toiles
   - 91 couleurs RAL
   - 0 couleurs standards
   - 5 types de finitions

✅ Export terminé !
```

## 📝 Note importante

⚠️ **NE PAS modifier directement** `src/lib/static-catalog-data.ts`

Ce fichier est généré automatiquement. Toute modification manuelle sera écrasée lors du prochain export.

## 🔍 Fichiers impactés

Les composants suivants utilisent ces données statiques :
- `src/components/FabricSelectorModal.tsx` - Sélecteur de toiles
- `src/components/ColorSelectorModal.tsx` - Sélecteur de couleurs

## 🎯 Avantages

✅ **Performance** : Pas d'appel API, chargement instantané
✅ **Fiabilité** : Pas de dépendance réseau
✅ **Économies** : Pas de consommation de tokens OpenAI pour les données
✅ **SEO** : Données disponibles dès le premier rendu (SSR)

---

**Dernière mise à jour** : 10 février 2026
