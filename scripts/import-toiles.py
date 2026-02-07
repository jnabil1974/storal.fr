#!/usr/bin/env python3
"""
Script d'import automatique des toiles de stores
Scanne le dossier public/images/toiles/ et insère les données dans Supabase

Scanne:
- DICKSON/DICKSON ORCHESTREA UNI/
- DICKSON/ORCHESTRA DECORS/
- DICKSON/ORCHESTRA MAX/
- SATLER/ (fichiers directs)

Total attendu: ~289 images
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Optional
from supabase import create_client, Client
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv('.env.local')

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Variables SUPABASE manquantes dans .env.local")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configuration des chemins
BASE_DIR = Path(__file__).parent.parent
IMAGES_DIR = BASE_DIR / 'public' / 'images' / 'toiles'

# Mapping des types de toiles vers leur ID (sera récupéré dynamiquement)
TOILE_TYPE_MAPPING = {}

# Mapping des familles de couleurs basé sur les noms
COLOR_FAMILIES = {
    'blanc': 'Blanc', 'white': 'Blanc', 'ecru': 'Blanc', 'ivoire': 'Blanc',
    'noir': 'Noir', 'black': 'Noir', 'anthracite': 'Noir', 'carbone': 'Noir',
    'gris': 'Gris', 'grey': 'Gris', 'gray': 'Gris', 'souris': 'Gris', 'argent': 'Gris',
    'bleu': 'Bleu', 'blue': 'Bleu', 'marine': 'Bleu', 'saphir': 'Bleu', 'azur': 'Bleu',
    'vert': 'Vert', 'green': 'Vert', 'olive': 'Vert', 'foret': 'Vert', 'emeraude': 'Vert',
    'rouge': 'Rouge', 'red': 'Rouge', 'bordeaux': 'Rouge', 'cerise': 'Rouge', 'vermillon': 'Rouge',
    'rose': 'Rose', 'pink': 'Rose', 'mauve': 'Rose',
    'orange': 'Orange', 'mandarine': 'Orange', 'papaye': 'Orange', 'terracotta': 'Orange',
    'jaune': 'Jaune', 'yellow': 'Jaune', 'citron': 'Jaune', 'paille': 'Jaune',
    'violet': 'Violet', 'purple': 'Violet', 'cassis': 'Violet',
    'marron': 'Marron', 'brown': 'Marron', 'chocolat': 'Marron', 'chataigne': 'Marron',
    'beige': 'Beige', 'sable': 'Beige', 'taupe': 'Beige', 'champagne': 'Beige', 'dune': 'Beige',
}


def get_toile_types() -> Dict[str, int]:
    """Récupère les types de toiles depuis Supabase et crée un mapping"""
    response = supabase.table('toile_types').select('id, code, name').execute()
    
    mapping = {}
    for row in response.data:
        mapping[row['code']] = row['id']
        # Ajouter aussi le nom complet
        mapping[row['name'].lower()] = row['id']
    
    print(f"📋 Types de toiles chargés: {mapping}")
    return mapping


def detect_color_family(name: str) -> str:
    """Détecte la famille de couleur basée sur le nom"""
    name_lower = name.lower()
    
    for keyword, family in COLOR_FAMILIES.items():
        if keyword in name_lower:
            return family
    
    return 'Neutre'  # Valeur par défaut


def extract_ref_from_filename(filename: str) -> str:
    """Extrait la référence du nom de fichier (sans extension)"""
    return Path(filename).stem


def parse_dickson_orchestra_uni(file_path: Path) -> Optional[Dict]:
    """Parse les toiles Dickson Orchestra Uni"""
    ref = extract_ref_from_filename(file_path.name)
    relative_path = f"/images/toiles/DICKSON/DICKSON ORCHESTREA UNI/{file_path.name}"
    
    # Générer un nom basique (sera amélioré manuellement si besoin)
    name = f"Orchestra {ref}"
    
    return {
        'toile_type_id': TOILE_TYPE_MAPPING.get('ORCH'),
        'ref': ref,
        'name': name,
        'collection': 'Orchestra Uni',
        'category': 'UNI',
        'color_family': detect_color_family(name),
        'image_url': relative_path,
        'is_available': True,
    }


def parse_dickson_orchestra_decors(file_path: Path) -> Optional[Dict]:
    """Parse les toiles Dickson Orchestra Décors"""
    ref = extract_ref_from_filename(file_path.name)
    relative_path = f"/images/toiles/DICKSON/ORCHESTRA DECORS/{file_path.name}"
    
    name = f"Orchestra Décor {ref}"
    
    return {
        'toile_type_id': TOILE_TYPE_MAPPING.get('ORCH'),
        'ref': ref,
        'name': name,
        'collection': 'Orchestra Décors',
        'category': 'DECORS',
        'color_family': detect_color_family(name),
        'image_url': relative_path,
        'is_available': True,
    }


def parse_dickson_orchestra_max(file_path: Path) -> Optional[Dict]:
    """Parse les toiles Dickson Orchestra Max"""
    ref = extract_ref_from_filename(file_path.name)
    relative_path = f"/images/toiles/DICKSON/ORCHESTRA MAX/{file_path.name}"
    
    name = f"Orchestra Max {ref}"
    
    return {
        'toile_type_id': TOILE_TYPE_MAPPING.get('ORCH_MAX'),
        'ref': ref,
        'name': name,
        'collection': 'Orchestra Max',
        'category': 'MAX',
        'color_family': detect_color_family(name),
        'image_url': relative_path,
        'is_available': True,
    }


def parse_sattler(file_path: Path) -> Optional[Dict]:
    """Parse les toiles Sattler"""
    ref = extract_ref_from_filename(file_path.name)
    relative_path = f"/images/toiles/SATLER/{file_path.name}"
    
    name = f"Sattler {ref}"
    
    return {
        'toile_type_id': TOILE_TYPE_MAPPING.get('SATT'),
        'ref': ref,
        'name': name,
        'collection': 'Sattler',
        'category': 'STANDARD',
        'color_family': detect_color_family(name),
        'image_url': relative_path,
        'is_available': True,
    }


def scan_directory(directory: Path, parser_func) -> List[Dict]:
    """Scanne un dossier et parse les fichiers images"""
    toiles = []
    
    if not directory.exists():
        print(f"⚠️  Dossier introuvable: {directory}")
        return toiles
    
    for file_path in directory.glob('*'):
        # Ignorer les fichiers système
        if file_path.name.startswith('.'):
            continue
        
        # Vérifier que c'est une image
        if file_path.suffix.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
            continue
        
        try:
            toile_data = parser_func(file_path)
            if toile_data:
                toiles.append(toile_data)
        except Exception as e:
            print(f"❌ Erreur parsing {file_path.name}: {e}")
    
    return toiles


def import_toiles():
    """Import principal des toiles"""
    global TOILE_TYPE_MAPPING
    
    print("🚀 Démarrage de l'import des toiles...")
    print(f"📂 Dossier images: {IMAGES_DIR}")
    
    # 1. Charger les types de toiles
    TOILE_TYPE_MAPPING = get_toile_types()
    
    if not TOILE_TYPE_MAPPING:
        print("❌ Aucun type de toile trouvé. Exécutez d'abord le script SQL.")
        return
    
    # 2. Scanner tous les dossiers
    all_toiles = []
    
    # DICKSON Orchestra Uni
    print("\n📁 Scan: DICKSON Orchestra Uni...")
    dickson_uni = scan_directory(
        IMAGES_DIR / 'DICKSON' / 'DICKSON ORCHESTREA UNI',
        parse_dickson_orchestra_uni
    )
    all_toiles.extend(dickson_uni)
    print(f"   ✅ {len(dickson_uni)} toiles trouvées")
    
    # DICKSON Orchestra Décors
    print("\n📁 Scan: DICKSON Orchestra Décors...")
    dickson_decors = scan_directory(
        IMAGES_DIR / 'DICKSON' / 'ORCHESTRA DECORS',
        parse_dickson_orchestra_decors
    )
    all_toiles.extend(dickson_decors)
    print(f"   ✅ {len(dickson_decors)} toiles trouvées")
    
    # DICKSON Orchestra Max
    print("\n📁 Scan: DICKSON Orchestra Max...")
    dickson_max = scan_directory(
        IMAGES_DIR / 'DICKSON' / 'ORCHESTRA MAX',
        parse_dickson_orchestra_max
    )
    all_toiles.extend(dickson_max)
    print(f"   ✅ {len(dickson_max)} toiles trouvées")
    
    # Sattler
    print("\n📁 Scan: Sattler...")
    sattler = scan_directory(
        IMAGES_DIR / 'SATLER',
        parse_sattler
    )
    all_toiles.extend(sattler)
    print(f"   ✅ {len(sattler)} toiles trouvées")
    
    print(f"\n📊 TOTAL: {len(all_toiles)} toiles à importer")
    
    # 3. Import par batch dans Supabase
    if not all_toiles:
        print("⚠️  Aucune toile à importer")
        return
    
    print("\n💾 Insertion dans Supabase...")
    
    # Supprimer les toiles existantes (optionnel, commenter si vous voulez garder)
    # supabase.table('toile_colors').delete().neq('id', 0).execute()
    
    # Batch insert (Supabase accepte max 1000 par batch généralement)
    BATCH_SIZE = 100
    success_count = 0
    error_count = 0
    
    for i in range(0, len(all_toiles), BATCH_SIZE):
        batch = all_toiles[i:i + BATCH_SIZE]
        
        try:
            response = supabase.table('toile_colors').insert(batch).execute()
            success_count += len(batch)
            print(f"   ✅ Batch {i//BATCH_SIZE + 1}: {len(batch)} toiles insérées")
        except Exception as e:
            error_count += len(batch)
            print(f"   ❌ Erreur batch {i//BATCH_SIZE + 1}: {e}")
    
    print(f"\n🎉 Import terminé!")
    print(f"   ✅ Succès: {success_count}")
    print(f"   ❌ Erreurs: {error_count}")
    
    # 4. Vérification finale
    count_response = supabase.table('toile_colors').select('id', count='exact').execute()
    print(f"\n📈 Total en base de données: {count_response.count} toiles")


if __name__ == '__main__':
    try:
        import_toiles()
    except Exception as e:
        print(f"\n❌ ERREUR CRITIQUE: {e}")
        import traceback
        traceback.print_exc()
