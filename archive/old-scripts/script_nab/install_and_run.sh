#!/bin/bash
# Script d'installation et d'exécution pour télécharger les images

echo "🔧 Installation des dépendances..."

# Active l'environnement virtuel
source ../.venv/bin/activate

# Installe les dépendances
python3 -m pip install --upgrade pip
python3 -m pip install requests python-dotenv

echo ""
echo "✅ Dépendances installées"
echo ""
echo "📥 Téléchargement des images..."
echo ""

# Télécharge les images
python3 download_images.py

echo ""
echo "✅ Téléchargement terminé"
echo ""
echo "💡 Pour insérer dans la base de données:"
echo "   python3 insert_images_db.py"
echo ""
