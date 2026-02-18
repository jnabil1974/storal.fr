# ADDENDUM AU REGISTRE RGPD - COOKIES ET TRACEURS

## Date de mise à jour : 18 février 2026

Ce document complète le [REGISTRE_TRAITEMENT_RGPD.md](./REGISTRE_TRAITEMENT_RGPD.md) avec les détails des cookies déposés sur le site Storal.fr.

---

## 📊 INVENTAIRE DES COOKIES

### 1️⃣ Cookies NÉCESSAIRES (exemptés de consentement)

| Nom du cookie | Émetteur | Finalité | Durée | Base légale |
|--------------|----------|----------|-------|-------------|
| `storal_cookie_consent` | Storal.fr | Mémorisation du choix de consentement | 13 mois | Art. 6.1.f RGPD (intérêt légitime) |
| `storal_session` | Storal.fr | Maintien de la session utilisateur | Session | Art. 6.1.b RGPD (exécution du contrat) |
| `storal_cart` | Storal.fr | Panier d'achat | 7 jours | Art. 6.1.b RGPD (exécution du contrat) |

**Justification de l'exemption (article 5(3) directive ePrivacy)** :  
Ces cookies sont strictement nécessaires à la fourniture du service expressément demandé par l'utilisateur (configuration de stores, panier, sécurité).

---

### 2️⃣ Cookies ANALYTIQUES (consentement requis)

| Nom du cookie | Émetteur | Finalité | Durée | Base légale |
|--------------|----------|----------|-------|-------------|
| `_ga` | Google LLC (USA) | Identification unique | 2 ans | Art. 6.1.a RGPD (consentement) |
| `_gid` | Google LLC (USA) | Identification session | 24h | Art. 6.1.a RGPD (consentement) |
| `_gat_gtag_GA_*` | Google LLC (USA) | Limitation du taux de requêtes | 1 minute | Art. 6.1.a RGPD (consentement) |

**Finalité détaillée** :  
Mesure d'audience du site web (pages vues, durée de visite, parcours utilisateur, taux de rebond) pour améliorer l'expérience utilisateur.

**Transfert hors UE** :  
Oui, vers Google LLC (USA). Encadrement juridique : Clauses Contractuelles Types (CCT) approuvées par la Commission Européenne (Décision 2021/914).

**Anonymisation** :  
Les adresses IP sont anonymisées (`anonymize_ip: true` dans la configuration).

---

### 3️⃣ Cookies MARKETING (consentement requis)

| Nom du cookie | Émetteur | Finalité | Durée | Base légale |
|--------------|----------|----------|-------|-------------|
| `_gcl_au` | Google LLC (USA) | Attribution publicitaire | 3 mois | Art. 6.1.a RGPD (consentement) |
| `test_cookie` | Google LLC (USA) | Vérification activation cookies | 15 minutes | Art. 6.1.a RGPD (consentement) |
| `IDE` | Google DoubleClick (USA) | Publicité ciblée | 13 mois | Art. 6.1.a RGPD (consentement) |

**Finalité détaillée** :  
- Affichage de publicités pertinentes sur d'autres sites (remarketing)
- Mesure de l'efficacité des campagnes publicitaires (conversions, ROI)
- Limitation de la fréquence d'affichage des annonces (capping)

**Transfert hors UE** :  
Oui, vers Google LLC (USA). Encadrement juridique : Clauses Contractuelles Types (CCT).

---

## 🛡️ CONFORMITÉ CNIL

### Respect des recommandations (Délibération n° 2020-092)

| Obligation | Statut | Détails |
|-----------|--------|---------|
| **Information préalable** | ✅ | Banner affiché avant tout dépôt de cookie tiers |
| **Consentement libre** | ✅ | Refus aussi simple qu'acceptation (2 boutons égaux) |
| **Consentement éclairé** | ✅ | Finalités, durées et transferts indiqués clairement |
| **Consentement univoque** | ✅ | Action positive requise (clic sur un bouton) |
| **Gratuité** | ✅ | Cookie wall interdit - accès libre au site |
| **Durée max 13 mois** | ✅ | Consentement expire après 13 mois (`CONSENT_DURATION_DAYS = 365`) |
| **Réversibilité** | ✅ | Lien "Gérer mes cookies" dans le footer |
| **Preuve du consentement** | ✅ | Timestamp + version stockés dans localStorage |

---

## 🔄 GESTION DU CONSENTEMENT

### Mécanisme technique

1. **Premier chargement** : Banner affiché avec 3 boutons (Refuser / Personnaliser / Accepter)
2. **Stockage du choix** : `localStorage.setItem('storal_cookie_consent', {...})`
3. **Chargement conditionnel** : Composant `GoogleScripts.tsx` vérifie le consentement avant de charger les scripts
4. **Expiration** : Vérification automatique à chaque visite (13 mois)
5. **Modification** : L'utilisateur peut cliquer sur "Gérer mes cookies" dans le footer

### Données enregistrées

```json
{
  "timestamp": 1739851200000,
  "version": "1.0",
  "hasResponded": true,
  "preferences": {
    "necessary": true,
    "analytics": false,
    "marketing": false,
    "preferences": false
  }
}
```

---

## 📋 DROITS DES UTILISATEURS

Les utilisateurs peuvent exercer les droits suivants :

| Droit | Comment l'exercer |
|-------|-------------------|
| **Retirer son consentement** | Cliquer sur "Gérer mes cookies" dans le footer |
| **S'opposer aux cookies** | Cliquer sur "Tout refuser" dans le banner |
| **Accéder aux données** | Email à commandes@storal.fr |
| **Supprimer les données** | Vider le cache du navigateur (F12 → Application → Clear storage) |
| **Se plaindre** | Contacter la CNIL via https://www.cnil.fr/plaintes |

---

## 📊 SOUS-TRAITANTS (Article 28 RGPD)

### Google LLC (Analytics + Ads)

- **Raison sociale** : Google LLC
- **Adresse** : 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
- **Rôle** : Sous-traitant (processeur de données)
- **DPA signé** : ✅ Oui, téléchargé le [DATE] (voir [GUIDE_DPA_GOOGLE_CLOUD.md](./GUIDE_DPA_GOOGLE_CLOUD.md))
- **Garanties de sécurité** : 
  - Chiffrement des données en transit (TLS 1.3)
  - Chiffrement des données au repos (AES-256)
  - Certifications ISO 27001, SOC 2 Type II
  - Anonymisation des IPs activée
- **Transfert hors UE** : Oui, encadré par CCT (Décision 2021/914)

---

## 🔍 AUDIT ET CONTRÔLE

### Vérifications à effectuer

**Tous les 6 mois** :
- [ ] Vérifier qu'aucun nouveau cookie n'a été ajouté (audit avec https://www.cookiebot.com/)
- [ ] Tester le refus de consentement (aucun cookie tiers ne doit être déposé)
- [ ] Vérifier que le lien "Gérer mes cookies" fonctionne
- [ ] Contrôler que les mentions légales sont à jour

**Tous les 13 mois** :
- [ ] Vérifier que le consentement expire bien (tester avec `simulateExpiry()`)
- [ ] Renouveler le DPA Google si nécessaire

**En cas de modification** :
- [ ] Incrémenter `CONSENT_VERSION` dans `/src/types/consent.ts`
- [ ] Mettre à jour la politique de confidentialité
- [ ] Forcer un nouveau consentement des utilisateurs

---

## 📞 CONTACT RGPD

- **Responsable conformité** : Direction STORAL SASU
- **Email** : commandes@storal.fr
- **Téléphone** : 01 85 09 34 46
- **Adresse** : 58 rue de Monceau CS 48756, 75380 Paris Cedex 08

---

## 📚 RÉFÉRENCES

- [Directive ePrivacy (2002/58/CE)](https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX%3A32002L0058)
- [RGPD - Article 6 (licéité)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2#Article6)
- [RGPD - Article 28 (sous-traitants)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4#Article28)
- [Recommandations CNIL cookies (2020)](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies)
- [Lignes directrices CEPD cookies (2021)](https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_fr)

---

**Version** : 1.0  
**Dernière mise à jour** : 18 février 2026  
**Prochaine révision** : 18 mai 2026 (3 mois)
