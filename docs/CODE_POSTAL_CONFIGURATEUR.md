# Système de Code Postal dans le Configurateur

## 📋 Vue d'ensemble

Le système de code postal a été intégré dans le flux du configurateur IA pour :
1. **Vérifier la zone d'intervention** avant de générer un devis
2. **Calculer automatiquement les frais de déplacement** selon la zone géographique
3. **Assurer la transparence** des tarifs pour le client

---

## 🎯 Fonctionnement dans le Flux IA

### Phase 1 : Collecte du Code Postal (ÉTAPE 1G)

L'assistant IA demande le code postal **après** avoir collecté :
- ✅ Les dimensions du store
- ✅ Le type de support de fixation
- ✅ Les obstacles éventuels
- ✅ L'orientation et l'exposition
- ✅ Les options LED, Lambrequin, Auvent
- ✅ Le choix Pose / Sans pose

**Message type de l'IA** :
```
Dernière information importante : quel est votre code postal ?

Cela nous permet de :
• Vérifier que nous intervenons dans votre zone
• Calculer précisément les frais de déplacement pour l'installation
• Vous donner un devis exact et transparent
```

### Validation Automatique de la Zone

Dès que le client fournit son code postal (5 chiffres), l'IA vérifie automatiquement :

**✅ SI ZONE COUVERTE** (19 départements disponibles) :
```
✅ Parfait ! Nous intervenons bien dans votre zone (Essonne - 91).

📋 Information tarifaire : Les frais de déplacement pour votre secteur 
sont de 50€.

⏱️ Délai d'intervention : 5-7 jours après validation de votre commande.

Nous sommes prêts à passer à l'étape suivante !
```

**❌ SI ZONE NON COUVERTE** :
```
❌ Je suis désolé, mais nous n'intervenons pas encore dans le 
département 13 (Bouches-du-Rhône).

🗺️ Nos zones d'intervention actuelles couvrent :
• L'Île-de-France complète
• Le Centre-Val de Loire
• Les départements limitrophes
• L'Allier

💡 Solutions alternatives :
1. Commande sans pose : Nous livrons, vous installez
2. Nous contacter pour étudier votre cas : 01 85 09 34 46
```

---

## 💰 Tarification des Frais de Déplacement

| Zone | Départements | Frais | Délai |
|------|--------------|-------|-------|
| **Paris + Petite Couronne** | 75, 92, 93, 94 | **Gratuit** (0€) | 5-7 jours |
| **Grande Couronne IDF** | 77, 78, 91, 95 | **50€** | 5-7 jours |
| **Centre-Val de Loire** | 18, 28, 36, 37, 41, 45 | **100€** | 3-5 jours |
| **Départements Limitrophes** | 72, 89, 58, 10 | **150€** | 5-7 jours |
| **Allier** | 03 | **200€** | 7-10 jours |

---

## 🔧 Intégration Technique

### 1. API Chat (route.ts)

**Tool `display_single_offer`** - Paramètre ajouté :
```typescript
code_postal: {
  type: 'string',
  description: "Code postal du client (5 chiffres). Obligatoire pour calculer 
               les frais de déplacement selon la zone géographique."
}
```

**Étape 1G ajoutée** dans le System Prompt :
- Demande explicite du code postal
- Validation de la zone d'intervention
- Messages conditionnels selon disponibilité
- Enregistrement pour utilisation dans `display_single_offer`

### 2. ChatAssistant.tsx

**Extraction du code postal** depuis `display_single_offer` :
```typescript
const {
  // ... autres paramètres
  code_postal  // Code postal pour frais de déplacement
} = input;
```

**Sauvegarde dans le Cart** :
```typescript
saveToCart({
  // ... autres données
  codePostal: code_postal,  // Code postal pour zone d'intervention
});
```

### 3. Calcul Automatique des Frais

Le calcul des frais de déplacement se fait automatiquement via :
```typescript
// Dans calculateInstallationCost() (ChatAssistant.tsx)
if (codePostal && codePostal.length === 5) {
  const result = calculateInstallationCostWithZone(widthCm, codePostal);
  // result.fraisDeplacement contient les frais selon la zone
  // result.total = poseBase + fraisDeplacement
  return result.total;
}
```

### 4. Affichage dans le Récapitulatif

Dans `order-summary/page.tsx`, le détail des frais est affiché :
```tsx
{cart.poseHT && cart.poseHT > 0 && (
  <>
    <div>Installation professionnelle (HT): {cart.poseHT.toFixed(2)} €</div>
    {cart.fraisDeplacement !== undefined && cart.fraisDeplacement > 0 && (
      <div className="text-sm text-gray-600 ml-6">
        • Dont frais de déplacement: {cart.fraisDeplacement.toFixed(2)} €
      </div>
    )}
  </>
)}
```

---

## 📊 Flux Complet Utilisateur

1. **Utilisateur arrive sur le configurateur** (avec ou sans dimensions pré-remplies)
2. **L'IA pose les questions techniques** (support, obstacles, orientation, etc.)
3. **L'IA demande le code postal** (ÉTAPE 1G)
4. **Validation instantanée** :
   - ✅ Zone couverte → Continue avec frais calculés
   - ❌ Zone non couverte → Propose alternatives (sans pose ou contact commercial)
5. **L'IA passe à la Phase 2** (validation du projet avec récapitulatif incluant zone + frais)
6. **Phase 3 : Choix esthétiques** (modèle, couleurs, toile)
7. **Phase 4 : Génération du devis** avec `display_single_offer` (inclut frais de déplacement)
8. **Récapitulatif final** : Détail pose + frais déplacement séparés

---

## 🧪 Tests Recommandés

### Test 1 : Zone Gratuite (Paris)
```
Code postal : 75001
Résultat attendu : ✅ Zone couverte, frais 0€
```

### Test 2 : Grande Couronne (Essonne)
```
Code postal : 91000
Résultat attendu : ✅ Zone couverte, frais 50€
```

### Test 3 : Centre-Val de Loire (Loiret)
```
Code postal : 45000
Résultat attendu : ✅ Zone couverte, frais 100€
```

### Test 4 : Hors Zone (Marseille)
```
Code postal : 13001
Résultat attendu : ❌ Zone non couverte, propose alternatives
```

### Test 5 : Calcul Pose Complète
```
Scenario : Store 7m de large, code postal 91000, avec pose
Calcul attendu :
- Base pose : 600€ (500€ + 1 mètre supplémentaire)
- Frais déplacement : 50€
- Total installation : 650€
```

---

## 🔄 Synchronisation avec Formulaire Contact

Le système est **cohérent** avec le formulaire de contact :
- Même API `/api/check-zone` utilisée
- Mêmes zones d'intervention
- Mêmes messages de validation
- Page dédiée `/zones-intervention` pour info complète

---

## 📝 Notes Importantes

1. **Code postal obligatoire** : Le tool `display_single_offer` a `code_postal` dans les `required` fields
2. **Fallback gracieux** : Si code postal manquant ou invalide, calcul standard (sans frais)
3. **Transparence totale** : Client voit détail (base pose + frais) dans récapitulatif
4. **Évolutivité** : Ajouter un département = 1 ligne dans `intervention-zones.ts`

---

## 🚀 Déploiement

**Fichiers modifiés** :
- ✅ `src/app/api/chat/route.ts` (tool + system prompt)
- ✅ `src/components/ChatAssistant.tsx` (extraction + sauvegarde code postal)
- ✅ `src/lib/intervention-zones.ts` (déjà existant)
- ✅ `src/app/order-summary/page.tsx` (déjà modifié)

**Prochaines étapes** :
1. ✅ Modifications code effectuées
2. ⏳ Tests E2E avec différents codes postaux
3. ⏳ Commit + Push
4. ⏳ Déploiement production
5. ⏳ Tests utilisateurs réels

---

## 📞 Support

Pour toute question sur le système de zones d'intervention :
- 📄 Documentation complète : `docs/TARIFICATION_POSE.md`
- 🗺️ Page publique : `/zones-intervention`
- 📧 Contact commercial : 01 85 09 34 46
