# Déploiement sur Ubuntu (storal.fr)

Ce guide explique comment déployer l'application Next.js sur un serveur Ubuntu (ex: storal.fr) avec Nginx, PM2 et Certbot.

## Prérequis
- Ubuntu 20.04+ avec accès sudo
- Domaine pointant vers le serveur (storal.fr)
- Git installé et accès au repo

## 1) Installer dépendances système
```bash
sudo apt update
sudo apt install -y git nginx
```

## 2) Installer Node.js 20 LTS et PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm i -g pm2
node -v && npm -v && pm2 -v
```

## 3) Cloner le projet
```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone <VOTRE_REPO_GIT> store_menuiserie
sudo chown -R $USER:$USER store_menuiserie
cd store_menuiserie
```

## 4) Configurer les variables d'environnement
```bash
cp .env.example .env
nano .env
```
Renseignez:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (secret serveur)
- `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` si Stripe est utilisé

## 5) Installer et builder
```bash
npm ci
npm run build
```

## 6) Lancer avec PM2
Le fichier [`ecosystem.config.js`](ecosystem.config.js) est fourni.
```bash
pm2 start ecosystem.config.js
pm2 save
sudo pm2 startup systemd -u $USER --hp $HOME
```

## 7) Configurer Nginx (reverse proxy)
```bash
sudo tee /etc/nginx/sites-available/storal.fr > /dev/null << 'EOF'
server {
  listen 80;
  server_name storal.fr www.storal.fr;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
EOF

sudo ln -s /etc/nginx/sites-available/storal.fr /etc/nginx/sites-enabled/storal.fr || true
sudo nginx -t
sudo systemctl reload nginx
```

## 8) SSL avec Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d storal.fr -d www.storal.fr
```

## 9) Déployer une mise à jour
```bash
cd /var/www/store_menuiserie
git pull origin main
npm ci
npm run build
pm2 restart storal-next
```

## 10) Vérifications
```bash
# Service Next.js
pm2 status
pm2 logs storal-next --lines 100

# Nginx
sudo systemctl status nginx
curl -I http://127.0.0.1:3000/products/kissimy
curl -I https://storal.fr/products/kissimy
```

## Remarques
- La page KISSIMY est disponible à l'URL `/products/kissimy`.
- En cas de 404, vérifiez que `npm run build` passe sans erreur et que PM2 est démarré.
- Les clés Supabase doivent être correctement renseignées; la page s'affiche même sans données, mais certaines fonctionnalités nécessitent Supabase.
