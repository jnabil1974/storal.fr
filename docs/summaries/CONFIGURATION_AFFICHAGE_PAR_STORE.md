# Configuration de l'affichage selon le type de store

## Vue d'ensemble

Le système filtre automatiquement les **toiles Dickson** et les **couleurs Matest** selon le type de store sélectionné (HELiOM, BELHARRA, KALYO, KISSIMY, etc.).

## Comment ça fonctionne ?

### 1. Pour les TOILES DICKSON

**Table**: `toile_types`
**Colonne de filtrage**: `compatible_categories` (type: TEXT[])

#### Configuration dans l'admin

1. Allez sur `/admin/toiles`
2. Onglet **"Types"**
3. Pour chaque type de toile, **cochez les produits compatibles** :
   - ☑️ HELIOM
   - ☑️ BELHARRA
   - ☑️ KALYO
   - ☑️ KISSIMY
   - etc.

#### Exemple de données
```json
{
  "name": "Dickson Orchestra",
  "compatible_categories": ["HELIOM", "BELHARRA", "KALYO"]
}
```

**Résultat** : Cette toile apparaîtra uniquement sur les configurateurs HELiOM, BELHARRA et KALYO.

---

### 2. Pour les COULEURS MATEST (coffre)

**Table**: `matest_finish_types`
**Colonne de filtrage**: `product_slugs` (type: TEXT[])

#### Configuration dans l'admin

1. Allez sur `/admin/matest-colors`
2. Section **"Types de finition"**
3. Cliquez sur **"+ Ajouter type"** ou **✏️ Modifier** un type existant
4. Sélectionnez le type (brillant, sablé, mat, etc.)
5. **Cochez les produits compatibles** :
   - ☑️ heliom
   - ☑️ belharra
   - ☑️ kalyo
   - ☑️ kissimy
   - etc.

#### Exemple de données
```json
{
  "name": "brillant",
  "product_slugs": ["heliom", "belharra", "kalyo"]
}
```

**Résultat** : Les couleurs de type "brillant" apparaîtront uniquement sur HELiOM, BELHARRA et KALYO.

---

## Flux de filtrage

### Toiles Dickson
```
Utilisateur ouvre configurateur HELiOM
  ↓
API: /api/toiles?productSlug=heliom
  ↓
Requête SQL: SELECT * FROM toile_types WHERE 'HELIOM' = ANY(compatible_categories)
  ↓
Affichage: Uniquement les toiles compatibles HELiOM
```

### Couleurs Matest
```
Utilisateur ouvre configurateur HELiOM
  ↓
API: /api/admin/matest-colors?productSlug=heliom
  ↓
1. Récupère types de finition: SELECT name FROM matest_finish_types WHERE 'heliom' = ANY(product_slugs)
2. Récupère couleurs: SELECT * FROM matest_colors WHERE finish IN (types trouvés)
  ↓
Affichage: Uniquement les couleurs des types compatibles HELiOM
```

---

## Interface utilisateur

### Badges d'information

#### Sur les toiles
```
✓ Filtré pour ce modèle | 3 types de toile compatibles
```

#### Sur les couleurs Matest
```
✓ Filtré pour ce modèle | 45 couleurs disponibles
```

### Messages d'avertissement

Si aucun élément n'est configuré pour un produit :

**Toiles:**
```
🚧 Aucune toile disponible
Les toiles pour ce modèle de store ne sont pas encore configurées.
```

**Couleurs:**
```
🚧 Aucune couleur disponible
Les couleurs Matest pour ce modèle de store ne sont pas encore configurées.
Veuillez contacter l'administrateur pour associer des types de finition à ce produit.
```

---

## Checklist de configuration

### Pour un nouveau produit (ex: DYNASTA)

- [ ] **Toiles Dickson**
  1. Aller sur `/admin/toiles` > Onglet "Types"
  2. Pour chaque toile compatible, modifier et cocher "DYNASTA"
  3. Sauvegarder

- [ ] **Couleurs Matest**
  1. Aller sur `/admin/matest-colors`
  2. Section "Types de finition"
  3. Pour chaque type compatible (brillant, sablé, etc.)
     - Cliquer sur ✏️
     - Cocher "dynasta" dans les produits
     - Enregistrer

### Vérification

1. Ouvrir `/products/store-banne/dynasta`
2. Vérifier que les toiles s'affichent
3. Vérifier que les couleurs Matest s'affichent
4. Vérifier les badges "✓ Filtré pour ce modèle"

---

## Avantages du système

✅ **Contrôle précis** : Chaque toile et couleur peut être associée à des produits spécifiques  
✅ **Flexibilité** : Un type peut être compatible avec plusieurs produits  
✅ **Visibilité** : Les badges informent l'utilisateur du filtrage actif  
✅ **Maintenance facile** : Tout se configure depuis l'interface admin  
✅ **Évolutif** : Ajout de nouveaux produits sans modification du code

---

## Notes techniques

### Normalisation des slugs

- **Toiles** : Slugs en MAJUSCULES ("HELIOM", "BELHARRA")
- **Couleurs** : Slugs en minuscules ("heliom", "belharra")

### Tables concernées

- `toile_types` : Types de toiles avec `compatible_categories`
- `toile_colors` : Couleurs liées à `toile_types` via `toile_type_id`
- `matest_finish_types` : Types de finition avec `product_slugs`
- `matest_colors` : Couleurs liées aux types via `finish`

### APIs

- `GET /api/toiles?productSlug=xxx` : Récupère toiles compatibles
- `GET /api/toiles/colors?toileTypeId=xxx` : Récupère couleurs d'une toile
- `GET /api/admin/matest-colors?productSlug=xxx` : Récupère couleurs Matest compatibles
