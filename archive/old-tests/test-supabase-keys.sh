#!/bin/bash

# Test des clés Supabase

SUPABASE_URL="https://qctnvyxtbvnvllchuibu.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdG52eXh0YnZudmxsY2h1aWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTk1ODAsImV4cCI6MjA1MTU5NTU4MH0.lGz1x5SoXUl1Wz4yZ5LKRs1I4c1H7xEOvj0C3qZGKVo"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdG52eXh0YnZudmxsY2h1aWJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjAxOTU4MCwiZXhwIjoyMDUxNTk1NTgwfQ.AUEcxR-AySrjTkP2xXpKBp3chIaYJUqjO7N8sD53bW8"

echo "🔍 Test des clés Supabase"
echo "================================"
echo ""

echo "1️⃣ Test de la clé ANON..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Code HTTP: $HTTP_CODE"
echo "Réponse: $BODY"
echo ""

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Clé ANON valide!"
else
  echo "❌ Clé ANON INVALIDE!"
fi

echo ""
echo "2️⃣ Test de la clé SERVICE_ROLE..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$SUPABASE_URL/rest/v1/toile_types?select=id,name&limit=1" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Code HTTP: $HTTP_CODE"
echo "Réponse: $BODY"
echo ""

if [[ "$HTTP_CODE" == "200" ]]; then
  echo "✅ Clé SERVICE_ROLE valide!"
else
  echo "❌ Clé SERVICE_ROLE INVALIDE!"
fi

echo ""
echo "================================"
echo "💡 Solution: Régénérer les clés dans Supabase Dashboard"
echo "   1. Aller sur https://app.supabase.com"
echo "   2. Sélectionner le projet 'storal.fr'"
echo "   3. Settings > API > Generate New Keys"
echo "   4. Copier les nouvelles clés dans .env.local"
