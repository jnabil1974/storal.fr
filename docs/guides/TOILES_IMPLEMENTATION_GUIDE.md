# 📚 Guide d'Implémentation - Gestion des Toiles

## 🎯 Vue d'Ensemble

Système complet de gestion des toiles de stores avec **2 tables** :
- **`toile_types`** : Gammes de toiles (prix, compatibilité)
- **`toile_colors`** : 289 couleurs individuelles avec images

---

## 📋 Étapes d'Installation

### **1️⃣ Créer les Tables dans Supabase**

```bash
# Exécuter le script SQL dans Supabase SQL Editor
cat supabase-create-toile-tables.sql
```

**Contenu** :
- ✅ Table `toile_types` (types/gammes)
- ✅ Table `toile_colors` (couleurs individuelles)
- ✅ 3 types pré-insérés (Dickson Orchestra, Dickson Orchestra Max, Sattler)
- ✅ Index de performance
- ✅ Triggers auto-update `updated_at`

---

### **2️⃣ Importer les Images**

```bash
# Installer les dépendances Python (si pas déjà fait)
cd /Applications/MAMP/htdocs/store_menuiserie
source .venv/bin/activate
pip install supabase-py python-dotenv

# Exécuter le script d'import
python3 scripts/import-toiles.py
```

**Ce que fait le script** :
- ✅ Scanne `public/images/toiles/DICKSON/` (3 sous-dossiers)
- ✅ Scanne `public/images/toiles/SATLER/`
- ✅ Extrait ref, nom, collection, catégorie
- ✅ Détecte automatiquement la famille de couleur
- ✅ Insère ~289 toiles dans `toile_colors`

**Output attendu** :
```
🚀 Démarrage de l'import des toiles...
📁 Scan: DICKSON Orchestra Uni...
   ✅ 80 toiles trouvées
📁 Scan: DICKSON Orchestra Décors...
   ✅ 95 toiles trouvées
📁 Scan: DICKSON Orchestra Max...
   ✅ 54 toiles trouvées
📁 Scan: Sattler...
   ✅ 60 toiles trouvées

📊 TOTAL: 289 toiles à importer
💾 Insertion dans Supabase...
   ✅ Batch 1: 100 toiles insérées
   ✅ Batch 2: 100 toiles insérées
   ✅ Batch 3: 89 toiles insérées

🎉 Import terminé!
   ✅ Succès: 289
   ❌ Erreurs: 0
```

---

### **3️⃣ Tester l'Interface Admin**

Accédez à : **http://localhost:3000/admin/toiles**

**Fonctionnalités disponibles** :

#### **Onglet "Types de Toiles"**
- 📋 Liste des 3 types (Dickson Orchestra, Orchestra Max, Sattler)
- ➕ Ajouter un nouveau type
- ✏️ Modifier prix, coefficient, compatibilité
- 🗑️ Supprimer (avec vérification si couleurs liées)

#### **Onglet "Couleurs"**
- 🎨 Grille visuelle des 289 couleurs avec images
- 🔍 Filtres : Recherche, Famille de couleur, Type
- ➕ Ajouter une nouvelle couleur
- ✏️ Modifier nom, catégorie, disponibilité
- 🗑️ Supprimer

---

## 🗂️ Structure des Données

### **Table `toile_types`**

```typescript
interface ToileType {
  id: number;
  name: string;                    // "Dickson Orchestra"
  manufacturer: string;             // "DICKSON" ou "SATTLER"
  code: string;                     // "ORCH", "ORCH_MAX", "SATT"
  purchase_price_ht: number;        // 28.50 (prix achat HT/m²)
  sales_coefficient: number;        // 1.80 (coefficient vente)
  compatible_categories: string[];  // ['BELHARRA', 'KALYO']
  default_width: number;            // 120 cm
  composition: string;              // "100% Acrylique teint masse"
  is_active: boolean;
}
```

### **Table `toile_colors`**

```typescript
interface ToileColor {
  id: number;
  toile_type_id: number;           // FK vers toile_types
  ref: string;                     // "U095", "7124", "314001"
  name: string;                    // "Orchestra Basalte Chiné"
  collection: string;              // "Orchestra Uni"
  category: string;                // "UNI", "DECORS", "MAX"
  color_family: string;            // "Gris", "Bleu", etc.
  image_url: string;               // "/images/toiles/DICKSON/..."
  is_available: boolean;
  color_hex: string;               // "#4A4A4A" (optionnel)
}
```

---

## 🔌 APIs Disponibles

### **API Types de Toiles**

**GET** `/api/admin/toile-types`
```typescript
// Récupérer tous les types
const types = await fetch('/api/admin/toile-types').then(r => r.json());
```

**POST** `/api/admin/toile-types`
```typescript
// Créer un nouveau type
await fetch('/api/admin/toile-types', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Nouveau Type',
    manufacturer: 'DICKSON',
    code: 'NEW',
    purchase_price_ht: 30.00,
    sales_coefficient: 1.7,
    compatible_categories: ['BELHARRA']
  })
});
```

**PUT** `/api/admin/toile-types?id=1`
```typescript
// Modifier un type
await fetch('/api/admin/toile-types?id=1', {
  method: 'PUT',
  body: JSON.stringify({ purchase_price_ht: 32.00 })
});
```

**DELETE** `/api/admin/toile-types?id=1`
```typescript
// Supprimer un type (uniquement si aucune couleur liée)
await fetch('/api/admin/toile-types?id=1', { method: 'DELETE' });
```

---

### **API Couleurs de Toiles**

**GET** `/api/admin/toile-colors`
```typescript
// Récupérer toutes les couleurs
const colors = await fetch('/api/admin/toile-colors').then(r => r.json());

// Avec filtres
const filtered = await fetch('/api/admin/toile-colors?toile_type_id=1&color_family=Gris&available=true')
  .then(r => r.json());
```

**POST** `/api/admin/toile-colors`
```typescript
// Créer une nouvelle couleur
await fetch('/api/admin/toile-colors', {
  method: 'POST',
  body: JSON.stringify({
    toile_type_id: 1,
    ref: 'U999',
    name: 'Orchestra Nouvelle Couleur',
    collection: 'Orchestra Uni',
    category: 'UNI',
    color_family: 'Bleu',
    image_url: '/images/toiles/custom/u999.png',
    is_available: true
  })
});
```

**PUT** `/api/admin/toile-colors?id=1`
**DELETE** `/api/admin/toile-colors?id=1`

---

## 💰 Calcul du Prix de Vente

```sql
-- Requête SQL pour calculer le prix avec coefficient
SELECT 
  tc.ref,
  tc.name,
  tt.purchase_price_ht,
  tt.sales_coefficient,
  (tt.purchase_price_ht * tt.sales_coefficient) AS price_sale_ht,
  ROUND((tt.purchase_price_ht * tt.sales_coefficient * 1.20), 2) AS price_ttc
FROM toile_colors tc
JOIN toile_types tt ON tc.toile_type_id = tt.id
WHERE tc.ref = 'U095';
```

**Exemple** :
- Prix achat HT : 28.50 €/m²
- Coefficient : 1.80
- **Prix vente HT** : 28.50 × 1.80 = **51.30 €/m²**
- **Prix TTC (20%)** : 51.30 × 1.20 = **61.56 €/m²**

---

## 🎨 Intégration au Configurateur

```typescript
// Dans le configurateur de stores
const getCompatibleToiles = async (storeSlug: string) => {
  // 1. Récupérer les types compatibles avec ce store
  const types = await fetch('/api/admin/toile-types').then(r => r.json());
  const compatibleTypes = types.filter(t => 
    t.compatible_categories?.includes(storeSlug.toUpperCase())
  );

  // 2. Récupérer les couleurs de ces types
  const typeIds = compatibleTypes.map(t => t.id);
  const colors = await fetch(
    `/api/admin/toile-colors?toile_type_id=${typeIds.join(',')}&available=true`
  ).then(r => r.json());

  return colors;
};

// Exemple d'utilisation
const toilesForBelharra = await getCompatibleToiles('belharra');
// → Retourne toutes les couleurs Dickson Orchestra + Orchestra Max + Sattler
```

---

## 🔧 Maintenance

### **Ajouter un Nouveau Type**
1. Admin → Toiles → Onglet "Types"
2. Cliquer "Ajouter un type"
3. Remplir : nom, fabricant, prix, coefficient, catégories compatibles
4. Sauvegarder

### **Ajouter des Couleurs Manuellement**
1. Admin → Toiles → Onglet "Couleurs"
2. Cliquer "Ajouter une couleur"
3. Uploader l'image dans `public/images/toiles/`
4. Remplir les champs
5. Sauvegarder

### **Mettre à Jour les Prix**
- Modifier directement dans l'onglet "Types"
- Le changement s'applique automatiquement à toutes les couleurs de ce type

### **Réimporter les Images**
```bash
# Si vous ajoutez de nouvelles images dans le dossier
python3 scripts/import-toiles.py
# Note: Les doublons (ref existants) seront ignorés
```

---

## ✅ Checklist de Vérification

- [ ] Tables créées dans Supabase
- [ ] 3 types pré-insérés visibles
- [ ] Script d'import exécuté avec succès
- [ ] 289 couleurs importées
- [ ] Page admin/toiles accessible
- [ ] Onglets "Types" et "Couleurs" fonctionnels
- [ ] Images affichées correctement
- [ ] Filtres opérationnels
- [ ] Suppression avec vérification

---

## 🐛 Dépannage

### **Erreur : "SUPABASE non configuré"**
- Vérifier `.env.local` : `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### **Images ne s'affichent pas**
- Vérifier que le chemin est relatif : `/images/toiles/...`
- Vérifier les permissions du dossier `public/images/toiles/`

### **Import Python échoue**
```bash
# Installer les dépendances
pip install supabase-py python-dotenv

# Vérifier la connexion Supabase
python3 -c "from supabase import create_client; print('OK')"
```

### **Types de toiles manquants**
```sql
-- Réinsérer manuellement dans Supabase SQL Editor
INSERT INTO toile_types (name, manufacturer, code, purchase_price_ht, sales_coefficient, compatible_categories)
VALUES ('Dickson Orchestra', 'DICKSON', 'ORCH', 28.50, 1.80, ARRAY['BELHARRA', 'KALYO']);
```

---

## 📞 Support

Pour toute question :
- Vérifier les logs du script Python
- Consulter la console du navigateur (F12)
- Vérifier les logs Supabase Dashboard

---

**✨ Félicitations ! Votre système de gestion des toiles est opérationnel.**
