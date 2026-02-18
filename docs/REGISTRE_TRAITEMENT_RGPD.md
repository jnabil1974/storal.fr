# 📋 Registre des Traitements de Données Personnelles - STORAL

**Conformité** : Règlement Général sur la Protection des Données (RGPD) - Article 30  
**Responsable du traitement** : STORAL SASU  
**Date de création** : 18 février 2026  
**Dernière mise à jour** : 18 février 2026  
**Version** : 1.0

---

## 📌 Informations sur le Responsable du Traitement

| Élément | Information |
|---------|-------------|
| **Raison sociale** | STORAL |
| **Forme juridique** | Société par Actions Simplifiée Unipersonnelle (SASU) |
| **Capital social** | 1 500 € |
| **RCS** | Paris |
| **Siège social** | 58 rue de Monceau CS 48756, 75380 Paris |
| **Président** | M. Nabil JLAIEL |
| **Contact DPO/RGPD** | commandes@storal.fr |
| **Téléphone** | 01 85 09 34 46 |
| **Site web** | https://storal.fr |

---

## 🔐 TRAITEMENT N°1 : Assistant IA Conversationnel (Google Gemini)

### 1. Identification du Traitement

| Champ | Détail |
|-------|--------|
| **Nom du traitement** | Assistant Conversationnel IA pour Configuration de Stores Bannes |
| **Code interne** | STORAL-AI-GEMINI-001 |
| **Service concerné** | Site web storal.fr - Section /assistant |
| **Date de mise en service** | Février 2026 |
| **Responsable opérationnel** | Nabil JLAIEL (président) |

### 2. Finalités du Traitement

#### Finalités Principales
1. **Assistance à la configuration technique** : Aide au choix de dimensions (largeur M1, profondeur M2, hauteur H)
2. **Diagnostic environnemental** : Analyse orientation, exposition (vent, mer), type de fixation (murs M1/M2/M3/M4)
3. **Calcul de prix personnalisé** : Génération d'offres Eco/Standard/Premium avec options (LED, lambrequin, pose)
4. **Recommandations produits** : Suggestion de modèles adaptés parmi les 13 gammes STORAL
5. **Génération de devis** : Création de configurations validées pour commande

#### Finalités Secondaires
- Amélioration de l'expérience utilisateur (UX)
- Réduction du taux d'abandon de configuration
- Support technique 24/7 automatisé

### 3. Base Légale (RGPD Article 6)

| Finalité | Base Légale | Justification |
|----------|-------------|---------------|
| Configuration technique | **Intérêt légitime** (Art. 6.1.f) | Amélioration du service et aide à la décision d'achat |
| Génération de devis | **Consentement explicite** (Art. 6.1.a) | Validation finale par le client avant enregistrement |
| Support client | **Exécution du contrat** (Art. 6.1.b) | Nécessaire à la relation commerciale |

### 4. Catégories de Données Collectées

#### 4.1 Données Techniques de Configuration

| Type de donnée | Exemples | Caractère sensible | Conservation |
|----------------|----------|-------------------|--------------|
| **Dimensions** | Largeur (M1): 3.5m, Profondeur (M2): 2.8m, Hauteur (H): 2.5m | Non | Session uniquement |
| **Fixation** | Mur de fixation (M1, M2, M3, M4) | Non | Session uniquement |
| **Orientation** | Sud, Sud-Est, Ouest | Non | Session uniquement |
| **Exposition** | Zone ventée, bord de mer, certification Qualimarine | Non | Session uniquement |
| **Électricité** | Sortie câble gauche/droite, présence prise | Non | Session uniquement |

#### 4.2 Préférences Utilisateur

| Type de donnée | Exemples | Caractère sensible | Conservation |
|----------------|----------|-------------------|--------------|
| **Type de store** | Coffre, Monobloc, Traditionnel | Non | Session uniquement |
| **Design** | Carré compact, Galbé, Bras croisés | Non | Session uniquement |
| **Couleur armature** | RAL 9010 (Blanc), RAL 7016 (Anthracite), RAL 9005 (Noir) | Non | Session uniquement |
| **Couleur toile** | Dickson Orchestra, Soltis, Matest | Non | Session uniquement |
| **Options** | LED bras, LED cassette, Lambrequin fixe/enroulable, Fixation plafond | Non | Session uniquement |

#### 4.3 Données Conversationnelles

| Type de donnée | Exemples | Caractère sensible | Conservation |
|----------------|----------|-------------------|--------------|
| **Messages utilisateur** | "Je veux un store de 5x3m", "Quelle couleur pour une façade blanche ?" | Non | Session uniquement* |
| **Historique session** | Contexte des 50 derniers échanges max | Non | Session uniquement* |
| **Réponses IA** | Recommandations techniques, explications | Non | Session uniquement* |

> **\* Session uniquement** = Données traitées en temps réel par l'API Google Gemini, non stockées de manière permanente par STORAL après fermeture de la session.

#### 4.4 Données de Commande (après validation)

| Type de donnée | Exemples | Caractère sensible | Conservation |
|----------------|----------|-------------------|--------------|
| **Configuration validée** | Résumé complet de la configuration choisie | Non | **3 ans** |
| **Type de TVA** | 10% (pose par STORAL) ou 20% (auto-installation) | Non | **3 ans** |
| **Choix de pose** | Installation par expert STORAL ou DIY | Non | **3 ans** |
| **Prix accepté** | Offre Eco/Standard/Premium choisie | Non | **3 ans** |

### 5. Destinataires des Données

#### 5.1 Destinataires Internes (STORAL)

| Service | Accès | Finalité |
|---------|-------|----------|
| **Service Commercial** | Configurations validées uniquement | Traitement des devis et commandes |
| **Service Technique** | Configurations + contraintes techniques | Validation faisabilité et préparation installation |
| **Service Client** | Historique des configurations clients | Support après-vente |

#### 5.2 Sous-Traitants Externes

| Sous-traitant | Localisation | Service fourni | DPA en place | Date signature |
|---------------|--------------|----------------|--------------|----------------|
| **Google LLC** | USA (serveurs Google Cloud) | API Gemini - Traitement IA conversationnel | ✅ Oui | Accepté lors création compte API |
| **Vercel** (hébergement) | USA/Europe | Hébergement Next.js (frontend) | ✅ Oui | Accepté dans ToS |
| **Supabase** (base de données) | Europe | Stockage configurations validées | ✅ Oui | Accepté dans ToS |

### 6. Transferts de Données Hors Union Européenne

#### 6.1 Transfert vers Google LLC (USA)

| Élément | Détail |
|---------|--------|
| **Pays destinataire** | États-Unis (USA) |
| **Données transférées** | Messages conversationnels, contexte de session, données de configuration techniques |
| **Finalité du transfert** | Traitement par l'API Gemini pour génération de réponses en temps réel |
| **Garanties appropriées** | **Clauses Contractuelles Types (CCT)** approuvées par la Commission Européenne (version 2021) |
| **Référence DPA** | Google Cloud Data Processing Addendum v4.0 |
| **Lien DPA** | https://cloud.google.com/terms/data-processing-addendum |
| **Certification Google** | ISO 27001, SOC 2 Type II, ISO 27018 |
| **Engagement non-entraînement** | ✅ Version API entreprise : données NON utilisées pour entraîner les modèles IA |

#### 6.2 Autres Transferts Potentiels

| Service | Pays | Garanties | Status |
|---------|------|-----------|--------|
| **Vercel (CDN)** | USA | Clauses Contractuelles Types | ✅ Actif |
| **Cloudflare (CDN)** | USA/Europe | Clauses Contractuelles Types | ✅ Actif (si utilisé) |

### 7. Durées de Conservation

| Type de donnée | Durée | Base légale | Action après expiration |
|----------------|-------|-------------|-------------------------|
| **Messages conversationnels** | Session active uniquement (quelques heures max) | Intérêt légitime | Suppression automatique à fermeture session |
| **Historique session (contexte)** | Maximum 50 échanges par session | Limitation technique | Écrasement automatique après 50 messages |
| **Configurations non validées** | Session active uniquement | Absence de consentement | Aucun stockage permanent |
| **Configurations validées (devis)** | **3 ans** à compter de la validation | Obligation légale commerciale (Code de commerce) | Archivage ou suppression |
| **Commandes finalisées** | **10 ans** (obligations comptables) | Obligation légale fiscale | Archivage sécurisé puis suppression |

### 8. Mesures de Sécurité Techniques et Organisationnelles

#### 8.1 Sécurité Technique (Code Source)

| Mesure | Implémentation | Fichier source | Ligne |
|--------|---------------|----------------|-------|
| **Chiffrement TLS** | TLS 1.3 pour toutes communications API | Next.js (natif) | N/A |
| **Protection anti-bot** | Honeypot (champ invisible) | `/src/app/api/chat/route.ts` | Ligne 23 |
| **Filtrage XSS/Injections** | Regex détection scripts malveillants | `/src/app/api/chat/route.ts` | Lignes 64-72 |
| **Limitation longueur message** | Maximum 1000 caractères | `/src/app/api/chat/route.ts` | Ligne 54 |
| **Limitation session** | Maximum 50 échanges (100 messages) | `/src/app/api/chat/route.ts` | Ligne 38 |
| **Validation entrées** | Sanitization avant transmission API | `/src/app/api/chat/route.ts` | Lignes 48-84 |

#### 8.2 Sécurité Organisationnelle

| Mesure | Description | Responsable | Fréquence |
|--------|-------------|-------------|-----------|
| **Accès restreint** | Seuls les admins accèdent aux logs Google Cloud | Nabil JLAIEL | Contrôle permanent |
| **Journalisation** | Logs des erreurs et anomalies | Google Cloud Logging | Temps réel |
| **Mises à jour sécurité** | Patchs dependencies npm | Équipe technique | Mensuel |
| **Tests de sécurité** | Tests filtrage XSS, validation formulaires | Équipe technique | À chaque déploiement |
| **Sensibilisation équipe** | Formation RGPD pour équipe support | DPO/Président | Annuel |

#### 8.3 Gestion des Incidents

| Action | Procédure | Délai RGPD |
|--------|-----------|------------|
| **Détection incident** | Monitoring Google Cloud + logs applicatifs | Temps réel |
| **Notification interne** | Alerte président + équipe technique | < 2h |
| **Analyse gravité** | Évaluation risque pour les droits et libertés | < 24h |
| **Notification CNIL** | Si risque élevé (breach > 1000 personnes ou données sensibles) | < 72h |
| **Notification utilisateurs** | Si risque élevé pour leurs droits | < 5 jours |

### 9. Droits des Personnes Concernées

#### 9.1 Droits Applicables

| Droit | Article RGPD | Modalité d'exercice | Délai de réponse |
|-------|--------------|---------------------|------------------|
| **Droit d'accès** | Art. 15 | Email à commandes@storal.fr | 1 mois |
| **Droit de rectification** | Art. 16 | Email à commandes@storal.fr | 1 mois |
| **Droit à l'effacement** | Art. 17 | Email à commandes@storal.fr | 1 mois |
| **Droit d'opposition** | Art. 21 | Email à commandes@storal.fr | 1 mois |
| **Droit à la portabilité** | Art. 20 | Email à commandes@storal.fr (format JSON) | 1 mois |
| **Droit à la limitation** | Art. 18 | Email à commandes@storal.fr | 1 mois |

#### 9.2 Procédure d'Exercice des Droits

**Email** : commandes@storal.fr  
**Objet** : "Demande RGPD - [Type de droit]"  
**Pièces requises** : Justificatif d'identité (CNI recto uniquement, passeport)  
**Réponse** : Sous 1 mois maximum (prolongeable 2 mois si complexité)

### 10. Analyse d'Impact (AIPD)

#### 10.1 Nécessité d'une AIPD ?

**Question** : Le traitement est-il susceptible d'engendrer un risque élevé pour les droits et libertés des personnes ?

**Réponse** : ❌ **NON** - AIPD non obligatoire

**Justification** :
- ✅ Pas de profilage systématique à grande échelle
- ✅ Pas de données sensibles (santé, origine, opinions)
- ✅ Pas de surveillance systématique à grande échelle
- ✅ Mesures de sécurité robustes en place
- ✅ Durée de conservation limitée (session uniquement)
- ✅ Engagement non-entraînement IA (pas de décision automatisée impactante)

#### 10.2 Risques Identifiés et Mesures

| Risque | Gravité | Probabilité | Mesure de mitigation | Status |
|--------|---------|-------------|----------------------|--------|
| **Accès non autorisé aux conversations** | Moyenne | Faible | Chiffrement TLS 1.3, accès restreint Google Cloud | ✅ Mitigé |
| **Injection XSS/Scripts malveillants** | Élevée | Moyenne | Filtrage automatique + validation entrées | ✅ Mitigé |
| **Abus/Spam bot** | Faible | Moyenne | Honeypot + limitation session | ✅ Mitigé |
| **Fuite de données personnelles** | Élevée | Très faible | Pas de stockage permanent, CCT en place | ✅ Mitigé |

### 11. Documentation Contractuelle

#### 11.1 Contrats et DPA en Place

| Document | Sous-traitant | Date | Statut | Localisation |
|----------|---------------|------|--------|--------------|
| **Google Cloud Data Processing Addendum v4.0** | Google LLC | Accepté lors création compte | ✅ Actif | https://cloud.google.com/terms/data-processing-addendum |
| **Gemini API Terms of Service** | Google LLC | Accepté lors activation API | ✅ Actif | https://ai.google.dev/gemini-api/terms |
| **Vercel Terms of Service + DPA** | Vercel Inc. | Accepté lors déploiement | ✅ Actif | https://vercel.com/legal/dpa |
| **Supabase Data Processing Addendum** | Supabase Inc. | Accepté lors création projet | ✅ Actif | https://supabase.com/legal/dpa |

#### 11.2 Clauses Contractuelles Types (CCT)

**Version** : Clauses Contractuelles Types (CCT) de la Commission Européenne - Décision d'exécution (UE) 2021/914 du 4 juin 2021  
**Module applicable** : Module 2 (Responsable vers Sous-traitant)  
**Intégrées dans** : Google Cloud DPA, Vercel DPA, Supabase DPA

### 12. Audits et Contrôles

| Type d'audit | Fréquence | Dernière date | Prochaine date | Responsable |
|--------------|-----------|---------------|----------------|-------------|
| **Audit interne conformité RGPD** | Annuel | 18/02/2026 | 18/02/2027 | Nabil JLAIEL |
| **Revue des accès Google Cloud** | Trimestriel | 18/02/2026 | 18/05/2026 | Équipe technique |
| **Test sécurité (XSS, injections)** | À chaque déploiement | 18/02/2026 | Variable | Équipe technique |
| **Mise à jour dependencies** | Mensuel | 18/02/2026 | 18/03/2026 | Équipe technique |

### 13. Historique des Modifications

| Version | Date | Auteur | Modifications |
|---------|------|--------|---------------|
| **1.0** | 18/02/2026 | Nabil JLAIEL | Création initiale du registre - Traitement Assistant IA Gemini |

---

## 🔐 TRAITEMENT N°2 : Formulaires de Contact et Devis

### 1. Identification

| Champ | Détail |
|-------|--------|
| **Nom du traitement** | Formulaires de Contact et Demandes de Devis |
| **Code interne** | STORAL-CONTACT-002 |
| **Finalité principale** | Traitement des demandes de contact et génération de devis personnalisés |
| **Base légale** | Consentement explicite (Art. 6.1.a) + Exécution du contrat (Art. 6.1.b) |

### 2. Données Collectées

| Catégorie | Données | Conservation |
|-----------|---------|--------------|
| **Identité** | Nom, Prénom | 3 ans (prospect) / 10 ans (client) |
| **Contact** | Email, Téléphone | 3 ans (prospect) / 10 ans (client) |
| **Localisation** | Adresse installation (optionnel) | 3 ans |
| **Projet** | Description besoins, dimensions approximatives | 3 ans |

### 3. Destinataires

- Service Commercial STORAL
- Service Technique STORAL (si devis accepté)
- Resend API (envoi emails transactionnels) - Europe

### 4. Mesures de Sécurité

- Formulaire protégé par Google reCAPTCHA v3
- Chiffrement HTTPS (TLS 1.3)
- Validation côté serveur (filtrage XSS)
- Stockage chiffré base de données Supabase

---

## 🔐 TRAITEMENT N°3 : Newsletter et Communication Marketing

### 1. Identification

| Champ | Détail |
|-------|--------|
| **Nom du traitement** | Inscription Newsletter |
| **Code interne** | STORAL-NEWSLETTER-003 |
| **Finalité principale** | Envoi d'actualités produits, promotions, conseils techniques |
| **Base légale** | Consentement explicite (Art. 6.1.a) via opt-in |

### 2. Données Collectées

| Catégorie | Données | Conservation |
|-----------|---------|--------------|
| **Contact** | Email uniquement | Jusqu'à désinscription + 3 ans |
| **Consentement** | Date, heure, IP d'inscription | Durée + 5 ans (preuve) |

### 3. Droit de Désinscription

- Lien "Se désinscrire" dans chaque email
- Désinscription immédiate (< 48h traitement)
- Email confirmation de désinscription envoyé

---

## 📞 Contact DPO / RGPD

**Responsable de la conformité** : Nabil JLAIEL  
**Email** : commandes@storal.fr  
**Téléphone** : 01 85 09 34 46  
**Adresse** : STORAL SASU - 58 rue de Monceau CS 48756, 75380 Paris

---

## 📚 Références Légales

- **RGPD** : Règlement (UE) 2016/679 du 27 avril 2016
- **Loi Informatique et Libertés** : Loi n°78-17 du 6 janvier 1978 modifiée
- **CNIL** : www.cnil.fr
- **Commission Européenne** : https://ec.europa.eu/info/law/law-topic/data-protection_fr

---

**Signature du Responsable du Traitement**

Nabil JLAIEL  
Président - STORAL SASU  
Date : 18 février 2026  
Lieu : Paris, France
