# 🔐 Documentation Conformité RGPD & Sécurité - STORAL

**Dernière mise à jour** : 18 février 2026  
**Responsable** : Nabil JLAIEL (commandes@storal.fr)  
**Statut conformité** : ✅ Niveau 2 (Recommandé) - Roadmap Niveau 3 disponible

---

## 📚 Vue d'Ensemble des Documents

Ce dossier contient toute la documentation nécessaire pour assurer la conformité RGPD de STORAL, notamment concernant l'utilisation de l'assistant IA Google Gemini.

### 🗂️ Structure des Documents

```
/docs/
├── REGISTRE_TRAITEMENT_RGPD.md           ⭐ Document principal obligatoire
├── GUIDE_DPA_GOOGLE_CLOUD.md             📥 Procédure téléchargement DPA
├── PLAN_CONFORMITE_AVANCEE.md            🚀 Roadmap excellence (optionnel)
├── MENTIONS_LEGALES_IA_AMELIORATIONS.md  ℹ️ Changelog mentions légales
└── README_CONFORMITE.md                   📖 Ce fichier (navigation)
```

---

## 🎯 Les 3 Niveaux de Conformité RGPD

### ✅ Niveau 1 : Minimum Légal (FAIT)

**Statut** : ✅ **Complété le 18/02/2026**

**Ce qui a été fait :**
- ✅ Mentions légales complètes avec section IA
- ✅ Politique de confidentialité détaillée
- ✅ Conditions Générales de Vente (CGV) avec Article 3 IA
- ✅ Bannière disclaimer dans l'interface chat
- ✅ Garantie non-entraînement mentionnée
- ✅ Clauses Contractuelles Types (CCT) référencées

**Documents associés** :
- [src/app/mentions-legales/page.tsx](../src/app/mentions-legales/page.tsx)
- [src/app/confidentialite/page.tsx](../src/app/confidentialite/page.tsx)
- [src/app/cgv/page.tsx](../src/app/cgv/page.tsx)
- [MENTIONS_LEGALES_IA_AMELIORATIONS.md](MENTIONS_LEGALES_IA_AMELIORATIONS.md)

---

### ✅ Niveau 2 : Recommandé (FAIT)

**Statut** : ✅ **Complété le 18/02/2026**

**Ce qui a été fait :**
- ✅ Registre de traitement RGPD complet (3 traitements documentés)
- ✅ Guide de téléchargement du DPA Google Cloud
- ✅ Documentation des mesures de sécurité techniques
- ✅ Procédures d'exercice des droits RGPD
- ✅ Analyse d'impact (AIPD non nécessaire - justification documentée)

**Documents à consulter** :
- 📋 [REGISTRE_TRAITEMENT_RGPD.md](REGISTRE_TRAITEMENT_RGPD.md) - **Document principal**
- 📥 [GUIDE_DPA_GOOGLE_CLOUD.md](GUIDE_DPA_GOOGLE_CLOUD.md) - Procédure DPA

**Actions à réaliser :**
1. [ ] Télécharger le DPA Google Cloud (voir guide)
2. [ ] Archiver le DPA dans `/docs/conformite/`
3. [ ] Activer les alertes Google Cloud
4. [ ] Planifier revue annuelle (18/02/2027)

---

### 🚀 Niveau 3 : Excellence (ROADMAP)

**Statut** : 📋 **Roadmap créée - Déploiement 12 mois**

**Ce que cela apporte :**
- 🛡️ Assurance cyber-risque (protection financière)
- 🔒 Audits externes (pentest, RGPD, cloud)
- 🏅 Certifications (ISO 27001, Label IA Responsable)
- 👔 DPO externe dédié
- 🎓 Formation continue équipe

**Document à consulter** :
- 🚀 [PLAN_CONFORMITE_AVANCEE.md](PLAN_CONFORMITE_AVANCEE.md) - Roadmap complète

**Budget prévisionnel** :
- Année 1 : 36 000€
- Années suivantes : 16 800€/an
- **ROI** : 101% dès année 1

---

## 📋 Document Principal : Registre de Traitement RGPD

### 🎯 À quoi sert ce registre ?

Le registre de traitement est **obligatoire** selon l'Article 30 du RGPD pour toutes les entreprises qui traitent des données personnelles.

**Contenu du registre STORAL :**

1. **Traitement N°1 : Assistant IA Conversationnel (Google Gemini)**
   - Finalités : Configuration stores, calcul prix, recommandations
   - Données : Dimensions (M1, M2, H), préférences, messages
   - Conservation : Session uniquement (sauf devis : 3 ans)
   - Sous-traitant : Google LLC (USA) - DPA + CCT en place
   - Mesures sécurité : 6 protections techniques listées

2. **Traitement N°2 : Formulaires de Contact et Devis**
   - Données : Nom, email, téléphone, description projet
   - Conservation : 3 ans (prospects) / 10 ans (clients)

3. **Traitement N°3 : Newsletter**
   - Données : Email + consentement
   - Conservation : Jusqu'à désinscription + 3 ans

### 📖 Comment l'utiliser ?

**Pour mise à jour** :
1. Ouvrir [REGISTRE_TRAITEMENT_RGPD.md](REGISTRE_TRAITEMENT_RGPD.md)
2. Modifier la section concernée
3. Mettre à jour l'historique (section 13)
4. Sauvegarder et archiver l'ancienne version

**Pour audit CNIL** :
- Fournir ce document complet
- Joindre le DPA Google Cloud
- Ajouter les mentions légales (site web)

---

## 📥 Guide DPA : Téléchargement et Mise en Place

### 🎯 Qu'est-ce qu'un DPA ?

Le **Data Processing Agreement** est un contrat obligatoire entre :
- **STORAL** (responsable du traitement)
- **Google LLC** (sous-traitant)

### 📝 Comment l'obtenir ?

**Méthode simple (5 minutes) :**

1. **Connexion** : https://console.cloud.google.com
2. **Navigation** : Menu → IAM & Admin → Settings
3. **Téléchargement** : Section "Data Processing Amendment" → Download PDF
4. **Archivage** : Sauvegarder dans `/docs/conformite/DPA_Google_Cloud_v4.0.pdf`

**Guide complet** : [GUIDE_DPA_GOOGLE_CLOUD.md](GUIDE_DPA_GOOGLE_CLOUD.md)

### ✅ Checklist rapide

- [ ] DPA téléchargé et archivé
- [ ] Version notée (v4.0 ou supérieur)
- [ ] CCT présentes dans le DPA (pages 15-25)
- [ ] Référence ajoutée dans le registre RGPD
- [ ] Alertes Google Cloud activées

---

## 🚀 Plan de Conformité Avancée (Niveau 3)

### 🎯 Pour qui ?

**Ce niveau est recommandé si :**
- CA > 1M€ ou équipe > 10 personnes
- Vous visez des clients grands comptes (B2B)
- Vous souhaitez une protection maximale (cyber-risques)
- Vous voulez des certifications reconnues (ISO 27001)

### 💰 Budget et ROI

**Investissement Année 1** : 36 000€  
**Coûts récurrents** : 16 800€/an

**Gains attendus** :
- Évitement amendes RGPD : ~5 000€/an
- Évitement cyberattaque : ~20 000€/an
- Augmentation conversion : ~6 250€/an
- Accès marchés B2B : ~5 000€/an

**ROI** : 101% dès année 1 (investissement rentabilisé)

### 📅 Planning 12 Mois

**Phase 1 (Mois 1-3) : Fondations**
- Assurance cyber-risque
- Pentest applicatif
- Audit RGPD
- Nomination DPO externe

**Phase 2 (Mois 4-9) : Certifications**
- ISO 27001 (gap analysis + mise en conformité)
- Label IA Responsable (préparation)
- Audit Cloud GCP

**Phase 3 (Mois 10-12) : Excellence**
- Certification ISO 27001 obtenue
- Communication externe (badges site)
- Bilan et roadmap année 2

**Guide complet** : [PLAN_CONFORMITE_AVANCEE.md](PLAN_CONFORMITE_AVANCEE.md)

---

## 🛠️ Actions Immédiates (Cette Semaine)

### ✅ Niveau 2 (Essentiel)

**Priorité Haute (Aujourd'hui) :**
1. [ ] **Lire le registre RGPD** : [REGISTRE_TRAITEMENT_RGPD.md](REGISTRE_TRAITEMENT_RGPD.md)
2. [ ] **Télécharger le DPA Google** : Suivre [GUIDE_DPA_GOOGLE_CLOUD.md](GUIDE_DPA_GOOGLE_CLOUD.md)
3. [ ] **Archiver le DPA** : Créer dossier `/docs/conformite/` et sauvegarder

**Priorité Moyenne (Cette Semaine) :**
4. [ ] **Activer alertes Google Cloud** : Console → Notifications
5. [ ] **Planifier revue annuelle** : Agenda 18/02/2027
6. [ ] **Informer l'équipe** : Partager le registre RGPD

### 🚀 Niveau 3 (Si Budget Disponible)

**Actions Stratégiques (Ce Mois) :**
1. [ ] **Valider le budget** : Présenter au conseil (36 000€ an 1)
2. [ ] **Prioriser les actions** : Commencer par assurance cyber
3. [ ] **Lancer appels d'offres** : Audits, DPO externe
4. [ ] **Planifier kickoff** : Comité Sécurité & RGPD

---

## 📞 Contacts Utiles

### Support STORAL (Interne)

| Rôle | Contact |
|------|---------|
| **Responsable RGPD** | Nabil JLAIEL - commandes@storal.fr - 01 85 09 34 46 |
| **Support technique** | commandes@storal.fr |

### Autorités & Organismes Externes

| Organisme | Contact |
|-----------|---------|
| **CNIL (France)** | www.cnil.fr - 01 53 73 22 22 |
| **Commission Européenne** | https://ec.europa.eu/info/law/law-topic/data-protection_fr |
| **Google Cloud Support** | https://cloud.google.com/support |
| **DPO Google Europe** | https://policies.google.com/privacy/update |

### Prestataires Recommandés (Niveau 3)

| Service | Provider | Contact |
|---------|----------|---------|
| **Assurance Cyber** | AXA / Hiscox | cyber@axa.fr - 01 40 75 45 00 |
| **Audit Sécurité** | Vaadata / Synacktiv | contact@vaadata.com |
| **DPO Externe** | DPO Solutions | contact@dposolutions.fr - 01 77 37 01 31 |
| **Certification ISO** | AFNOR / Bureau Veritas | 01 41 62 80 00 |

---

## 📊 Tableau de Bord Conformité (KPIs)

| Indicateur | Cible | Actuel | Statut |
|------------|-------|--------|--------|
| **Registre RGPD à jour** | Oui | ✅ Oui (18/02/2026) | ✅ |
| **DPA Google téléchargé** | Oui | ⏳ À faire | 🟡 |
| **Mentions légales IA** | Oui | ✅ Complètes | ✅ |
| **Bannière disclaimer** | Oui | ✅ Active | ✅ |
| **Formation équipe RGPD** | 100% | 0% | 🔴 |
| **Incidents sécurité** | 0 | 0 | ✅ |
| **Demandes droits RGPD** | < 30j | - | - |

---

## 🔄 Cycle de Vie et Maintenance

### Revue Annuelle Obligatoire

**Date prévue** : 18 février 2027

**Checklist revue annuelle :**
- [ ] Mettre à jour le registre RGPD
- [ ] Vérifier validité DPA Google (nouvelle version ?)
- [ ] Auditer mesures de sécurité (toujours actives ?)
- [ ] Renouveler formation équipe RGPD
- [ ] Analyser incidents de l'année (s'il y en a eu)
- [ ] Planifier budget année suivante

### Déclencheurs de Mise à Jour

**Mettre à jour les documents si :**
- 🆕 Nouveau traitement de données (ex: nouveau formulaire)
- 🔄 Changement sous-traitant (ex: remplacer Gemini par autre IA)
- 📜 Nouvelle réglementation (ex: AI Act européen)
- 🚨 Incident de sécurité majeur
- 📈 Croissance entreprise (> 250 employés → DPO obligatoire)

---

## 📚 Ressources Externes

### Documentation RGPD Officielle

- **CNIL - Guide RGPD** : https://www.cnil.fr/fr/rgpd-passer-a-laction
- **CNIL - Registre de traitement** : https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement
- **Commission UE - RGPD** : https://ec.europa.eu/info/law/law-topic/data-protection_fr

### Documentation Google Cloud

- **DPA Google Cloud** : https://cloud.google.com/terms/data-processing-addendum
- **Gemini API Terms** : https://ai.google.dev/gemini-api/terms
- **Google Cloud Security** : https://cloud.google.com/security

### Guides Pratiques

- **ANSSI - Sécurité numérique** : https://www.ssi.gouv.fr
- **BPI France - RGPD PME** : https://www.bpifrance.fr/nos-actualites/rgpd-mode-demploi
- **Confiance.ai - IA Responsable** : https://www.confiance.ai

---

## ✅ Résumé : Votre Conformité en un Coup d'Œil

### ✅ Ce qui est fait (Niveau 1 + 2)

✅ Mentions légales complètes avec section IA détaillée  
✅ Politique de confidentialité RGPD complète  
✅ CGV avec article dédié à l'IA  
✅ Bannière disclaimer dans l'interface chat  
✅ Registre de traitement RGPD complet (3 traitements)  
✅ Documentation des mesures de sécurité (6 protections)  
✅ Procédures d'exercice des droits RGPD  
✅ Guide de téléchargement DPA Google  

### ⏳ Actions à compléter (Court terme)

⏳ Télécharger et archiver le DPA Google Cloud  
⏳ Activer alertes Google Cloud Console  
⏳ Former l'équipe aux bases du RGPD (3h e-learning)  
⏳ Planifier 1ère réunion équipe sur conformité  

### 🚀 Roadmap Excellence (Si budget)

🚀 Souscrire assurance cyber-risque (2 000€/an)  
🚀 Réaliser pentest applicatif (6 500€)  
🚀 Nommer DPO externe (4 800€/an)  
🚀 Viser certification ISO 27001 (15-30k€)  

---

## 🎯 Conclusion

**STORAL dispose désormais d'une conformité RGPD solide (Niveau 2) pour son assistant IA Google Gemini.**

Les documents créés vous permettent de :
- ✅ Répondre à un contrôle CNIL
- ✅ Justifier la conformité auprès de clients B2B
- ✅ Gérer les demandes d'exercice de droits
- ✅ Évoluer vers l'excellence (Niveau 3) si souhaité

**Prochaine action prioritaire** : Télécharger le DPA Google Cloud (5 minutes)

---

**Dernière mise à jour** : 18 février 2026  
**Prochaine revue** : 18 février 2027  
**Version** : 1.0  
**Auteur** : Équipe Technique STORAL
