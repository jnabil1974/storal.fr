#!/bin/bash

# Script de nettoyage complet après redémarrage
# Usage: ./restart-clean.sh

echo "🧹 Nettoyage complet de tous les caches..."

# Tuer tout processus Node sur le port 3000
echo "🔴 Arrêt des processus sur le port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Supprimer TOUS les caches possibles
echo "🗑️  Suppression de tous les caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc
rm -rf out
rm -rf .turbo

# Vérifier que ChatAssistant.tsx contient bien les logs de debug
echo "🔍 Vérification du code de debug..."
if grep -q "🎨 renderFabricSelectorTool called" src/components/ChatAssistant.tsx; then
    echo "✅ Code de debug présent dans ChatAssistant.tsx"
else
    echo "❌ ATTENTION: Code de debug manquant!"
fi

echo ""
echo "✅ Nettoyage terminé!"
echo ""
echo "📋 Instructions:"
echo "1. Fermez COMPLÈTEMENT votre navigateur (tous les onglets, fenêtres)"
echo "2. Lancez: npm run dev"
echo "3. Attendez le message 'Ready in X.Xs'"
echo "4. Ouvrez un NOUVEAU navigateur"
echo "5. Allez sur http://localhost:3000"
echo "6. Ouvrez la console (F12)"
echo "7. Demandez au chatbot de montrer les toiles"
echo "8. Copiez TOUS les logs de la console"
echo ""
echo "🎯 Logs attendus:"
echo "   🎨 renderFabricSelectorTool called"
echo "   🖼️ Rendering fabric 0001: ..."
echo "   ✅ Loaded: 0001"
echo ""
