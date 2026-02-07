# 🚀 Guide de Test Rapide - Intégration Toiles

## ✅ Système Intégré

Le système de sélection de toiles est maintenant intégré dans le configurateur de stores bannes.

## 📍 URLs de Test

### Produits compatibles avec toiles:
- **BELHARRA**: http://localhost:3000/products/store-banne/belharra
- **KALYO**: http://localhost:3000/products/store-banne/kalyo  
- **DYNASTA**: http://localhost:3000/products/store-banne/dynasta
- **HELIOM**: http://localhost:3000/products/store-banne/heliom

### Admin:
- **Gestion des toiles**: http://localhost:3000/admin/toiles

## 🧪 Checklist de Test

### 1. Chargement initial ✓
- [ ] Ouvrir http://localhost:3000/products/store-banne/belharra
- [ ] Vérifier que la section "Toile" apparaît
- [ ] Vérifier que les types de toiles s'affichent (devrait voir: Dickson Orchestra, Dickson Orchestra Max, Sattler)

### 2. Sélection de type ✓
- [ ] Cliquer sur "Dickson Orchestra"
- [ ] Vérifier que la grille de couleurs apparaît
- [ ] Vérifier le nombre de couleurs disponibles
- [ ] Vérifier que le prix est affiché (ex: "51.30€/m²")

### 3. Filtres de couleur ✓
- [ ] Tester le filtre "Bleu"
- [ ] Vérifier que seules les toiles bleues s'affichent
- [ ] Tester "Toutes" pour réafficher toutes les couleurs
- [ ] Tester d'autres familles (Gris, Blanc, Rouge, etc.)

### 4. Recherche ✓
- [ ] Taper "0001" dans la barre de recherche
- [ ] Vérifier que les résultats filtrés s'affichent
- [ ] Effacer la recherche
- [ ] Taper "orchestra" et vérifier les résultats

### 5. Sélection de couleur ✓
- [ ] Cliquer sur une couleur dans la grille
- [ ] Vérifier qu'elle devient sélectionnée (bordure bleue + checkmark)
- [ ] Vérifier que le résumé vert apparaît en bas avec l'image
- [ ] Vérifier que le prix de la toile est calculé

### 6. Calcul de prix ✓
- [ ] Noter le prix affiché dans le résumé (ex: "Surface calculée: 5.70 m²")
- [ ] Vérifier le calcul: surface × prix/m² (ex: 5.70 × 51.30 = 292.41€)
- [ ] Vérifier que le prix total inclut la toile
- [ ] Modifier la largeur et vérifier que le prix toile se recalcule

### 7. Changement de dimensions ✓
- [ ] Modifier l'avancée (ex: passer de 1.5m à 2.0m)
- [ ] Vérifier que la surface recalcule automatiquement
- [ ] Vérifier que le prix de la toile se met à jour
- [ ] Vérifier que le prix total se met à jour

### 8. Changement de type ✓
- [ ] Sélectionner "Dickson Orchestra Max"
- [ ] Vérifier que la grille de couleurs change
- [ ] Vérifier que le prix/m² est différent
- [ ] Vérifier que le prix total se met à jour

### 9. Résumé dans sidebar ✓
- [ ] Vérifier que "Toile" affiche "Type X"
- [ ] Vérifier que "Prix toile" affiche "+XXX.XX€" en bleu
- [ ] Vérifier que le prix total HT inclut la toile

### 10. Ajout au panier ✓
- [ ] Configurer complètement le store (dimensions, motorisation, émetteur, toile)
- [ ] Cliquer sur "Ajouter au panier"
- [ ] Vérifier l'alerte de confirmation
- [ ] Ouvrir le panier et vérifier la configuration

### 11. Affichage des images ✓
- [ ] Vérifier que les images de toiles s'affichent dans la grille
- [ ] Survoler une toile et vérifier l'overlay avec infos (ref, nom, stock)
- [ ] Vérifier que l'image apparaît dans le résumé de sélection

### 12. États visuels ✓
- [ ] Vérifier le hover sur les types de toiles (bordure bleue)
- [ ] Vérifier le hover sur les couleurs (overlay noir semi-transparent)
- [ ] Vérifier la sélection active (bordure bleue épaisse + ring)
- [ ] Vérifier le checkmark blanc sur fond bleu

## 🐛 Problèmes potentiels

### Si aucune toile ne s'affiche:
1. Vérifier que Supabase est connecté
2. Vérifier dans admin: http://localhost:3000/admin/toiles
3. Vérifier que le produit est dans `compatible_categories`

### Si les images ne se chargent pas:
1. Vérifier que les fichiers existent dans `/public/images/toiles/`
2. Ouvrir la console du navigateur (F12) et chercher les erreurs 404
3. Vérifier les chemins dans la base de données

### Si le prix ne se calcule pas:
1. Vérifier que `surfaceM2` est correct (largeur × avancee / 1000000)
2. Vérifier que le type de toile a un `sales_coefficient`
3. Vérifier la console pour les erreurs JavaScript

## 📊 Données de test

### Types attendus (3):
1. **Dickson Orchestra**: 28.50€ × 1.80 = 51.30€/m²
2. **Dickson Orchestra Max**: 35.00€ × 1.70 = 59.50€/m²
3. **Sattler**: 32.00€ × 1.60 = 51.20€/m²

### Couleurs attendues:
- Orchestra: ~112 couleurs (après résolution duplicates)
- Orchestra Max: ~24 couleurs
- Sattler: ~60 couleurs

### Familles de couleurs:
Blanc, Noir, Gris, Bleu, Vert, Rouge, Rose, Orange, Jaune, Violet, Marron, Beige, Neutre

## 🎯 Résultat attendu

Un configurateur complet avec:
- ✅ Sélection visuelle de types de toiles
- ✅ Grille de couleurs avec images
- ✅ Filtres par famille et recherche
- ✅ Calcul automatique du prix
- ✅ Intégration dans le prix total
- ✅ Résumé visuel de la sélection
- ✅ Sauvegarde dans le panier

## 📝 Rapporter les bugs

Si vous trouvez des bugs pendant les tests:

1. **Prendre une capture d'écran**
2. **Noter les étapes** pour reproduire le problème
3. **Vérifier la console** (F12) pour les erreurs
4. **Noter l'URL** de la page

## 🚀 Prochaine étape

Après validation des tests:
1. Résoudre les 89 références dupliquées
2. Re-importer les toiles manquantes
3. Générer des thumbnails optimisés
4. Déployer en production
