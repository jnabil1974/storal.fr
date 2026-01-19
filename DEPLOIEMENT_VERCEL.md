# Guide de déploiement Vercel pour storal.fr

## 1. Créer un compte Vercel
- Va sur https://vercel.com/signup
- Connecte-toi avec GitHub (recommandé) ou email

## 2. Déployer le projet

### Option A : Via GitHub (recommandé)
1. **Push le projet sur GitHub**
   ```bash
   cd /Applications/MAMP/htdocs/store_menuiserie
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TON_USERNAME/storal-fr.git
   git push -u origin main
   ```

2. **Importer sur Vercel**
   - Va sur https://vercel.com/new
   - Sélectionne le repo `storal-fr`
   - Vercel détecte automatiquement Next.js

### Option B : Via CLI (plus rapide)
```bash
npm i -g vercel
cd /Applications/MAMP/htdocs/store_menuiserie
vercel
```

## 3. Configurer les variables d'environnement
Sur Vercel Dashboard → Settings → Environment Variables, ajoute :

```
NEXT_PUBLIC_SUPABASE_URL=https://qctnvyxtbvnvllchuibu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ePWi9LBeKlfAR8T_-bk0YA_3me9UEc3
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9Ym5jsPSc1VCcbYYTal79w_nRaNwR8K

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51PNA90JWI1QIAgwoSG6QVWuMf6QBz0kL3rwPdCLhkkbYJnqjWz82TS4mFHqtwrm8Z2mW2THqWmdulAUa2voCUMs400GFbgbNEl
STRIPE_SECRET_KEY=sk_test_51PNA90JWI1QIAgwomZXbOuKRHPlxHCFIjq4JEtvSq6ttI68c33Tf9sY7GlLeiCRXVlGYJFJokJzgcI70XJM2Yba700dyxzryWJ
STRIPE_WEBHOOK_SECRET=whsec_production_XXX

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

RESEND_API_KEY=re_ViuFZpQ2_L6VK9QoXFPHmzbxs8wp1APMh
EMAIL_FROM=noreply@flineaccessplus.fr
EMAIL_BCC=support@flineaccessplus.fr

NEXT_PUBLIC_ADMIN_EMAILS=support@flineaccessplus.fr
NEXT_PUBLIC_APP_URL=https://storal.fr
```

⚠️ **Important** : Change `NEXT_PUBLIC_APP_URL=https://storal.fr`

## 4. Configurer le domaine storal.fr
1. **Sur Vercel** :
   - Va dans Settings → Domains
   - Ajoute `storal.fr` et `www.storal.fr`

2. **Chez ton registrar (OVH)** :
   - DNS → Ajouter un enregistrement `A` :
     - Host : `@`
     - Pointe vers : `76.76.21.21` (IP Vercel)
   - Ajouter `CNAME` pour www :
     - Host : `www`
     - Pointe vers : `cname.vercel-dns.com`

3. **Attendre la propagation DNS** (5-30 min)

## 5. Configurer le webhook Stripe production
1. Va sur https://dashboard.stripe.com/webhooks
2. Ajoute l'endpoint : `https://storal.fr/api/webhooks/stripe`
3. Sélectionne : `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copie la clé secrète (whsec_...)
5. Ajoute-la dans Vercel env vars : `STRIPE_WEBHOOK_SECRET=whsec_...`

## 6. Redéployer
Après avoir ajouté les variables :
- Vercel → Deployments → Redeploy

✅ Ton site sera en ligne sur https://storal.fr !

## Notes importantes
- **Gratuit** pour usage personnel/startup
- **Builds automatiques** à chaque push GitHub
- **SSL/HTTPS** automatique
- **CDN mondial** avec edge caching
