#!/bin/bash

# Script de déploiement rapide
# Usage: ./scripts/deploy.sh "message de commit"

set -e

MESSAGE="${1:-update}"

echo "📦 Déploiement: $MESSAGE"
echo ""

# Vérifications
./scripts/pre-deploy.sh

# Git
echo ""
echo "📤 Git add, commit, push..."
git add .
git commit -m "$MESSAGE" || echo "Aucun changement à commiter"
git push

# Déploiement serveur
echo ""
echo "🚀 Déploiement sur le serveur..."
ssh ubuntu@51.210.244.26 "cd /var/www/storal.fr && git pull && npm ci && npm run build -- --webpack && pm2 restart storal-next"

echo ""
echo "✅ Déploiement terminé!"
