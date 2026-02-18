# 📥 Guide de Téléchargement et Mise en Place du DPA Google Cloud

**Pour** : STORAL SASU  
**Concerne** : Data Processing Agreement (DPA) avec Google LLC pour l'API Gemini  
**Date** : 18 février 2026  
**Version** : 1.0

---

## 🎯 Objectif

Ce guide vous permet de :
1. ✅ Télécharger le DPA officiel de Google Cloud
2. ✅ Vérifier que vous êtes couvert par les Clauses Contractuelles Types (CCT)
3. ✅ Archiver la preuve de conformité RGPD
4. ✅ Comprendre vos obligations et droits

---

## 📋 Étape 1 : Vérifier Votre Éligibilité

### Conditions pour Bénéficier du DPA Google

Vous devez avoir un **compte Google Cloud actif** avec l'API Gemini activée.

**Vérification rapide :**

```bash
# Dans votre terminal
echo $GOOGLE_GENERATIVE_AI_API_KEY
# Si vous obtenez une clé : vous êtes éligible ✅
```

**Ou via la Console Google Cloud :**

1. Allez sur https://console.cloud.google.com
2. Menu **API & Services** → **Credentials**
3. Vérifiez que vous avez une clé API active pour "Generative Language API"

### Votre Status Actuel (STORAL)

✅ **Vous êtes éligible** si :
- Vous avez créé un compte Google Cloud
- Vous avez activé l'API Gemini (Generative AI)
- Vous utilisez cette API depuis votre code (`@ai-sdk/google`)

---

## 📥 Étape 2 : Télécharger le DPA Officiel

### Méthode A : Via la Console Google Cloud (Recommandé)

**1. Connexion**
```
URL : https://console.cloud.google.com
Login : Votre compte Google lié au projet STORAL
```

**2. Navigation**
```
Menu hamburger (☰) 
  → IAM & Admin 
  → Settings
  → Section "Data Processing Amendment"
```

**3. Téléchargement**
- Cliquez sur **"Download PDF"**
- Fichier généré : `Google_Cloud_Data_Processing_Addendum.pdf`
- Sauvegardez-le dans : `/docs/conformite/DPA_Google_Cloud_v4.0.pdf`

### Méthode B : Téléchargement Direct (Alternative)

**1. Accédez au lien public :**
```
https://cloud.google.com/terms/data-processing-addendum
```

**2. Cliquez sur "Download PDF" (en haut de page)**

**3. Vous obtiendrez le DPA complet (~30 pages) incluant :**
- Clauses Contractuelles Types (CCT) 2021
- Mesures de sécurité techniques
- Certifications Google (ISO 27001, SOC 2)
- Droits d'audit
- Procédures de notification d'incident

---

## 📄 Étape 3 : Vérifier le Contenu du DPA

### Ce que vous DEVEZ trouver dans le DPA :

#### ✅ Section 1 : Définitions
- **Responsable du traitement** : Vous (STORAL)
- **Sous-traitant** : Google LLC
- **Données à caractère personnel** : Messages, configurations utilisateurs

#### ✅ Section 2 : Durée et Portée
- **Services couverts** : Google Cloud Platform (dont API Gemini)
- **Durée** : Tant que vous utilisez les services

#### ✅ Section 3 : Obligations de Google (Sous-traitant)

**Google s'engage à :**
- Traiter les données uniquement sur vos instructions
- Chiffrer les données en transit (TLS) et au repos (AES-256)
- Ne pas utiliser vos données pour améliorer ses propres services (pour la version API entreprise)
- Assister en cas d'exercice de droits RGPD par vos utilisateurs
- Notifier sous 72h en cas de violation de données

#### ✅ Section 4 : Clauses Contractuelles Types (CCT)

**Module 2 : Responsable vers Sous-traitant**
- Conformité : Décision d'exécution (UE) 2021/914
- Transferts vers USA : Couverts par ces clauses
- Droit applicable : Loi irlandaise (siège européen de Google)

#### ✅ Section 5 : Mesures de Sécurité (Annexe 2)

| Mesure | Description |
|--------|-------------|
| **Chiffrement** | TLS 1.3 (transit), AES-256 (stockage) |
| **Accès** | Authentification multi-facteurs (MFA) |
| **Isolation** | Données clients isolées (multitenancy sécurisé) |
| **Logs** | Journalisation des accès (90 jours min) |
| **Tests** | Pentests réguliers, bug bounty |
| **Certifications** | ISO 27001, ISO 27017, ISO 27018, SOC 2 Type II |

#### ✅ Section 6 : Sous-Traitants Ultérieurs

Google liste les sous-traitants qu'il peut utiliser (ex: fournisseurs datacenter).
Vous êtes notifié 30 jours avant ajout d'un nouveau sous-traitant.

---

## 📂 Étape 4 : Archivage et Organisation

### Structure de Dossiers Recommandée

```
/docs/
  /conformite/
    ├── DPA_Google_Cloud_v4.0.pdf          ← DPA téléchargé
    ├── CCT_Commission_Europeenne_2021.pdf ← Clauses Contractuelles (optionnel)
    ├── Certificat_ISO27001_Google.pdf     ← Certifications (optionnel)
    └── REGISTRE_TRAITEMENT_RGPD.md        ← Votre registre (déjà créé)
```

### Informations à Noter

Créez un fichier `DPA_METADATA.md` :

```markdown
# Métadonnées du DPA Google Cloud

**Nom du document** : Google Cloud Data Processing Addendum  
**Version** : 4.0 (février 2024)  
**Date téléchargement** : 18 février 2026  
**Téléchargé par** : Nabil JLAIEL  
**URL source** : https://cloud.google.com/terms/data-processing-addendum  
**Hash SHA-256** : [Calculer avec `shasum -a 256 fichier.pdf`]  
**Statut** : ✅ Actif  
**Prochaine revue** : 18 février 2027  
```

---

## 🔍 Étape 5 : Vérification de Conformité (Checklist)

### Checklist de Validation

#### ✅ DPA en Place
- [ ] DPA téléchargé et archivé
- [ ] Version identifiée (v4.0 ou supérieur)
- [ ] Date de téléchargement notée

#### ✅ Clauses Contractuelles Types (CCT)
- [ ] CCT incluses dans le DPA (Module 2)
- [ ] Date CCT : 2021/914 (version la plus récente)
- [ ] Transferts USA couverts

#### ✅ Mesures de Sécurité
- [ ] Chiffrement TLS 1.3 confirmé
- [ ] Certifications ISO 27001/27018/SOC 2 vérifiées
- [ ] Procédure notification incidents comprise

#### ✅ Non-Entraînement IA
- [ ] Version API entreprise confirmée (pas gratuite)
- [ ] Engagement non-utilisation données pour améliorer l'IA
- [ ] Mentionné dans vos mentions légales

#### ✅ Documentation Interne
- [ ] Registre de traitement RGPD mis à jour
- [ ] DPA référencé dans le registre
- [ ] Équipe informée

---

## 📊 Étape 6 : Intégration dans Votre Registre RGPD

### Mise à Jour à Effectuer

Dans votre fichier `REGISTRE_TRAITEMENT_RGPD.md`, section **11.1 Contrats et DPA en Place**, ajoutez :

```markdown
| Document | Sous-traitant | Version | Date téléchargement | Statut | Localisation |
|----------|---------------|---------|---------------------|--------|--------------|
| **Google Cloud Data Processing Addendum** | Google LLC | v4.0 | 18/02/2026 | ✅ Actif | /docs/conformite/DPA_Google_Cloud_v4.0.pdf |
```

---

## 🔔 Étape 7 : Surveillance et Maintenance

### Actions Récurrentes

| Action | Fréquence | Prochaine Date | Responsable |
|--------|-----------|----------------|-------------|
| **Vérifier mises à jour DPA** | Annuelle | 18/02/2027 | Nabil JLAIEL |
| **Consulter notifications Google** | Trimestrielle | 18/05/2026 | Équipe technique |
| **Audit certifications Google** | Annuelle | 18/02/2027 | Nabil JLAIEL |
| **Revue des sous-traitants ultérieurs** | Semestrielle | 18/08/2026 | Nabil JLAIEL |

### Comment Recevoir les Notifications Google ?

**1. Activer les Alertes Email**
```
Google Cloud Console 
  → Notifications 
  → Abonnez-vous aux "Service Updates" et "Security Bulletins"
```

**2. Suivre les Annonces Publiques**
- Blog Google Cloud : https://cloud.google.com/blog
- Status Page : https://status.cloud.google.com
- Page Gemini API : https://ai.google.dev/gemini-api

---

## ⚠️ Que Faire en Cas de Modification du DPA ?

### Google Vous Notifie 30 Jours Avant

**1. Recevoir la Notification**
- Par email (si alertes activées)
- Via la console Google Cloud (bannière)

**2. Analyser les Changements**
- Lire le résumé des modifications
- Comparer avec la version actuelle
- Identifier l'impact sur STORAL

**3. Actions Possibles**

| Scénario | Action | Délai |
|----------|--------|-------|
| **Modifications mineures** (clarifications, typos) | Accepter automatiquement | Aucune action |
| **Modifications techniques** (nouvelles certifications) | Mettre à jour le registre | < 7 jours |
| **Modifications majeures** (changement CCT, localisation) | Analyser l'impact RGPD + consulter avocat si nécessaire | < 30 jours |
| **Modifications inacceptables** | Cesser d'utiliser le service (rare) | Avant date d'effet |

**4. Archiver la Nouvelle Version**
```
/docs/conformite/
  ├── DPA_Google_Cloud_v4.0.pdf  (ancienne version - garder)
  ├── DPA_Google_Cloud_v5.0.pdf  (nouvelle version)
  └── CHANGELOG_DPA.md           (historique des changements)
```

---

## 🔐 Étape 8 : Audit et Contrôle (Niveau Avancé)

### Votre Droit d'Audit du DPA

Le DPA vous donne le droit de vérifier que Google respecte ses engagements.

#### Option A : Audit sur Rapports (Simplifié)

**Google fournit des rapports d'audit indépendants :**
- **SOC 2 Type II** : Audit annuel de sécurité
- **ISO 27001** : Certification management sécurité info
- **ISO 27018** : Protection données cloud

**Comment les obtenir ?**
```
1. Google Cloud Console → Security → Compliance
2. Télécharger les rapports SOC 2 / ISO (sous NDA)
3. Valider que Google est bien certifié
```

#### Option B : Audit Sur Site (Entreprises > 1M€ CA)

**Procédure :**
1. Demande écrite à Google Cloud Support
2. Justification : Obligation RGPD Article 28
3. Négociation scope et date
4. Audit réalisé par cabinet indépendant (frais à votre charge)

**Coût estimé** : 10 000€ - 50 000€ (rarement nécessaire pour PME)

---

## 📧 Contacts Utiles

### Support Google Cloud

| Type de Contact | Information |
|----------------|-------------|
| **Support Technique** | https://cloud.google.com/support |
| **Support RGPD/Privacy** | https://support.google.com/cloud/answer/6056694 |
| **DPO Google Europe** | Formulaire sur https://policies.google.com/privacy/update |
| **Adresse postale Google** | Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland |

### Autorités de Contrôle

| Autorité | Contact |
|----------|---------|
| **CNIL (France)** | www.cnil.fr - Téléphone : 01 53 73 22 22 |
| **Commission Européenne** | https://ec.europa.eu/info/law/law-topic/data-protection_fr |

---

## 📚 Ressources Complémentaires

### Documentation Officielle Google

1. **Termes de Service Gemini API**  
   https://ai.google.dev/gemini-api/terms

2. **Centre de Sécurité Google Cloud**  
   https://cloud.google.com/security

3. **Guide de Conformité RGPD Google**  
   https://cloud.google.com/privacy/gdpr

4. **Liste des Sous-Traitants Google**  
   https://cloud.google.com/terms/subprocessors

### Guides CNIL

1. **Le registre des activités de traitement**  
   https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement

2. **Les transferts de données hors de l'UE**  
   https://www.cnil.fr/fr/les-transferts-de-donnees-hors-de-lue

3. **Le DPA et les clauses contractuelles**  
   https://www.cnil.fr/fr/les-clauses-contractuelles-types

---

## ✅ Résumé : Checklist Complète

### Actions Immédiates (Aujourd'hui)

- [ ] **Télécharger le DPA Google Cloud** (Méthode A ou B)
- [ ] **Archiver dans** `/docs/conformite/DPA_Google_Cloud_v4.0.pdf`
- [ ] **Créer** `DPA_METADATA.md` avec infos clés
- [ ] **Vérifier présence des CCT** dans le DPA (pages 15-25 environ)

### Actions à Court Terme (Semaine 1)

- [ ] **Lire les sections 3, 4, 5** du DPA (obligations, CCT, sécurité)
- [ ] **Mettre à jour le registre RGPD** avec référence au DPA
- [ ] **Activer alertes email** Google Cloud
- [ ] **Informer l'équipe** de l'existence du DPA

### Actions à Moyen Terme (Mois 1)

- [ ] **Télécharger rapports SOC 2/ISO** (si besoin)
- [ ] **Créer calendrier de revue** du DPA (annuel)
- [ ] **Documenter procédure** en cas de modification DPA

### Actions à Long Terme (Année 1)

- [ ] **Audit interne conformité** RGPD (incluant DPA)
- [ ] **Revue annuelle du DPA** (18/02/2027)
- [ ] **Formation équipe** sur obligations RGPD

---

## 🎯 Conclusion

**Félicitations !** Vous avez maintenant :

✅ Un DPA valide avec Google LLC  
✅ Une couverture par les Clauses Contractuelles Types (CCT)  
✅ Une documentation complète de conformité RGPG  
✅ Un calendrier de maintenance et surveillance  

**Votre niveau de conformité RGPD est maintenant : EXCELLENT** 🏆

---

**Document rédigé par** : Équipe Technique STORAL  
**Date** : 18 février 2026  
**Version** : 1.0  
**Prochaine révision** : 18 février 2027
