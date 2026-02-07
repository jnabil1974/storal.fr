#!/usr/bin/env python3
"""
Script pour insérer les images téléchargées dans une table Supabase
"""

import json
import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import List, Dict

def load_supabase_client() -> Client:
    """Charge le client Supabase avec les credentials"""
    # Charge les variables d'environnement depuis le fichier .env à la racine
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        load_dotenv(env_path)
    
    supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError("Variables d'environnement Supabase manquantes")
    
    return create_client(supabase_url, supabase_key)

def upload_to_storage(supabase: Client, local_path: str, filename: str, bucket_name: str = 'toile-images') -> str:
    """
    Upload une image dans le storage Supabase
    
    Args:
        supabase: Client Supabase
        local_path: Chemin local de l'image
        filename: Nom du fichier
        bucket_name: Nom du bucket
        
    Returns:
        URL publique de l'image
    """
    try:
        # Lit le fichier
        with open(local_path, 'rb') as f:
            file_data = f.read()
        
        # Upload dans le storage
        storage_path = f"toiles/{filename}"
        supabase.storage.from_(bucket_name).upload(
            path=storage_path,
            file=file_data,
            file_options={"content-type": "image/jpeg"}
        )
        
        # Récupère l'URL publique
        public_url = supabase.storage.from_(bucket_name).get_public_url(storage_path)
        return public_url
        
    except Exception as e:
        print(f"❌ Erreur upload storage: {str(e)}")
        return None

def insert_into_table(supabase: Client, records: List[Dict], table_name: str = 'toile_colors') -> int:
    """
    Insère les enregistrements dans la table Supabase
    
    Args:
        supabase: Client Supabase
        records: Liste des enregistrements à insérer
        table_name: Nom de la table
        
    Returns:
        Nombre d'enregistrements insérés
    """
    try:
        response = supabase.table(table_name).insert(records).execute()
        return len(response.data)
    except Exception as e:
        print(f"❌ Erreur insertion table: {str(e)}")
        return 0

def parse_ref(ref: str) -> Dict[str, str]:
    """
    Parse la référence pour extraire les informations
    Exemple: "gold 0744 120 chantilly" -> collection: gold, code: 0744, largeur: 120, nom: chantilly
    """
    parts = ref.split()
    
    return {
        'collection': parts[0] if len(parts) > 0 else None,
        'code': parts[1] if len(parts) > 1 else None,
        'largeur': parts[2] if len(parts) > 2 else None,
        'nom': ' '.join(parts[3:]) if len(parts) > 3 else None,
        'ref_complete': ref
    }

def main():
    # Chemins
    script_dir = Path(__file__).parent
    results_file = script_dir / 'download_results.json'
    
    if not results_file.exists():
        print("❌ Fichier download_results.json introuvable. Exécutez d'abord download_images.py")
        return
    
    # Charge les résultats du téléchargement
    print("📖 Lecture des résultats de téléchargement...")
    with open(results_file, 'r', encoding='utf-8') as f:
        results = json.load(f)
    
    # Filtre les images téléchargées avec succès
    successful_images = [r for r in results if r['status'] == 'success']
    print(f"✅ {len(successful_images)} images à traiter")
    
    # Initialise Supabase
    print("🔗 Connexion à Supabase...")
    try:
        supabase = load_supabase_client()
        print("✅ Connecté à Supabase")
    except Exception as e:
        print(f"❌ Erreur connexion Supabase: {str(e)}")
        return
    
    # Prépare les enregistrements pour la table
    records = []
    for item in successful_images:
        parsed = parse_ref(item['ref'])
        
        record = {
            'name': parsed['nom'] or item['ref'],
            'code': parsed['code'],
            'collection': parsed['collection'],
            'largeur': parsed['largeur'],
            'ref': item['ref'],
            'image_url': item['original_url'],  # URL originale en attendant l'upload storage
            'local_path': item['local_path'],
            'filename': item['filename']
        }
        records.append(record)
    
    # Sauvegarde les enregistrements préparés
    prepared_file = script_dir / 'prepared_records.json'
    with open(prepared_file, 'w', encoding='utf-8') as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 {len(records)} enregistrements préparés")
    print(f"💾 Données sauvegardées dans: {prepared_file}")
    
    # Demande confirmation avant insertion
    print("\n⚠️  Voulez-vous insérer ces données dans la table Supabase ?")
    print("   Table cible: toile_colors")
    response = input("   Tapez 'oui' pour confirmer: ")
    
    if response.lower() == 'oui':
        print("\n🚀 Insertion dans la table...")
        inserted = insert_into_table(supabase, records)
        print(f"✅ {inserted} enregistrements insérés avec succès")
    else:
        print("❌ Insertion annulée")
        print("💡 Vous pouvez modifier prepared_records.json et réexécuter ce script")

if __name__ == '__main__':
    main()
