#!/bin/bash

# Script d'installation pour VPS Ubuntu 22.04
# Usage: bash install-vps.sh

set -e

echo "🚀 Installation de storal.fr sur VPS Ubuntu 22.04"

# Mise à jour du système
echo "📦 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation de Node.js 20.x
echo "📦 Installation de Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérification
node -v
npm -v

# Installation de PM2 globalement
echo "📦 Installation de PM2..."
sudo npm install -g pm2

# Installation de Nginx
echo "📦 Installation de Nginx..."
sudo apt install -y nginx

# Installation de Certbot pour SSL
echo "🔒 Installation de Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Créer le répertoire de l'application
echo "📁 Création du répertoire de l'application..."
sudo mkdir -p /var/www/storal.fr
sudo chown -R $USER:$USER /var/www/storal.fr

# Cloner le repo
echo "📥 Clonage du repository..."
cd /var/www/storal.fr
git clone https://github.com/jnabil1974/storal.fr.git .

# Installation des dépendances
echo "📦 Installation des dépendances npm..."
npm install

# Créer le fichier .env.production
echo "⚙️  Configuration de .env.production..."
cat > .env.production << 'EOL'
NEXT_PUBLIC_SUPABASE_URL=https://qctnvyxtbvnvllchuibu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ePWi9LBeKlfAR8T_-bk0YA_3me9UEc3
SUPABASE_SERVICE_ROLE_KEY=sb_secret_9Ym5jsPSc1VCcbYYTal79w_nRaNwR8K

NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51PNA90JWI1QIAgwoSG6QVWuMf6QBz0kL3rwPdCLhkkbYJnqjWz82TS4mFHqtwrm8Z2mW2THqWmdulAUa2voCUMs400GFbgbNEl
STRIPE_SECRET_KEY=sk_test_51PNA90JWI1QIAgwomZXbOuKRHPlxHCFIjq4JEtvSq6ttI68c33Tf9sY7GlLeiCRXVlGYJFJokJzgcI70XJM2Yba700dyxzryWJ
STRIPE_WEBHOOK_SECRET=whsec_PRODUCTION_KEY_HERE

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

RESEND_API_KEY=re_ViuFZpQ2_L6VK9QoXFPHmzbxs8wp1APMh
EMAIL_FROM=noreply@flineaccessplus.fr
EMAIL_BCC=support@flineaccessplus.fr

NEXT_PUBLIC_ADMIN_EMAILS=support@flineaccessplus.fr
NEXT_PUBLIC_APP_URL=https://storal.fr
EOL

echo "⚠️  IMPORTANT: Édite /var/www/storal.fr/.env.production pour ajouter les vraies clés de production"

# Build de l'application
echo "🔨 Build de l'application Next.js..."
npm run build

# Créer le répertoire logs
mkdir -p logs

# Démarrer avec PM2
echo "🚀 Démarrage de l'application avec PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configuration Nginx
echo "⚙️  Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/storal.fr > /dev/null << 'EOL'
server {
    listen 80;
    server_name storal.fr www.storal.fr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOL

# Activer le site
sudo ln -sf /etc/nginx/sites-available/storal.fr /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Installation terminée !"
echo ""
echo "Prochaines étapes:"
echo "1. Édite /var/www/storal.fr/.env.production avec tes vraies clés"
echo "2. Redémarre l'app: pm2 restart storal-fr"
echo "3. Configure les DNS pour pointer storal.fr vers l'IP du VPS"
echo "4. Lance: sudo certbot --nginx -d storal.fr -d www.storal.fr"
echo ""
echo "Commandes utiles:"
echo "  pm2 status          - Voir le statut de l'app"
echo "  pm2 logs storal-fr  - Voir les logs"
echo "  pm2 restart storal-fr - Redémarrer l'app"
