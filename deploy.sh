#!/bin/bash
set -e

# Script de déploiement automatisé pour éviter les problèmes récurrents
# Usage: ./deploy.sh [--production]

echo "🚀 Démarrage du déploiement..."

# Variables
PROD_SERVER="ubuntu@51.210.244.26"
PROD_PATH="/var/www/storal.fr"
BRANCH="main"

if [ "$1" == "--production" ]; then
    echo "📦 Déploiement vers PRODUCTION..."
    
    # Se connecter au serveur et déployer
    ssh $PROD_SERVER << 'ENDSSH'
set -e

cd /var/www/storal.fr

echo "🛑 Arrêt des processus..."
pm2 stop all || true
pkill -9 -f next || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "📥 Récupération des dernières modifications..."
git fetch origin
git reset --hard origin/main

echo "🧹 Nettoyage complet des caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf /tmp/next-*

echo "📦 Installation des dépendances..."
npm install --no-audit

echo "🔨 Build de production..."
npm run build

echo "✅ Vérification du build..."
if [ ! -d ".next" ]; then
    echo "❌ Erreur: Le dossier .next n'existe pas!"
    exit 1
fi

if [ ! -d ".next/static" ]; then
    echo "❌ Erreur: Le dossier .next/static n'existe pas!"
    exit 1
fi

echo "🔄 Redémarrage PM2..."
pm2 delete all || true
pm2 start ecosystem.config.js
pm2 save

echo "🧹 Nettoyage du cache Nginx..."
sudo rm -rf /var/cache/nginx/* || true
sudo systemctl reload nginx

echo "📊 Statut des services..."
pm2 status

echo "✅ Déploiement terminé!"
ENDSSH

    echo "✅ Déploiement production réussi!"
    echo "🌐 Testez: https://storal.fr"
    
else
    echo "💻 Déploiement LOCAL..."
    
    # Arrêter les processus locaux
    echo "🛑 Arrêt des processus locaux..."
    pkill -f "next dev" || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # Nettoyage
    echo "🧹 Nettoyage des caches locaux..."
    rm -rf .next
    rm -rf node_modules/.cache
    
    # Build local
    echo "🔨 Build local..."
    npm run build
    
    echo "✅ Build local réussi!"
    echo "💡 Lancez: npm run dev"
fi
