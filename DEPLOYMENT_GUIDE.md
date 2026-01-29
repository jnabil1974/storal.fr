# Guide de Déploiement - Éviter les Problèmes Récurrents

## 🎯 Problèmes Identifiés

Les difficultés récurrentes sont causées par :

1. **Cache mélangé** : Ancien et nouveau build coexistent
2. **PM2 mal redémarré** : Anciennes instances persistent
3. **Permissions incorrectes** : Fichiers verrouillés par root
4. **Cache Nginx** : Sert d'anciennes versions
5. **Build incohérent** : Fichiers de plusieurs versions

## ✅ Solutions Mises en Place

### 1. Script de Déploiement Automatisé

Utilisez le script `./deploy.sh --production` qui :
- ✅ Arrête proprement tous les processus
- ✅ Nettoie tous les caches
- ✅ Force un build propre
- ✅ Redémarre PM2 correctement
- ✅ Purge le cache Nginx

```bash
# Déploiement production
./deploy.sh --production

# Build local seulement
./deploy.sh
```

### 2. GitHub Actions (Recommandé)

Le workflow `.github/workflows/deploy.yml` déploie automatiquement à chaque push sur `main`.

**Configuration requise** :
1. Aller dans Settings > Secrets and variables > Actions
2. Ajouter `SSH_PRIVATE_KEY` avec votre clé SSH privée

### 3. Configuration Nginx Améliorée

Ajouter dans `/etc/nginx/sites-available/storal.fr` :

```nginx
location /_next/static/ {
    alias /var/www/storal.fr/.next/static/;
    expires 1y;
    access_log off;
    add_header Cache-Control "public, immutable";
}

# Désactiver le cache pour les pages HTML
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    
    # Pas de cache pour HTML
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### 4. Configuration PM2 Améliorée

Modifier `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [{
    name: 'storal-fr',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 4,
    exec_mode: 'cluster',
    env_file: '.env.production',
    
    // Améliorations anti-crash
    max_restarts: 10,
    min_uptime: '10s',
    max_memory_restart: '500M',
    
    // Logs
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // Auto-restart en cas de crash
    autorestart: true,
    watch: false
  }]
}
```

### 5. Script de Vérification Post-Déploiement

Créer `scripts/verify-deployment.sh` :

```bash
#!/bin/bash

echo "🔍 Vérification du déploiement..."

# Vérifier PM2
if pm2 list | grep -q "online"; then
    echo "✅ PM2 : OK"
else
    echo "❌ PM2 : ERREUR"
    exit 1
fi

# Vérifier les fichiers CSS
if [ -f ".next/static/css"/*.css ]; then
    echo "✅ CSS : OK"
else
    echo "❌ CSS : MANQUANT"
    exit 1
fi

# Tester l'API
if curl -s https://storal.fr/ | grep -q "<!DOCTYPE html>"; then
    echo "✅ Site : OK"
else
    echo "❌ Site : ERREUR"
    exit 1
fi

echo "✅ Déploiement vérifié avec succès!"
```

## 🔧 Procédure de Déploiement Standard

### Méthode 1 : Script Automatique (Recommandé)

```bash
# 1. Commit et push des modifications
git add .
git commit -m "feat: mes modifications"
git push origin main

# 2. Déployer sur le serveur
./deploy.sh --production
```

### Méthode 2 : Manuel (Si script indisponible)

```bash
ssh ubuntu@51.210.244.26

cd /var/www/storal.fr

# Arrêt complet
pm2 stop all
pkill -9 -f next
lsof -ti:3000 | xargs kill -9 || true

# Nettoyage
rm -rf .next node_modules/.cache /tmp/next-*
sudo rm -rf /var/cache/nginx/*

# Mise à jour
git fetch origin
git reset --hard origin/main

# Build
npm install --no-audit
npm run build

# Redémarrage
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
sudo systemctl reload nginx

# Vérification
pm2 status
curl -I https://storal.fr/
```

## 🚨 En Cas de Problème

### Problème : CSS ou JS 404

```bash
# Sur le serveur
cd /var/www/storal.fr
ls -la .next/static/css/
ls -la .next/static/chunks/

# Si vide ou ancien :
rm -rf .next
npm run build
pm2 restart all
```

### Problème : PM2 "errored"

```bash
# Voir les logs
pm2 logs storal-fr --lines 50

# Restart complet
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

### Problème : Port 3000 occupé

```bash
lsof -ti:3000 | xargs kill -9
pm2 restart all
```

### Problème : Permissions

```bash
sudo chown -R ubuntu:ubuntu /var/www/storal.fr
```

## 📊 Monitoring

### Vérifier le statut en temps réel

```bash
# PM2
pm2 monit

# Logs en direct
pm2 logs storal-fr

# Statut Nginx
sudo systemctl status nginx
```

### Tester depuis le local

```python
import requests
r = requests.get('https://storal.fr/')
print(f"Status: {r.status_code}")
print(f"Content-Length: {len(r.text)}")
```

## 🎓 Bonnes Pratiques

1. **Toujours utiliser le script** `deploy.sh --production`
2. **Ne jamais éditer** directement sur le serveur
3. **Tester localement** avant de déployer
4. **Vérifier PM2** après chaque déploiement
5. **Purger le cache Nginx** si problème
6. **Hard refresh** le navigateur (Cmd+Shift+R)

## 🔄 Automatisation Future

Pour éviter complètement ces problèmes :

1. ✅ Activer GitHub Actions (déploiement automatique)
2. ✅ Ajouter des health checks automatiques
3. ✅ Mettre en place un système de rollback
4. ✅ Utiliser Docker pour l'isolation
5. ✅ Implémenter un CDN pour les assets statiques

## 📞 Support

En cas de blocage persistant :
- Consulter les logs PM2 : `pm2 logs`
- Vérifier Nginx : `sudo tail -f /var/log/nginx/error.log`
- Tester l'API : `curl -v https://storal.fr/`
