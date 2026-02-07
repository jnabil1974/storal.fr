#!/usr/bin/env python3
import json
import os
from pathlib import Path

# Charger les données
with open('data/matest-colors-from-pdf.json', 'r') as f:
    data = json.load(f)

# Séparer par finition
brillant_colors = [item for item in data['items'] if item['finish'] == 'brillant' and item.get('ral_code')]
sable_colors = [item for item in data['items'] if item['finish'] == 'sablé' and item.get('ral_code')]

print(f"🎨 Renommage de {len(brillant_colors)} images brillantes et {len(sable_colors)} images sablé\n")

renamed_files = []

# Renommer les images brillantes (pages 1 et 2)
for index, color in enumerate(brillant_colors):
    page_num = 1 if index < 26 else 2
    color_num = index + 1 if index < 26 else index - 25
    
    old_path = f"public/images/matest/pdf-thumbs/page-{page_num}/color_{color_num:02d}.png"
    new_name = f"ral-{color['ral_code']}-brillant.png"
    new_path = f"public/images/matest/pdf-thumbs/page-{page_num}/{new_name}"
    
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"✓ {os.path.basename(old_path)} → {new_name}")
        renamed_files.append({
            'ral_code': color['ral_code'],
            'finish': 'brillant',
            'old_path': f"/images/matest/pdf-thumbs/page-{page_num}/color_{color_num:02d}.png",
            'new_path': f"/images/matest/pdf-thumbs/page-{page_num}/{new_name}"
        })
    else:
        print(f"⚠ Fichier non trouvé: {old_path}")

# Renommer les images sablé (page 3)
for index, color in enumerate(sable_colors):
    color_num = index + 1
    
    old_path = f"public/images/matest/pdf-thumbs/page-3/color_{color_num:02d}.png"
    new_name = f"ral-{color['ral_code']}-sable.png"
    new_path = f"public/images/matest/pdf-thumbs/page-3/{new_name}"
    
    if os.path.exists(old_path):
        os.rename(old_path, new_path)
        print(f"✓ {os.path.basename(old_path)} → {new_name}")
        renamed_files.append({
            'ral_code': color['ral_code'],
            'finish': 'sablé',
            'old_path': f"/images/matest/pdf-thumbs/page-3/color_{color_num:02d}.png",
            'new_path': f"/images/matest/pdf-thumbs/page-3/{new_name}"
        })
    else:
        print(f"⚠ Fichier non trouvé: {old_path}")

# Sauvegarder le mapping
with open('data/matest-renamed-mapping.json', 'w') as f:
    json.dump(renamed_files, f, indent=2)

print(f"\n✅ {len(renamed_files)} fichiers renommés avec succès!")
print(f"📄 Mapping sauvegardé dans data/matest-renamed-mapping.json")
