#!/bin/bash

# Script de vérification avant déploiement
# Usage: ./scripts/pre-deploy.sh

set -e

echo "🔍 Vérification pré-déploiement..."

# 1. Vérifier les imports dupliqués
echo ""
echo "1️⃣ Recherche d'imports dupliqués..."
DUPLICATES=$(find src -name "*.tsx" -o -name "*.ts" | while read file; do
  awk '/^import .* from/ {
    if (seen[$0]++) {
      print FILENAME ":" NR ": " $0
      found=1
    }
  }
  END {
    if (found) exit 1
  }' "$file" 2>/dev/null || echo "$file"
done)

if [ -n "$DUPLICATES" ]; then
  echo "❌ Imports dupliqués détectés dans:"
  echo "$DUPLICATES"
  exit 1
fi
echo "✅ Aucun import dupliqué"

# 2. Build local
echo ""
echo "2️⃣ Build local..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build réussi!"
  echo ""
  echo "🚀 Prêt pour le déploiement:"
  echo "   git add ."
  echo "   git commit -m \"<message>\""
  echo "   git push"
  echo "   ssh ubuntu@51.210.244.26 \"cd /var/www/storal.fr && git pull && npm run build && pm2 restart storal-next\""
else
  echo "❌ Build échoué - corrigez les erreurs avant de déployer"
  exit 1
fi
