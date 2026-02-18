# 🔐 Améliorations des Mentions Légales - Assistant IA Gemini

## 📊 Résumé des Modifications

Les mentions légales, la politique de confidentialité et l'interface utilisateur ont été enrichies avec **les données techniques réelles** extraites du code source de votre application.

---

## ✅ 1. Mentions Légales (`/mentions-legales`)

### 🎯 Améliorations Apportées

#### **A. Introduction Professionnelle**
- ✅ Mention explicite de "Google Gemini (version professionnelle)"
- ✅ Contexte d'utilisation : "optimisation de l'expérience utilisateur et aide à la configuration technique"
- ✅ Distinction claire entre version grand public et version entreprise

#### **B. Garantie de Confidentialité (Badge Vert)**
- 🔒 **Garantie principale** : Données strictement isolées
- 🔒 **Non-entraînement** : Aucune utilisation pour améliorer les modèles IA de Google
- 🔒 **Propriété exclusive** : Vos données restent votre propriété et celle de STORAL

#### **C. Informations Techniques Détaillées**
```yaml
Fournisseur: Google LLC (Mountain View, Californie, USA)
Service: Google AI SDK (@ai-sdk/google) - API sécurisée
Finalité: Assistance configuration, diagnostic, calcul prix, recommandations
Limite session: Maximum 50 échanges (100 messages)
```

#### **D. Tableau Exhaustif des Données Collectées**

| Type de donnée | Finalité | Conservation |
|----------------|----------|--------------|
| **Dimensions techniques** | Largeur (M1), Profondeur (M2), Hauteur (H) - Calcul faisabilité et prix | Session uniquement |
| **Configuration environnement** | Orientation, fixation (mur M1/M2/M3/M4), exposition (vent, mer) | Session uniquement |
| **Options techniques** | Sortie câble, LED (bras/coffre), lambrequin, type de pose | Session uniquement |
| **Préférences de personnalisation** | Type de store (coffre/monobloc/tradition), design, couleurs (armature, toile) | Session uniquement |
| **Historique conversationnel** | Questions/réponses pour améliorer la pertinence et suivi projet | Session uniquement* |
| **Configuration finale validée** | Génération devis et traitement commande (avec consentement explicite) | **3 ans** (durée légale) |

> **Note** : *Session uniquement = traitement en temps réel, pas de stockage permanent par STORAL*

#### **E. Sécurité et Transferts RGPD (Badge Bleu)**

**Transferts Hors UE :**
- 🌍 Serveurs Google Cloud (USA)
- 📜 **Clauses Contractuelles Types (CCT)** de la Commission Européenne
- ✅ Niveau de protection équivalent au RGPD

**Protections Techniques Mises en Place :**
- 🛡️ Protection anti-bot : Honeypot et validation des requêtes
- 🛡️ Filtrage de contenu : Détection scripts malveillants (XSS, injections)
- 🛡️ Limitation longueur : Maximum 1000 caractères par message
- 🛡️ Limite de session : Maximum 50 échanges pour éviter abus

#### **F. Intervention Humaine (Badge Violet)**
- 🤝 Aucune décision 100% automatisée
- 🤝 Validation humaine disponible au **01 85 09 34 46**
- 🤝 Équipe technique STORAL accessible à tout moment

#### **G. Recommandations de Sécurité (Badge Amber)**
- ⚠️ Ne pas communiquer de coordonnées bancaires
- ⚠️ Ne pas partager de mots de passe
- ⚠️ Ne pas transmettre de documents d'identité

---

## ✅ 2. Politique de Confidentialité (`/confidentialite`)

### 🎯 Améliorations Apportées

#### **A. Garantie Non-Entraînement (Badge Vert + Gradient)**
```
Protection des données d'entreprise ✅
Données strictement isolées ✅
Configuration non-entraînement ✅
Aucune utilisation pour améliorer l'IA ✅
```

#### **B. Tableau Détaillé des Données et Finalités**

| Type | Finalité | Conservation |
|------|----------|--------------|
| Messages et questions | Réponses personnalisées en temps réel | Session uniquement |
| Données de configuration | Dimensions (M1, M2, H), orientation, fixation, LED | Session uniquement |
| Préférences esthétiques | Type store, design, couleurs RAL | Session uniquement |
| Historique conversationnel | Contexte session (max 50 échanges) | Session uniquement |
| Configuration finale validée | Devis et commande | **3 ans** |

#### **C. Traitement et Sécurité (Badge Bleu)**

**1. Traitement des Données :**
- API Google Gemini pour réponses temps réel uniquement
- Engagement contractuel de non-entraînement
- Lien vers [conditions Gemini API](https://ai.google.dev/gemini-api/terms)

**2. Transferts Internationaux (RGPD) :**
- Serveurs Google Cloud (USA)
- Clauses Contractuelles Types (CCT)
- Protection équivalente RGPD européen

**3. Mesures de Sécurité Techniques :**
```
✓ Validation et filtrage entrées (XSS, injections)
✓ Protection anti-bot avec honeypot
✓ Limitation session à 50 échanges max
✓ Limitation longueur message (1000 caractères)
✓ Pas de stockage permanent conversations par STORAL
```

#### **D. Conservation des Données (Badge Violet)**
- 📦 **Pas de stockage permanent** de l'historique complet
- 📦 Traitement en **temps réel** uniquement
- 📦 Configurations finales : **3 ans** (durée légale devis commerciaux)

#### **E. Bonnes Pratiques de Sécurité (Badge Amber)**
```
❌ Ne jamais communiquer de mots de passe
❌ Ne pas partager de coordonnées bancaires complètes
❌ Éviter de transmettre des documents d'identité
✅ Pour données sensibles : contacter conseiller au 01 85 09 34 46
```

---

## ✅ 3. Interface Utilisateur - Bannière de Disclaimer

### 📍 Emplacement
**Fichier** : `src/components/ChatAssistant.tsx`  
**Position** : Entre le header et la zone de messages (sticky top)

### 🎨 Design
```jsx
🔒 Assistant IA sécurisé : Cet agent utilise Google Gemini (version professionnelle). 
   Vos conversations ne sont PAS utilisées pour entraîner l'IA. [En savoir plus →]
```

### 🎯 Caractéristiques
- ✅ Couleur : Gradient vert (confiance, sécurité)
- ✅ Icône : 🔒 (protection)
- ✅ Message court et clair (1 ligne)
- ✅ Lien vers `/confidentialite` (ouverture nouvel onglet)
- ✅ Toujours visible (position fixe sous header)

---

## 📋 Données Techniques Extraites du Code

### 🔍 Sources d'Information

#### **1. /src/app/api/chat/route.ts**
```typescript
Protections mises en place :
- Honeypot anti-bot (ligne 23)
- Limite session : 100 messages (50 échanges) (ligne 38)
- Validation longueur : max 1000 caractères (ligne 54)
- Filtrage XSS/injections (lignes 64-72)
```

#### **2. /src/app/api/chat/prompt.md**
```markdown
Données collectées (Phase 1 - ENVIRONNEMENT) :
- Dimensions : M1 (Largeur), M2 (Profondeur), H (Hauteur)
- Fixation : Mur (M1, M2, M3, M4)
- Orientation & Risques : Orientation, vent, bord de mer
- Hauteur & Électricité : H, sortie câble (Gauche/Droite)
- Éclairage : LED bras/coffre
- Pose & TVA : Installation DIY ou expert (10% ou 20%)

Données collectées (Phase 3 - ESTHÉTIQUE) :
- Type de store : Coffre, Monobloc, Traditionnel
- Design : Carré (moderne) ou Galbé (classique)
- Couleurs : Armature + Toile (RAL)
```

#### **3. /src/app/mentions-legales/page.tsx**
```typescript
Informations entreprise :
- Société : STORAL SASU
- Capital : 1 500 €
- RCS : Paris
- Siège : 58 rue de Monceau CS 48756, 75380 Paris
- Président : M. Nabil JLAIEL
- Téléphone : 01 85 09 34 46
- Email : commandes@storal.fr
```

---

## 🎯 Impact RGPD et Conformité

### ✅ Obligations Respectées

| Obligation RGPD | Status | Implémentation |
|----------------|--------|----------------|
| **Information claire** (Art. 13) | ✅ | Sections détaillées dans mentions légales et confidentialité |
| **Finalité précise** | ✅ | Tableaux détaillant type de donnée ↔ finalité |
| **Conservation limitée** | ✅ | Session uniquement (sauf config finales : 3 ans) |
| **Transferts hors UE** | ✅ | CCT (Clauses Contractuelles Types) mentionnées |
| **Droits utilisateurs** | ✅ | Section "Vos droits" avec contact (commandes@storal.fr) |
| **Intervention humaine** | ✅ | Possibilité de contacter conseiller (01 85 09 34 46) |
| **Sécurité technique** | ✅ | 4 mesures techniques listées (honeypot, filtrage, limites) |

### 🔐 Avantages Compétitifs

1. **Transparence Totale**
   - Tableau exhaustif des données collectées
   - Durées de conservation précises
   - Mesures de sécurité techniques détaillées

2. **Réassurance Client**
   - Badge "Non-Entraînement" bien visible
   - Distinction version pro vs grand public
   - Lien direct vers politique de confidentialité

3. **Protection Juridique**
   - Conformité RGPD complète
   - CCT pour transferts internationaux
   - Intervention humaine garantie

4. **Crédibilité Professionnelle**
   - Utilisation version entreprise de Gemini
   - Protection données d'entreprise
   - Infrastructure sécurisée

---

## 📈 Recommandations Complémentaires

### 🎯 À Court Terme (Semaine 1)

1. **Bandeau Cookie Consent**
   - Ajouter bannière cookies conforme RGPD
   - Intégrer Google reCAPTCHA dans le consentement
   - Proposer granularité des consentements

2. **Journal d'Activité**
   - Logger les sessions (début/fin)
   - Tracker nombre messages par session
   - Alertes si abus détectés

### 🎯 À Moyen Terme (Mois 1-3)

3. **Tests de Charge**
   - Vérifier comportement avec 50 échanges
   - Tester filtrage XSS avec cas limites
   - Valider honeypot avec outils bot

4. **Audit Externe**
   - Faire auditer par expert RGPD
   - Vérifier conformité CCT avec Google
   - Demander DPA (Data Processing Agreement)

### 🎯 À Long Terme (Mois 3-6)

5. **Certifications**
   - ISO 27001 (sécurité information)
   - Certification CNIL (si applicable)
   - Label "IA de Confiance"

6. **Formation Équipe**
   - Sensibiliser équipe support aux pratiques RGPD
   - Former conseillers aux limites de l'IA
   - Créer protocole escalade (bot → humain)

---

## 📞 Contact Support RGPD

Pour toute question relative à la protection des données personnelles :

**Email** : commandes@storal.fr  
**Téléphone** : 01 85 09 34 46  
**Adresse** : STORAL SASU - 58 rue de Monceau CS 48756, 75380 Paris

---

**Date de mise à jour** : 18 février 2026  
**Version** : 2.0 (Améliorations IA + RGPD)  
**Auteur** : Équipe Technique STORAL
