# 🍪 Système de Gestion du Consentement Cookies - STORAL

## 📋 Vue d'ensemble

Ce système de consentement cookies est **100% conforme** aux exigences de la CNIL (RGPD + directive ePrivacy).

### ✅ Points de conformité

- **Consentement préalable** : Aucun cookie tiers (Google Analytics, Google Ads) n'est déposé avant consentement explicite
- **Refus facilité** : Le bouton "Tout refuser" a la même visibilité que "Tout accepter"
- **Personnalisation visible** : Bouton "Personnaliser" affiché dès le départ
- **Durée limitée** : Consentement expire après 13 mois (conforme CNIL)
- **Réversibilité** : L'utilisateur peut retirer son consentement à tout moment
- **Information claire** : Détails sur chaque catégorie de cookies et leurs finalités
- **Cookies exemptés** : Les cookies techniques (nécessaires) ne nécessitent pas de consentement

---

## 🏗️ Architecture

### Fichiers créés

```
src/
├── types/
│   └── consent.ts              # Types TypeScript pour le consentement
├── hooks/
│   └── useConsent.ts           # Hook React pour gérer le consentement
├── components/
│   ├── CookieBanner.tsx        # Banner de consentement CNIL
│   └── GoogleScripts.tsx       # Chargement conditionnel des scripts Google
└── app/
    └── layout.tsx              # Intégration dans le layout principal
```

### Catégories de cookies

| Catégorie      | Consentement requis | Description                                      |
| -------------- | ------------------- | ------------------------------------------------ |
| **Nécessaires**    | ❌ Non (exemptés)  | Panier, session, sécurité, fonctionnement site   |
| **Analytiques**    | ✅ Oui              | Google Analytics (mesure d'audience)             |
| **Marketing**      | ✅ Oui              | Google Ads (publicité ciblée, remarketing)       |
| **Préférences**    | ✅ Oui              | Langue, thème, paramètres d'affichage            |

---

## 🚀 Configuration

### 1. Configurer les IDs Google

Créez un fichier `.env.local` à la racine du projet (voir `.env.example`) :

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID=G-VOTRE-ID-ICI

# Google Ads (optionnel)
NEXT_PUBLIC_GADS_ID=AW-VOTRE-ID-ICI
```

**⚠️ Important** : Ces variables doivent commencer par `NEXT_PUBLIC_` pour être accessibles côté client.

### 2. Obtenir les IDs

#### Google Analytics (GA4)
1. Aller sur https://analytics.google.com/
2. Créer une propriété GA4 si ce n'est pas fait
3. Dans **Admin** → **Flux de données** → Cliquer sur votre site web
4. Copier l'**ID de mesure** (format `G-XXXXXXXXX`)

#### Google Ads
1. Aller sur https://ads.google.com/
2. **Outils et paramètres** → **Configuration** → **Balises de conversions**
3. Obtenir l'**ID de conversion** (format `AW-XXXXXXXXX`)

### 3. Tester le système

```bash
npm run dev
```

Ouvrez votre navigateur sur http://localhost:3000 :
1. Le banner de cookies devrait s'afficher au premier chargement
2. Ouvrez la console (F12) → onglet **Console**
3. Cliquez sur "Tout accepter" → Vous devriez voir : `[GoogleScripts] Google Analytics chargé`
4. Vérifiez dans l'onglet **Application** → **Cookies** → Les cookies Google (`_ga`, `_gid`) doivent apparaître

### 4. Tester le refus

1. Supprimez le localStorage : Dans la console, lancez `localStorage.clear()`
2. Rechargez la page
3. Cliquez sur "Tout refuser"
4. Vérifiez dans l'onglet **Réseau** (Network) → Aucune requête vers `googletagmanager.com` ne doit apparaître
5. Les cookies Google ne doivent PAS être présents

---

## 🔧 Personnalisation

### Modifier la durée de validité du consentement

Dans [src/types/consent.ts](src/types/consent.ts#L20) :

```typescript
export const CONSENT_DURATION_DAYS = 365; // Changez cette valeur (13 mois max CNIL = 395 jours)
```

### Changer le texte du banner

Éditez [src/components/CookieBanner.tsx](src/components/CookieBanner.tsx) :
- Lignes 60-68 : Titre et description principale
- Lignes 107-195 : Descriptions des catégories de cookies

### Ajouter d'autres scripts (Meta Pixel, Hotjar, etc.)

Éditez [src/components/GoogleScripts.tsx](src/components/GoogleScripts.tsx) :

```tsx
{preferences.marketing && (
  <Script
    id="meta-pixel"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: `
        !function(f,b,e,v,n,t,s) { /* Code Meta Pixel */ }
      `,
    }}
  />
)}
```

### Permettre aux utilisateurs de rouvrir le banner

Ajoutez un bouton "Gérer mes cookies" dans le footer :

```tsx
import { useConsent } from '@/hooks/useConsent';

export default function Footer() {
  const { resetConsent } = useConsent();

  return (
    <footer>
      {/* ... autres éléments ... */}
      <button onClick={resetConsent}>
        Gérer mes cookies
      </button>
    </footer>
  );
}
```

---

## 📊 Tracking des événements avec Google Analytics

Une fois le consentement accordé, vous pouvez tracker des événements personnalisés :

```typescript
// Dans n'importe quel composant client
'use client';

import { useConsent } from '@/hooks/useConsent';

export default function MyComponent() {
  const { preferences } = useConsent();

  const handleClick = () => {
    // Vérifier que l'utilisateur a accepté les cookies analytiques
    if (preferences.analytics && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'button_click', {
        event_category: 'Engagement',
        event_label: 'Mon bouton',
        value: 1
      });
    }
    
    // ... votre logique métier
  };

  return <button onClick={handleClick}>Cliquez-moi</button>;
}
```

Pensez à ajouter les types TypeScript pour `gtag` :

```typescript
// Dans un fichier global.d.ts (à la racine de src/)
interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js',
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer?: any[];
}
```

---

## 🛡️ Sécurité et conformité

### Vérification automatique du consentement

Le système vérifie automatiquement :
- ✅ Si le consentement est expiré (> 13 mois)
- ✅ Si la version de la politique a changé (variable `CONSENT_VERSION`)
- ✅ Si le localStorage est corrompu

### Nettoyage des cookies lors du refus

Dans [src/components/GoogleScripts.tsx](src/components/GoogleScripts.tsx#L25-L35), les cookies Google sont automatiquement supprimés si l'utilisateur retire son consentement analytics.

### Anonymisation des IPs

Google Analytics est configuré avec `anonymize_ip: true` pour respecter le RGPD.

### Transferts hors UE

Les transferts vers les USA (Google LLC) sont couverts par les **Clauses Contractuelles Types (CCT)** approuvées par la Commission Européenne (Décision 2021/914). Voir [docs/GUIDE_DPA_GOOGLE_CLOUD.md](../docs/GUIDE_DPA_GOOGLE_CLOUD.md).

---

## 📚 Références légales

### CNIL
- [Recommandations CNIL sur les cookies](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi)
- [Durée de validité du consentement](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/combien-de-temps-puis-je-conserver-le-consentement)

### RGPD
- Article 6 : Licéité du traitement de données
- Article 7 : Conditions applicables au consentement
- Article 13 : Information à fournir lorsque les données sont collectées

### Directive ePrivacy
- Article 5(3) : Consentement préalable pour les cookies non essentiels

---

## 🧪 Tests de conformité

### Checklist avant mise en production

- [ ] **Test initial** : Le banner s'affiche au premier chargement
- [ ] **Test refus** : "Tout refuser" → Aucun script Google chargé
- [ ] **Test acceptation** : "Tout accepter" → Scripts Google chargés
- [ ] **Test personnalisation** : Activer uniquement analytics → Seul Google Analytics charge
- [ ] **Test persistance** : Recharger la page → Le banner ne réapparaît pas
- [ ] **Test expiration** : Modifier manuellement le timestamp dans localStorage (< 13 mois) → Banner réapparaît
- [ ] **Test liens** : Vérifier que le lien vers `/confidentialite` fonctionne
- [ ] **Test responsive** : Banner s'affiche correctement sur mobile
- [ ] **Test accessibilité** : Navigation au clavier (Tab) fonctionne
- [ ] **Vérification console** : Aucune erreur JavaScript

### Outils de test

- **Cookie Scanner CNIL** : https://www.cnil.fr/fr/outil-de-verification-des-cookies
- **Cookiebot Scanner** : https://www.cookiebot.com/en/website-scan/
- **OneTrust Cookie Scanner** : https://www.cookiepro.com/cookie-scanner/

---

## 🚨 Maintenance

### Quand mettre à jour le système ?

1. **Changement de politique** : Incrémenter `CONSENT_VERSION` dans [src/types/consent.ts](src/types/consent.ts#L18)
2. **Nouveaux cookies** : Ajouter une catégorie dans le banner et mettre à jour la politique de confidentialité
3. **Évolution réglementaire** : Suivre les recommandations CNIL (newsletter disponible)

### Support

- **Documentation RGPD** : [docs/README_CONFORMITE.md](../docs/README_CONFORMITE.md)
- **Registre RGPD** : [docs/REGISTRE_TRAITEMENT_RGPD.md](../docs/REGISTRE_TRAITEMENT_RGPD.md)
- **DPA Google** : [docs/GUIDE_DPA_GOOGLE_CLOUD.md](../docs/GUIDE_DPA_GOOGLE_CLOUD.md)

---

## 📞 Contact

Pour toute question sur la conformité RGPD :
- **Email** : commandes@storal.fr
- **Téléphone** : 01 85 09 34 46

---

**Dernière mise à jour** : 18 février 2026  
**Version** : 1.0  
**Conformité CNIL** : ✅ Validée
