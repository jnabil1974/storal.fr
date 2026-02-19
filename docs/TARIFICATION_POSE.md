# Système de Tarification de la Pose par Département

## 📍 Vue d'ensemble

Le système de tarification de la pose est configuré dans `/src/lib/intervention-zones.ts` et permet de personnaliser les tarifs selon :
- **La largeur du store** (base + supplément)
- **Le département** (frais de déplacement)

## 💰 Structure des Tarifs

### Interface ZoneIntervention

```typescript
interface ZoneIntervention {
  nom: string;                      // Nom du département
  delai: string;                     // Délai d'intervention
  disponible: boolean;               // Zone active ou non
  frais_deplacement: number;         // Frais de déplacement en € HT
  prix_pose_base: number;            // Prix pose jusqu'à 6m en € HT
  prix_pose_supplement_metre: number; // Prix par mètre > 6m en € HT
}
```

### Tarification Actuelle

#### 🏗️ Base de calcul (tous départements)
- **≤ 6m** : 500€ HT
- **> 6m** : 500€ + 100€ par mètre supplémentaire (arrondi au supérieur)

#### 🚗 Frais de déplacement par zone

| Zone | Départements | Frais |
|------|--------------|-------|
| **Paris + Petite couronne** | 75, 92, 93, 94 | **0€** |
| **Grande couronne IDF** | 77, 78, 91, 95 | **50€** |
| **Centre-Val de Loire** | 18, 28, 36, 37, 41, 45 | **100€** |
| **Départements limitrophes** | 10, 58, 72, 89 | **150€** |
| **Allier** | 03 | **200€** |

## 🔧 Utilisation

### Fonction de calcul

```typescript
import { calculateInstallationCostWithZone } from '@/lib/intervention-zones';

const result = calculateInstallationCostWithZone(7000, '75001'); // 7m à Paris
// result = {
//   poseBase: 600,          // 500€ + 1m × 100€
//   fraisDeplacement: 0,    // Paris = 0€
//   total: 600,             // Total
//   departement: '75',
//   zone: { ... }
// }

const result2 = calculateInstallationCostWithZone(7000, '91000'); // 7m à Essonne
// result2 = {
//   poseBase: 600,          // 500€ + 1m × 100€
//   fraisDeplacement: 50,   // Essonne = 50€
//   total: 650,             // Total avec déplacement
//   departement: '91',
//   zone: { ... }
// }
```

### Exemples de calcul

#### Paris (75) - 4m
```
Pose base: 500€ (≤ 6m)
Frais déplacement: 0€
TOTAL: 500€ HT
```

#### Essonne (91) - 7m
```
Pose base: 600€ (500 + 1×100)
Frais déplacement: 50€
TOTAL: 650€ HT
```

#### Loiret (45) - 8.5m
```
Pose base: 800€ (500 + 3×100, arrondi)
Frais déplacement: 100€
TOTAL: 900€ HT
```

#### Allier (03) - 10m
```
Pose base: 900€ (500 + 4×100)
Frais déplacement: 200€
TOTAL: 1100€ HT
```

## ⚙️ Personnalisation

### Modifier les frais par département

Éditez `/src/lib/intervention-zones.ts` :

```typescript
export const ZONES_INTERVENTION: Record<string, ZoneIntervention> = {
  "75": { 
    nom: "Paris", 
    delai: "5-7 jours", 
    disponible: true, 
    frais_deplacement: 0,    // ← Modifier ici
    prix_pose_base: 500,     // ← Ou modifier le prix de base
    prix_pose_supplement_metre: 100  // ← Ou le supplément
  },
  // ...
};
```

### Exemples d'ajustements

#### Augmenter les frais pour un département éloigné
```typescript
"03": { 
  nom: "Allier", 
  delai: "7-10 jours", 
  disponible: true, 
  frais_deplacement: 250,  // Au lieu de 200€
  prix_pose_base: 500,
  prix_pose_supplement_metre: 100
},
```

#### Tarif spécial pour un département
```typescript
"28": { 
  nom: "Eure-et-Loir", 
  delai: "3-5 jours", 
  disponible: true, 
  frais_deplacement: 75,   // Tarif intermédiaire
  prix_pose_base: 550,     // Base légèrement augmentée
  prix_pose_supplement_metre: 120  // Plus cher au-delà de 6m
},
```

## 🔗 Intégration

### Dans ChatAssistant.tsx

Remplacer la fonction actuelle :

```typescript
// ❌ Ancienne méthode (uniquement largeur)
const calculateInstallationCost = (widthCm: number): number => {
  if (widthCm <= 6000) return 500;
  return 500 + (Math.ceil((widthCm - 6000) / 1000) * 100);
};

// ✅ Nouvelle méthode (largeur + code postal)
import { calculateInstallationCostWithZone } from '@/lib/intervention-zones';

// Dans le code de calcul des offres
const codePostal = cart.codePostal || '75001'; // Code postal du client
const installationResult = calculateInstallationCostWithZone(width, codePostal);
const poseHT = installationResult.total; // Utiliser le total (base + frais)
```

## 📝 Notes

- Les tarifs sont en **€ HT**
- L'arrondi au mètre supérieur s'applique au-delà de 6m
- Les frais de déplacement s'ajoutent au prix de pose de base
- Pour les codes postaux hors zone, les tarifs par défaut sont appliqués (500€ + 100€/m, 0€ frais)

## 🚀 Évolutions futures

- Ajouter champ `codePostal` dans le panier utilisateur
- Afficher détail pose (base + frais) dans le récapitulatif commande
- Créer interface admin pour modifier les tarifs dynamiquement
- Historiser les changements de tarifs
