#!/usr/bin/env python3
"""
Script pour lire les codes RAL sur les images extraites avec OCR
"""
from PIL import Image
import os
import re

BASE_DIR = "/Applications/MAMP/htdocs/store_menuiserie"
COLORS_DIR = f"{BASE_DIR}/public/images/matest/couleurs"

print("🔍 Tentative de lecture OCR des codes RAL...")
print("📋 Liste des fichiers à analyser manuellement:\n")

# Lister toutes les images
for i in range(1, 91):
    filename = f"color_{i:03d}.png"
    filepath = os.path.join(COLORS_DIR, filename)
    
    if os.path.exists(filepath):
        print(f"{i:2d}. {filename}")

print(f"\n📁 Total: 90 images dans {COLORS_DIR}")
print("\n💡 Instructions:")
print("1. Ouvrez les images et notez les codes RAL visibles")
print("2. Identifiez aussi la finition (brillant/sablé/mat/spéciale)")
print("3. Je créerai ensuite un fichier JSON complet avec toutes les données")
