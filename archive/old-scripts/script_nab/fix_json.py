#!/usr/bin/env python3
"""
Script pour nettoyer et fusionner les multiples tableaux JSON en un seul
"""

import json
import re
from pathlib import Path

def fix_json_file(input_file: Path, output_file: Path):
    """
    Lit le fichier JSON, fusionne les tableaux multiples, et sauvegarde le résultat
    """
    # Lit le contenu du fichier
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Trouve tous les tableaux JSON
    # Pattern pour trouver les blocs [...]
    arrays = []
    current_array = []
    in_array = False
    depth = 0
    
    # Parse manuellement pour gérer les multiples tableaux
    lines = content.split('\n')
    for line in lines:
        stripped = line.strip()
        
        if stripped == '[':
            if not in_array:
                in_array = True
                depth = 1
            else:
                depth += 1
            current_array.append(line)
        elif stripped == ']':
            depth -= 1
            current_array.append(line)
            if depth == 0:
                in_array = False
                arrays.append('\n'.join(current_array))
                current_array = []
        elif in_array:
            current_array.append(line)
    
    print(f"📊 Trouvé {len(arrays)} tableaux JSON")
    
    # Parse chaque tableau et fusionne les données
    all_items = []
    for i, array_str in enumerate(arrays, 1):
        try:
            data = json.loads(array_str)
            print(f"✅ Tableau {i}: {len(data)} éléments")
            all_items.extend(data)
        except json.JSONDecodeError as e:
            print(f"❌ Erreur dans le tableau {i}: {e}")
    
    print(f"\n📦 Total: {len(all_items)} éléments")
    
    # Sauvegarde le résultat fusionné
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_items, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Fichier nettoyé sauvegardé: {output_file}")

def main():
    script_dir = Path(__file__).parent
    input_file = script_dir / 'images.json'
    output_file = script_dir / 'images_clean.json'
    
    print("🔧 Nettoyage du fichier JSON...")
    fix_json_file(input_file, output_file)
    
    # Remplace le fichier original
    print("\n⚠️  Remplacer le fichier original ?")
    response = input("Tapez 'oui' pour confirmer: ")
    
    if response.lower() == 'oui':
        output_file.rename(input_file)
        print("✅ Fichier original remplacé")
    else:
        print(f"💾 Fichier nettoyé disponible: {output_file}")

if __name__ == '__main__':
    main()
