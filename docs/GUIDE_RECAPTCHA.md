# 🔐 Configuration reCAPTCHA - Guide 

## ✅ Problème résolu

Le code a été modifié pour **fonctionner sans reCAPTCHA** si les clés ne sont pas configurées. L'authentification fonctionne maintenant en production même sans reCAPTCHA.

## 🎯 Statut actuel

- ✅ La page `/auth` fonctionne **sans erreur**
- ⚠️ Le reCAPTCHA n'est **pas actif** (protection contre les bots désactivée)
- ℹ️ Un warning apparaît en console si reCAPTCHA non configuré

## 🚀 Comment activer reCAPTCHA (optionnel mais recommandé)

### Étape 1 : Obtenir les clés Google reCAPTCHA

1. Aller sur https://www.google.com/recaptcha/admin
2. Cliquer sur **"+"** pour créer un nouveau site
3. Remplir le formulaire :
   - **Libellé** : `Storal.fr`
   - **Type** : Sélectionner **reCAPTCHA v3**
   - **Domaines** : 
     - `storal.fr`
     - `www.storal.fr`
     - `localhost` (pour les tests locaux)
4. Accepter les conditions
5. Cliquer sur **"Envoyer"**

Vous obtiendrez 2 clés :
- **Clé du site** (publique) : commence par `6Le...`
- **Clé secrète** (privée) : commence par `6Le...`

### Étape 2 : Configurer sur le serveur de production

Se connecter au serveur :
```bash
ssh ubuntu@51.210.244.26
```

Éditer le fichier d'environnement :
```bash
cd /var/www/storal.fr
nano .env.production
```

Ajouter ces 2 lignes (remplacer par vos vraies clés) :
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Sauvegarder (Ctrl+O, Entrée, Ctrl+X)

### Étape 3 : Redéployer l'application

```bash
npm run build
pm2 restart ecosystem.config.js
```

### Étape 4 : Vérifier

1. Ouvrir https://storal.fr/auth
2. Ouvrir la console du navigateur (F12)
3. Vous ne devriez **plus voir** le warning "reCAPTCHA non configuré"
4. Un petit badge reCAPTCHA apparaît en bas à droite de la page

## 🧪 Test en développement local

Créer un fichier `.env.local` à la racine du projet :
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=votre_cle_site
RECAPTCHA_SECRET_KEY=votre_cle_secrete
```

Redémarrer le serveur :
```bash
npm run dev
```

## 📝 Notes importantes

### Sans reCAPTCHA (situation actuelle)
- ✅ L'authentification fonctionne normalement
- ⚠️ Pas de protection contre les bots
- ⚠️ Risque de créations de comptes automatisées
- ℹ️ Acceptable pour un site avec peu de trafic

### Avec reCAPTCHA (recommandé)
- ✅ Protection contre les bots et le spam
- ✅ Détection automatique des comportements suspects
- ✅ Score de confiance pour chaque utilisateur
- ✅ Gratuit jusqu'à 1 million de requêtes/mois

## 🔍 Comment vérifier si reCAPTCHA est actif

### Méthode 1 : Console du navigateur
1. Ouvrir https://storal.fr/auth
2. Appuyer sur F12 (Console)
3. Si vous voyez `⚠️ reCAPTCHA non configuré` → pas actif
4. Si aucun warning → actif ✅

### Méthode 2 : Badge reCAPTCHA
- Badge visible en bas à droite de la page → actif ✅
- Pas de badge → pas actif

### Méthode 3 : Inspection du code source
```bash
# Sur le serveur
ssh ubuntu@51.210.244.26
cd /var/www/storal.fr
cat .env.production | grep RECAPTCHA
```

Si les 2 variables sont définies → actif ✅

## 🆘 Support

Si vous avez besoin d'aide pour configurer reCAPTCHA, contactez-moi avec :
- Les clés que vous avez obtenues de Google
- Le message d'erreur exact (si erreur)
- Une capture d'écran de la console

## 📚 Ressources

- [Documentation Google reCAPTCHA](https://developers.google.com/recaptcha/docs/v3)
- [Admin Console reCAPTCHA](https://www.google.com/recaptcha/admin)
- [FAQ reCAPTCHA](https://developers.google.com/recaptcha/docs/faq)
