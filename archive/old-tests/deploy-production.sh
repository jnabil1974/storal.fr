#!/bin/bash
# Script de déploiement pour storal-next

set -e

echo "🚀 Déploiement en cours..."

# SSH avec un timeout court
ssh_timeout=30

# Déployer le code
echo "📦 Synchronisation du code..."
timeout $ssh_timeout ssh -o ConnectTimeout=10 ubuntu@51.210.244.26 <<'EOF'
  cd /var/www/storal.fr
  git pull origin main
EOF

echo "🏗️ Compilation du projet..."
timeout $ssh_timeout ssh -o ConnectTimeout=10 ubuntu@51.210.244.26 <<'EOF'
  cd /var/www/storal.fr
  npm run build
EOF

echo "♻️ Redémarrage de PM2..."
timeout $ssh_timeout ssh -o ConnectTimeout=10 ubuntu@51.210.244.26 <<'EOF'
  pm2 restart storal-next
  pm2 status
EOF

echo "✅ Déploiement terminé!"

# Tester l'API 
echo "🧪 Test de l'API..."
sleep 3
timeout $ssh_timeout ssh -o ConnectTimeout=10 ubuntu@51.210.244.26 <<'EOF'
  curl -s "http://localhost:3000/api/calcul-prix/toile-colors?optionId=15" | head -200
EOF
