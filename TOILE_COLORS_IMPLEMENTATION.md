# 🎨 Intégration des Couleurs de Toile - Résumé d'Implémentation

## ✅ Fonctionnalités Implémentées

### 1. **Nouvelle API Endpoint: `/api/calcul-prix/toile-colors`**
   - **Fichier**: `src/app/api/calcul-prix/toile-colors/route.ts`
   - **Paramètre**: `optionId` (ID de l'option de toile sélectionnée)
   - **Réponse**: Tableau de couleurs disponibles
   ```json
   {
     "colors": [
       {
         "id": 1,
         "color_name": "Blanc",
         "color_hex": "#FFFFFF",
         "price_adjustment": 0
       },
       ...
     ]
   }
   ```
   - **Fallback**: Retourne des couleurs par défaut si la table `product_toile_colors` n'existe pas

### 2. **Mise à Jour du Composant KissimyConfigurator**
   - **Fichier**: `src/components/KissimyConfigurator.tsx`
   - **Nouvelles dépendances d'état**:
     - `toileColors`: Tableau des couleurs disponibles pour la toile sélectionnée
     - `selectedToileColorId`: ID de la couleur sélectionnée

   - **Nouveau useEffect Hook**: Déclenché quand `toileId` change
     - Appelle `/api/calcul-prix/toile-colors?optionId=${toileId}`
     - Charge les couleurs disponibles
     - Sélectionne automatiquement la première couleur

   - **Nouvelle Section UI**: "Couleur de toile"
     - Radio buttons pour sélectionner une couleur
     - Affiche l'aperçu de la couleur (carré hex)
     - Affiche le nom de la couleur
     - Affiche l'ajustement de prix (le cas échéant)
     - Styling au survol (hover effect)

### 3. **Table SQL (À Créer Manuellement)**
   - **Fichier**: `create-toile-colors-table.sql`
   - **Table**: `product_toile_colors`
   - **Colonnes**:
     - `id` (BIGSERIAL)
     - `option_id` (référence à `product_options`)
     - `color_name` (VARCHAR 255)
     - `color_hex` (VARCHAR 7, ex: #FFFFFF)
     - `price_adjustment` (NUMERIC)
     - Timestamps (created_at, updated_at)

## 🔄 Flux de Fonctionnement

```
1. Utilisateur sélectionne une toile (Motorisation → Émetteur → Toile)
   ↓
2. useEffect détecte le changement de toileId
   ↓
3. Appel API: GET /api/calcul-prix/toile-colors?optionId=${toileId}
   ↓
4. API retourne les couleurs disponibles (ou les couleurs par défaut)
   ↓
5. Interface affiche les radio buttons avec aperçu des couleurs
   ↓
6. Utilisateur sélectionne une couleur
   ↓
7. selectedToileColorId est mis à jour
```

## 📊 Données de Test (Fallback Actuels)

Si la table n'existe pas, les couleurs par défaut sont:
- Blanc (#FFFFFF) - 0€
- Gris clair (#D3D3D3) - 0€
- Gris foncé (#808080) - 5€
- Marron (#8B4513) - 15€
- Noir (#000000) - 20€

## 🚀 Déploiement

### Local (Dev)
```bash
npm run dev
# L'API répond avec les couleurs par défaut
curl http://localhost:3000/api/calcul-prix/toile-colors?optionId=15
```

### Production
```bash
# Via le script
bash deploy-production.sh

# Ou manuellement
ssh ubuntu@51.210.244.26
cd /var/www/storal.fr
git pull
npm run build
pm2 restart storal-next
```

## 📝 Prochaines Étapes

1. **Créer la table `product_toile_colors` en Supabase**:
   - Exécuter le SQL depuis `create-toile-colors-table.sql`
   - Ou via Supabase SQL Editor

2. **Peupler la table avec les couleurs réelles**:
   - Insérer les couleurs avec leurs `option_id` correspondants
   - Définir les `color_hex` et `price_adjustment` appropriés

3. **Intégrer au calcul de prix**:
   - Ajouter `selectedToileColorId` au calcul final
   - Appliquer le `price_adjustment` au prix total

4. **Appliquer à d'autres produits**:
   - PorteBlindee Configurator
   - Store Banne Configurator
   - Autres produits similaires

## 🔗 Commits Associés
- `387bffb`: Ajouter fallback colors et table SQL
- `2c1c4d1`: Ajouter sélecteur de couleurs (commit précédent)
