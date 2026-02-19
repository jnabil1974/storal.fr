# 💰 Gestion des Coefficients de Vente - Guide d'utilisation

## Vue d'ensemble

Cette fonctionnalité permet de modifier directement depuis l'interface admin les coefficients de vente (marges) appliqués aux produits et options, **sans toucher à la base de données** et **sans impacter les performances du chatbot**.

## 📍 Accès à l'interface

1. Connectez-vous à l'espace admin : `/admin`
2. Cliquez sur la carte **"Coefficients 💰"**
3. Vous accédez à l'interface de gestion : `/admin/coefficients`

## 📊 Types de coefficients modifiables

### 1. Coefficient de marge par défaut (COEFF_MARGE)

**Valeur actuelle : 1.8** (soit 80% de marge)

- Coefficient appliqué par défaut à tous les modèles
- Les modèles avec un coefficient spécifique ne sont pas impactés
- Exemple : 1.8 signifie que le prix de vente = prix d'achat × 1.8

### 2. Coefficients par type d'option

Marges différenciées pour chaque type d'option :

- **LED_ARMS** (2.0) : LED sur les bras - technologie avancée
- **LED_CASSETTE** (2.0) : LED dans le coffre - éclairage intégré
- **LAMBREQUIN_FIXE** (1.5) : Lambrequin fixe - accessoire basique
- **LAMBREQUIN_ENROULABLE** (1.8) : Lambrequin enroulable motorisé
- **CEILING_MOUNT** (1.6) : Fixation plafond - installation spéciale
- **AUVENT** (1.7) : Auvent et joues - protection latérale
- **FABRIC** (1.4) : Toile de store - matière première
- **FRAME_COLOR_CUSTOM** (1.8) : Couleur RAL personnalisée
- **INSTALLATION** (1.3) : Installation professionnelle

### 3. Coefficients spécifiques par modèle

Certains modèles ont des coefficients personnalisés qui remplacent le COEFF_MARGE par défaut :

- **KISSIMY_PROMO** : 1.65 (marge réduite pour l'entrée de gamme promo)
- **KITANGUY** : 1.8 (coefficient standard)
- **HELIOM_PLUS** : 2.0 (haut de gamme)
- **KALYO** : 1.9 (design premium)
- **DYNASTA** : 2.1 (très haut de gamme)
- **BELHARRA** : 1.9 (premium)
- Et autres...

## 🔧 Comment modifier les coefficients

### Étape 1 : Accéder à l'interface
- Navbar Admin → Coefficients

### Étape 2 : Modifier les valeurs
- Modifiez les coefficients souhaités dans les champs de saisie
- Les valeurs doivent être supérieures à 1.0
- Utilisez des décimales (ex: 1.8, 2.0, 1.5)

### Étape 3 : Enregistrer
- Cliquez sur **"Enregistrer les modifications"**
- Le système modifie directement le fichier `src/lib/catalog-data.ts`
- Un message de confirmation s'affiche
- La page se recharge automatiquement après 2 secondes

### Étape 4 : Vérification
- Les nouveaux coefficients sont immédiatement actifs
- Le chatbot utilise automatiquement les nouvelles valeurs
- Aucun redémarrage du serveur n'est nécessaire en développement

## ⚠️ Important en production

En production, après modification des coefficients :

1. Les modifications sont sauvegardées dans le fichier source
2. **Vous devez redéployer l'application** pour que les changements soient pris en compte :
   ```bash
   npm run build
   pm2 restart ecosystem.config.js
   ```

## 🎯 Avantages de cette approche

✅ **Pas de base de données** : Les coefficients restent dans le code source
✅ **Performance optimale** : Le chatbot n'effectue aucune requête SQL
✅ **Simplicité** : Interface admin intuitive pour les modifications
✅ **Traçabilité** : Les modifications sont versionnées avec Git
✅ **Rapidité** : Pas de latence réseau, données en mémoire

## 💡 Cas d'usage

### Lancer une promotion sur une option
**Exemple** : Réduire temporairement la marge sur LED_ARMS

1. Aller dans Coefficients Admin
2. Modifier `LED_ARMS` de 2.0 → 1.6
3. Enregistrer
4. Les nouveaux prix sont appliqués immédiatement

### Ajuster les marges d'un modèle premium
**Exemple** : Augmenter la marge du DYNASTA

1. Aller dans la section "Coefficients spécifiques par modèle"
2. Modifier `DYNASTA` de 2.1 → 2.3
3. Enregistrer
4. Les prix du DYNASTA sont recalculés

### Harmoniser les marges
**Exemple** : Uniformiser tous les coefficients LED

1. Modifier `LED_ARMS` → 1.9
2. Modifier `LED_CASSETTE` → 1.9
3. Enregistrer

## 🔒 Sécurité

- ✅ Accès réservé aux administrateurs authentifiés
- ✅ Vérification du token d'authentification
- ✅ Validation des valeurs (> 0)
- ✅ Sauvegarde incrémentale du fichier source

## 📝 Fichiers modifiés

Cette fonctionnalité utilise :

- **Page admin** : `/src/app/admin/coefficients/page.tsx` (interface utilisateur)
- **API** : `/src/app/api/admin/coefficients/route.ts` (lecture/écriture du fichier)
- **Source des données** : `/src/lib/catalog-data.ts` (fichier modifié directement)

## 🚀 Prochaines étapes

Si besoin à l'avenir, on pourrait ajouter :

- Historique des modifications des coefficients
- Export CSV des marges actuelles
- Simulation de l'impact d'un changement de coefficient
- Gestion des coefficients par gamme de produits
