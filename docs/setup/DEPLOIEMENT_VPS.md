# Guide de déploiement VPS OVH Ubuntu 22.04

## 1. Commander et configurer le VPS

1. **Commander un VPS OVH** : https://www.ovhcloud.com/fr/vps/
   - VPS Starter (2 vCores, 2GB RAM) : ~5€/mois
   - OS : **Ubuntu 22.04 LTS**

2. **Recevoir les identifiants SSH** par email

## 2. Connexion SSH au VPS

```bash
ssh root@IP_DU_VPS
# Entrer le mot de passe reçu par email
```

## 3. Installation automatique

Sur le VPS, exécute :

```bash
# Télécharger et exécuter le script d'installation
curl -o install-vps.sh https://raw.githubusercontent.com/jnabil1974/storal.fr/main/install-vps.sh
chmod +x install-vps.sh
bash install-vps.sh
```

Le script va installer :
- ✅ Node.js 20.x
- ✅ PM2 (gestionnaire de processus)
- ✅ Nginx (reverse proxy)
- ✅ Certbot (SSL gratuit)
- ✅ Clone du repo GitHub
- ✅ Build de l'application
- ✅ Démarrage automatique

## 4. Configurer les variables d'environnement

```bash
nano /var/www/storal.fr/.env.production
```

⚠️ **Remplace les valeurs de production** :
- `STRIPE_WEBHOOK_SECRET` : whsec_production... (depuis Stripe Dashboard)
- Vérifie que `NEXT_PUBLIC_APP_URL=https://storal.fr`

Puis redémarre :
```bash
cd /var/www/storal.fr
pm2 restart storal-fr
```

## 5. Configurer les DNS

Chez ton registrar de domaine (OVH, Gandi, etc.) :

**Type A** :
- Host : `@`
- Valeur : `IP_DU_VPS`
- TTL : 3600

**Type A** (optionnel pour www) :
- Host : `www`
- Valeur : `IP_DU_VPS`
- TTL : 3600

Attendre la propagation DNS (5-30 min).

## 6. Installer le certificat SSL (HTTPS)

Une fois les DNS configurés :

```bash
sudo certbot --nginx -d storal.fr -d www.storal.fr
```

Certbot va :
- ✅ Obtenir un certificat SSL gratuit Let's Encrypt
- ✅ Configurer automatiquement Nginx pour HTTPS
- ✅ Renouvellement automatique tous les 90 jours

## 7. Configurer le webhook Stripe

Sur https://dashboard.stripe.com/webhooks :

1. **Ajouter un endpoint** : `https://storal.fr/api/webhooks/stripe`
2. **Sélectionner les événements** :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
3. **Copier la clé secrète** (whsec_...)
4. **Mettre à jour** `.env.production` sur le VPS
5. **Redémarrer** : `pm2 restart storal-fr`

## 8. Vérifier que tout fonctionne

```bash
# Voir le statut de l'app
pm2 status

# Voir les logs en temps réel
pm2 logs storal-fr

# Tester l'app
curl http://localhost:3000
```

Ouvre ton navigateur : **https://storal.fr**

## Commandes utiles

```bash
# Redémarrer l'app
pm2 restart storal-fr

# Arrêter l'app
pm2 stop storal-fr

# Voir les logs
pm2 logs storal-fr

# Mettre à jour l'app depuis GitHub
cd /var/www/storal.fr
git pull
npm install
npm run build
pm2 restart storal-fr

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier la config Nginx
sudo nginx -t

# Renouveler SSL manuellement
sudo certbot renew
```

## Maintenance

### Mise à jour du code

```bash
cd /var/www/storal.fr
git pull origin main
npm install
npm run build
pm2 restart storal-fr
```

### Sauvegardes

Les données sont dans Supabase (déjà en cloud), mais sauvegarde `.env.production`.

### Monitoring

```bash
# Installer pm2-logrotate pour gérer les logs
pm2 install pm2-logrotate

# Voir l'utilisation des ressources
pm2 monit
```

## Problèmes courants

### L'app ne démarre pas
```bash
pm2 logs storal-fr --lines 50
```

### Nginx erreur 502
```bash
sudo systemctl status nginx
pm2 status
```

### SSL ne fonctionne pas
- Vérifie que les DNS pointent vers le VPS : `dig storal.fr`
- Relance certbot : `sudo certbot --nginx -d storal.fr`

## Sécurité

### Firewall
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Changer le mot de passe root
```bash
passwd
```

### Créer un utilisateur non-root (recommandé)
```bash
adduser deployer
usermod -aG sudo deployer
su - deployer
```

---

✅ **Ton site est maintenant en production sur https://storal.fr !**
