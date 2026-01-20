# 🎯 Guide Rapide - Store Banne Coffre KISSIMY

## ✨ Quoi de Neuf?

### Vous venez de recréer:
- **Système de tarification flexible** avec coefficients dynamiques
- **Composant configurateur KISSIMY** interactif et réactif
- **Grille de prix complète** avec 12 variantes de dimensions
- **14 options tarifées** (motorisation, accessoires, couleurs)
- **Page produit dédiée** avec descriptons complètes

---

## 📍 Accès au Produit

### URL: `http://localhost:3000/products/kissimy`

### Fonctionnalités du Configurateur:
1. **Sélectionnez l'avancée** (1500, 2000, 2500 ou 3000 mm)
2. **Ajustez la largeur** (1800-4830 mm via slider)
3. **Choisissez la couleur du cadre** (5 options)
4. **Sélectionnez motorisation optionnelle** (manivelle + télécommande)
5. **Cochez les accessoires** désirés
6. **Choisissez la couleur/toile** (spéciale ou bi-color)
7. **Réglez la quantité** (1-100)
8. **Consultez le prix TTC** en temps réel
9. **Ajoutez au panier!**

---

## 💾 Base de Données

### Produit inséré:
- **ID**: `3bc4619a-15d7-4cbc-8f01-6c72a828cfb9`
- **Nom**: "Store Banne Coffre KISSIMY"
- **Type**: "store_banne"
- **Catégorie**: "stores"
- **Prix HT min**: 1010€
- **Prix HT max**: 1296€
- **Coefficient**: 2.0 (100% marge)

### Réinsérer le produit (si suppression):
```bash
node scripts/seed-kissimyProduct.mjs
```

---

## 🔧 Architecture

### Couches de tarification:
```
1. Grille (kissimyPricing.ts)
   ↓ Lookup avancée × largeur → Prix HT
   
2. Options (kissimyPricing.ts)
   ↓ +108€ manivelle, +125€ auvent, etc.
   
3. Coefficient (pricingConfig.ts)
   ↓ ×2.0 pour marge
   
4. TVA (pricingConfig.ts)
   ↓ ×1.20 (TVA 20%)
   
5. = Prix TTC Final
```

### Fichiers clés:
| Fichier | Rôle |
|---------|------|
| `src/lib/kissimyPricing.ts` | Grille + calculs |
| `src/lib/pricingConfig.ts` | Config coefficients |
| `src/components/StoreBanneKissimyConfigurator.tsx` | UI Configurateur |
| `src/app/products/kissimy/page.tsx` | Page produit |

---

## 🧪 Tests

### Vérifier le produit:
```bash
# Depuis la console browser
fetch('/api/products?type=store_banne')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Tester le configurateur:
1. Allez sur `/products/kissimy`
2. Sélectionnez: 2000mm avancée, 2500mm largeur
3. Cochez quelques options
4. Vérifiez le calcul du prix en temps réel
5. Ouvrez la section "Détails du calcul"

### Ajouter au panier:
1. Cliquez "Ajouter au panier"
2. Allez sur `/cart`
3. Vérifiez le produit est présent avec configuration

---

## 📋 Grille de Prix KISSIMY

### Avancée 1500mm:
| Largeur | Min-Max | Prix HT |
|---------|---------|---------|
| Étroite | 1800-2470 | 1010€ |
| Moyen | 2470-3650 | 1039€ |
| Large | 3650-4830 | 1068€ |

### Avancée 2000mm:
| Largeur | Min-Max | Prix HT |
|---------|---------|---------|
| Étroite | 1800-2470 | 1095€ |
| Moyen | 2470-3650 | 1125€ |
| Large | 3650-4830 | 1154€ |

### Avancée 2500mm:
| Largeur | Min-Max | Prix HT |
|---------|---------|---------|
| Étroite | 1800-2470 | 1181€ |
| Moyen | 2470-3650 | 1210€ |
| Large | 3650-4830 | 1239€ |

### Avancée 3000mm:
| Largeur | Min-Max | Prix HT |
|---------|---------|---------|
| Étroite | 1800-2470 | 1268€ |
| Moyen | 2470-3650 | 1296€ |
| Large | 3650-4830 | 1295€ |

---

## 💰 Exemple de Calcul

### Configuration:
- Avancée: 2000mm
- Largeur: 2900mm (dans plage 2470-3650) → **1125€ HT**
- Manivelle IO: **+132€ HT**
- Auvent: **+125€ HT**
- Capteur vent: **+90€ HT**
- Couleur spéciale: **+92€ HT**

### Calcul:
```
Total HT = 1125 + 132 + 125 + 90 + 92 = 1564€ HT

Avec coefficient 2.0:
1564 × 2.0 = 3128€ (avant TVA)

Avec TVA 20%:
3128 × 1.20 = 3753.60€ TTC

Vérification: TVA = 3753.60 - 3128 = 625.60€
```

---

## ✅ Checklist Utilisation

- [ ] Accédez à `/products/kissimy`
- [ ] Configurez un exemple
- [ ] Vérifiez le prix TTC affiché
- [ ] Ouvrez le détail du calcul
- [ ] Ajoutez au panier
- [ ] Allez au cart et vérifiez

---

## 🐛 Dépannage

### "Produit non trouvé"
→ Réexécutez: `node scripts/seed-kissimyProduct.mjs`

### Prix ne s'affiche pas
→ Ouvrez console (F12) pour voir les erreurs

### Panier ne fonctionne pas
→ Vérifiez que CartContext est bien wrappé dans layout.tsx

---

## 📞 Support

Consultez:
- `KISSIMYIMPLEMENTATION_SUMMARY.md` pour détails techniques
- Code source des fichiers pour implémentation
- Console browser (F12) pour débogage

---

**Enjoy! 🚀**
