#!/usr/bin/env python3
"""
Script pour extraire les couleurs brillantes et sablées du nuancier Matest
"""
from PIL import Image
import os
import json

# Chemins
BASE_DIR = "/Applications/MAMP/htdocs/store_menuiserie"
INPUT_BRILLANT = f"{BASE_DIR}/public/images/matest/nuancier.png"
INPUT_SABLE = f"{BASE_DIR}/public/images/matest/nuancier-sable.jpg"
OUTPUT_DIR_BRILLANT = f"{BASE_DIR}/public/images/matest/brillant"
OUTPUT_DIR_SABLE = f"{BASE_DIR}/public/images/matest/sable"
JSON_OUTPUT = f"{BASE_DIR}/data/matest-colors-grid.json"

# Créer les dossiers de sortie
os.makedirs(OUTPUT_DIR_BRILLANT, exist_ok=True)
os.makedirs(OUTPUT_DIR_SABLE, exist_ok=True)

print("🎨 Extraction du nuancier Matest...")

# Charger l'image des brillants
img_brillant = Image.open(INPUT_BRILLANT)
print(f"✅ Image brillant chargée: {img_brillant.size}")

# Charger l'image des sablés
img_sable = Image.open(INPUT_SABLE)
print(f"✅ Image sablé chargée: {img_sable.size}")

width, height = img_brillant.size
print(f"📐 Dimensions: {width}x{height}")

# Définir la grille (ajuster selon l'analyse visuelle)
# Pour 52 brillants, essayons plusieurs configurations possibles
# Option 1: 8 colonnes × 7 lignes = 56 (quelques cases vides)
# Option 2: 10 colonnes × 6 lignes = 60 (quelques cases vides)
# Option 3: 9 colonnes × 6 lignes = 54 (2 cases vides)

cols = 10
rows = 6  # Pour environ 52-60 couleurs
cell_width = width // cols
cell_height = height // rows

print(f"📦 Taille par case: {cell_width}x{cell_height}")
print(f"📊 Grille brillant: {cols} colonnes × {rows} lignes")

# Extraire les couleurs brillantes
brillant_data = []
color_index = 1

print("\n🔵 Extraction des couleurs BRILLANTES...")
for row in range(rows):
    for col in range(cols):
        x1 = col * cell_width
        y1 = row * cell_height
        x2 = x1 + cell_width
        y2 = y1 + cell_height
        
        cell = img_brillant.crop((x1, y1, x2, y2))
        
        filename = f"RAL_brillant_{color_index:03d}.png"
        filepath = os.path.join(OUTPUT_DIR_BRILLANT, filename)
        cell.save(filepath)
        
        brillant_data.append({
            "index": color_index,
            "filename": filename,
            "finish": "brillant",
            "position": {"row": row + 1, "col": col + 1}
        })
        
        color_index += 1
        if color_index > 52:  # Limiter à 52 brillants
            break
    if color_index > 52:
        break

print(f"✅ {len(brillant_data)} couleurs brillantes extraites")

# Extraire les couleurs sablées
# Pour 28 sablés: 7 colonnes × 4 lignes = 28
cols_sable = 7
rows_sable = 4
cell_width_sable = width // cols_sable
cell_height_sable = height // rows_sable

sable_data = []
color_index = 1

print("\n🟡 Extraction des couleurs SABLÉES...")
for row in range(rows_sable):
    for col in range(cols_sable):
        x1 = col * cell_width_sable
        y1 = row * cell_height_sable
        x2 = x1 + cell_width_sable
        y2 = y1 + cell_height_sable
        
        cell = img_sable.crop((x1, y1, x2, y2))
        
        filename = f"RAL_sable_{color_index:03d}.png"
        filepath = os.path.join(OUTPUT_DIR_SABLE, filename)
        cell.save(filepath)
        
        sable_data.append({
            "index": color_index,
            "filename": filename,
            "finish": "sablé",
            "position": {"row": row + 1, "col": col + 1}
        })
        
        color_index += 1

print(f"✅ {len(sable_data)} couleurs sablées extraites")

# Sauvegarder les métadonnées
metadata = {
    "source": "Nuancier Matest 90 couleurs",
    "brillant": {
        "count": len(brillant_data),
        "grid": {"cols": cols, "rows": rows},
        "cell_size": {"width": cell_width, "height": cell_height},
        "colors": brillant_data
    },
    "sablé": {
        "count": len(sable_data),
        "grid": {"cols": cols_sable, "rows": rows_sable},
        "cell_size": {"width": cell_width_sable, "height": cell_height_sable},
        "colors": sable_data
    },
    "total": len(brillant_data) + len(sable_data)
}

with open(JSON_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)

print(f"\n✅ Métadonnées sauvegardées dans {JSON_OUTPUT}")
print("\n📊 RÉSUMÉ:")
print(f"   🔵 Brillant: {len(brillant_data)} couleurs → {OUTPUT_DIR_BRILLANT}")
print(f"   🟡 Sablé: {len(sable_data)} couleurs → {OUTPUT_DIR_SABLE}")
print(f"   📦 Total: {len(brillant_data) + len(sable_data)} couleurs")
print("\n🎉 Extraction terminée !")
