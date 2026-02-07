#!/usr/bin/env python3
"""
Script pour extraire les couleurs individuelles du nuancier Matest
"""
from PIL import Image, ImageDraw, ImageFont
import os
import json

# Chemins
BASE_DIR = "/Applications/MAMP/htdocs/store_menuiserie"
INPUT_BRILLANT = f"{BASE_DIR}/public/images/matest/nuancier.png"
INPUT_SABLE = f"{BASE_DIR}/public/images/matest/nuancier-sable.jpg"
OUTPUT_DIR = f"{BASE_DIR}/public/images/matest/couleurs"
JSON_OUTPUT = f"{BASE_DIR}/data/matest-colors-extracted.json"

# Créer le dossier de sortie
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("🎨 Extraction du nuancier Matest...")

# Charger les images
try:
    img_brillant = Image.open(INPUT_BRILLANT)
    print(f"✅ Image brillant chargée: {img_brillant.size}")
    
    img_sable = Image.open(INPUT_SABLE)
    print(f"✅ Image sablé chargée: {img_sable.size}")
except Exception as e:
    print(f"❌ Erreur de chargement: {e}")
    exit(1)

# Analyser l'image pour détecter la grille
# L'image fait 1650x1240 pixels
width, height = img_brillant.size
print(f"📐 Dimensions: {width}x{height}")

# Calculer approximativement la taille des cases
# Si on a environ 10 colonnes et 9 lignes = 90 cases
cols = 10
rows = 9
cell_width = width // cols
cell_height = height // rows

print(f"📦 Taille estimée par case: {cell_width}x{cell_height}")
print(f"📊 Grille: {cols} colonnes × {rows} lignes = {cols * rows} cases")

# Extraire chaque case
colors_data = []
color_index = 1

for row in range(rows):
    for col in range(cols):
        # Calculer les coordonnées
        x1 = col * cell_width
        y1 = row * cell_height
        x2 = x1 + cell_width
        y2 = y1 + cell_height
        
        # Extraire la case
        cell = img_brillant.crop((x1, y1, x2, y2))
        
        # Nom du fichier
        filename = f"color_{color_index:03d}.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Sauvegarder
        cell.save(filepath)
        
        colors_data.append({
            "index": color_index,
            "filename": filename,
            "position": {"row": row + 1, "col": col + 1},
            "coords": {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
        })
        
        color_index += 1

print(f"✅ {len(colors_data)} couleurs extraites dans {OUTPUT_DIR}")

# Sauvegarder les métadonnées
with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump({
        "source": "nuancier Matest",
        "total_colors": len(colors_data),
        "grid": {"cols": cols, "rows": rows},
        "cell_size": {"width": cell_width, "height": cell_height},
        "colors": colors_data
    }, f, indent=2, ensure_ascii=False)

print(f"✅ Métadonnées sauvegardées dans {JSON_OUTPUT}")
print("🎉 Extraction terminée !")
print(f"\n📁 Les images sont dans: {OUTPUT_DIR}")
print("💡 Vous pouvez maintenant identifier chaque couleur et ajouter les codes RAL")
