#!/bin/bash

# Script de déploiement sur le serveur distant

SERVER="ubuntu@51.210.244.26"
APP_DIR="/var/www/storal.fr"

echo "🚀 Déploiement en cours..."
echo "1️⃣  Pull des changements..."
ssh "$SERVER" "cd $APP_DIR && git pull"

echo "2️⃣  Build de l'application..."
ssh "$SERVER" "cd $APP_DIR && npm run build"

echo "3️⃣  Redémarrage du serveur..."
ssh "$SERVER" "pm2 restart storal-next && sleep 3"

echo "4️⃣  Vérification du statut..."
ssh "$SERVER" "pm2 status"

echo "5️⃣  Test du serveur..."
ssh "$SERVER" "curl -s http://localhost:3000 | head -3"

echo "✅ Déploiement terminé!"
