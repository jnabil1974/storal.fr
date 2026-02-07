#!/usr/bin/env python3
"""
Script pour résoudre le problème des toiles Sattler :
1. Modifier la contrainte unique
2. Importer les toiles manquantes
"""

import os
from pathlib import Path
from supabase import create_client, Client
import time

# Configuration Supabase
url = "https://qctnvyxtbvnvllchuibu.supabase.co"
# Utiliser la clé anon pour les opérations normales
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdG52eXh0YnZudmxsY2h1aWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTk1MDQsImV4cCI6MjA0ODg5NTUwNH0.4h2PbrLH4l_jUMlYDI5McdpqGDCJN7OAf2G6KxC6oF4"

supabase: Client = create_client(url, key)

# Mapping des types de toiles
TOILE_TYPE_MAPPING = {
    'ORCH': 1,      # Dickson Orchestra
    'ORCH_MAX': 2,  # Dickson Orchestra Max  
    'SATT': 3,      # Sattler
}

def detect_color_family(name: str) -> str:
    """Détecte la famille de couleur basée sur le nom"""
    name_lower = name.lower()
    
    if any(word in name_lower for word in ['blanc', 'white', 'blanco']):
        return 'Blanc'
    elif any(word in name_lower for word in ['noir', 'black', 'negro']):
        return 'Noir'
    elif any(word in name_lower for word in ['gris', 'grey', 'gray']):
        return 'Gris'
    elif any(word in name_lower for word in ['bleu', 'blue', 'azul']):
        return 'Bleu'
    elif any(word in name_lower for word in ['vert', 'green', 'verde']):
        return 'Vert'
    elif any(word in name_lower for word in ['rouge', 'red', 'rojo']):
        return 'Rouge'
    elif any(word in name_lower for word in ['rose', 'pink', 'rosa']):
        return 'Rose'
    elif any(word in name_lower for word in ['orange', 'naranja']):
        return 'Orange'
    elif any(word in name_lower for word in ['jaune', 'yellow', 'amarillo']):
        return 'Jaune'
    elif any(word in name_lower for word in ['violet', 'purple', 'morado']):
        return 'Violet'
    elif any(word in name_lower for word in ['marron', 'brown', 'marrón']):
        return 'Marron'
    elif any(word in name_lower for word in ['beige', 'crème', 'cream']):
        return 'Beige'
    else:
        return 'Neutre'

def import_sattler_toiles():
    """Importer toutes les toiles Sattler"""
    
    print("🔧 Importation des toiles Sattler...")
    
    base_path = Path("/Applications/MAMP/htdocs/store_menuiserie/public/images/toiles/SATLER")
    
    if not base_path.exists():
        print(f"❌ Dossier introuvable : {base_path}")
        return
    
    toiles_to_import = []
    
    for file_path in base_path.glob("*.png"):
        ref = file_path.stem
        relative_path = f"/images/toiles/SATLER/{file_path.name}"
        
        toile_data = {
            'toile_type_id': TOILE_TYPE_MAPPING['SATT'],
            'ref': ref,
            'name': f"Sattler {ref}",
            'collection': 'Sattler',
            'category': 'SATTLER',
            'color_family': detect_color_family(f"Sattler {ref}"),
            'image_url': relative_path,
            'is_available': True,
            'display_order': 999,
        }
        
        toiles_to_import.append(toile_data)
    
    print(f"📦 {len(toiles_to_import)} toiles Sattler à importer")
    
    if not toiles_to_import:
        print("⚠️ Aucune toile à importer")
        return
    
    # Importer par batch de 50
    batch_size = 50
    imported_count = 0
    error_count = 0
    
    for i in range(0, len(toiles_to_import), batch_size):
        batch = toiles_to_import[i:i + batch_size]
        
        try:
            result = supabase.table('toile_colors').insert(batch).execute()
            imported_count += len(batch)
            print(f"✅ Batch {i//batch_size + 1}: {len(batch)} toiles importées")
        except Exception as e:
            error_count += len(batch)
            print(f"❌ Erreur batch {i//batch_size + 1}: {e}")
        
        time.sleep(0.5)  # Pause entre les batches
    
    print(f"\n📊 Résultat final:")
    print(f"   ✅ Importées : {imported_count}")
    print(f"   ❌ Erreurs : {error_count}")
    
    # Vérifier la distribution finale
    print("\n📊 Distribution des toiles par type:")
    types = supabase.table('toile_types').select('*').order('id').execute()
    
    for t in types.data:
        colors = supabase.table('toile_colors')\
            .select('id', count='exact')\
            .eq('toile_type_id', t['id'])\
            .execute()
        count = colors.count if colors.count else 0
        print(f"   {t['name']} (ID {t['id']}): {count} couleurs")

if __name__ == "__main__":
    print("=" * 60)
    print("RÉSOLUTION DU PROBLÈME DES TOILES SATTLER")
    print("=" * 60)
    print()
    print("⚠️ IMPORTANT: Avant d'exécuter ce script, vous devez modifier")
    print("   la contrainte dans Supabase SQL Editor :")
    print()
    print("   ALTER TABLE toile_colors DROP CONSTRAINT IF EXISTS toile_colors_ref_key;")
    print("   ALTER TABLE toile_colors ADD CONSTRAINT toile_colors_type_ref_unique")
    print("   UNIQUE (toile_type_id, ref);")
    print()
    input("Appuyez sur Entrée après avoir exécuté le SQL ci-dessus...")
    print()
    
    import_sattler_toiles()
    
    print("\n✅ Script terminé!")
