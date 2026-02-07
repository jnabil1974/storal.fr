#!/usr/bin/env python3
"""
Script pour télécharger toutes les images du fichier images.json
et les sauvegarder localement dans un dossier 'images'
"""

import json
import os
import requests
from pathlib import Path
from urllib.parse import urlparse
import time
from typing import List, Dict

def sanitize_filename(filename: str) -> str:
    """Nettoie le nom de fichier pour éviter les caractères problématiques"""
    # Remplace les caractères spéciaux
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    return filename

def download_image(url: str, ref: str, output_dir: Path) -> Dict[str, str]:
    """
    Télécharge une image et la sauvegarde localement
    
    Args:
        url: URL de l'image
        ref: Référence de l'image
        output_dir: Dossier de destination
        
    Returns:
        Dict avec les infos de l'image téléchargée
    """
    try:
        # Récupère l'extension depuis l'URL
        parsed_url = urlparse(url)
        ext = Path(parsed_url.path).suffix or '.jpg'
        
        # Crée le nom de fichier à partir de la ref
        filename = sanitize_filename(ref) + ext
        filepath = output_dir / filename
        
        # Télécharge l'image
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Sauvegarde l'image
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        print(f"✅ Téléchargé: {filename}")
        
        return {
            'ref': ref,
            'original_url': url,
            'local_path': str(filepath),
            'filename': filename,
            'status': 'success'
        }
        
    except Exception as e:
        print(f"❌ Erreur pour {ref}: {str(e)}")
        return {
            'ref': ref,
            'original_url': url,
            'local_path': None,
            'filename': None,
            'status': 'error',
            'error': str(e)
        }

def main():
    # Chemins
    script_dir = Path(__file__).parent
    json_file = script_dir / 'images.json'
    output_dir = script_dir / 'images'
    
    # Crée le dossier de sortie
    output_dir.mkdir(exist_ok=True)
    print(f"📁 Dossier de sortie: {output_dir}")
    
    # Charge le fichier JSON
    print(f"📖 Lecture de {json_file}")
    with open(json_file, 'r', encoding='utf-8') as f:
        images_data = json.load(f)
    
    print(f"🔢 Nombre d'images à télécharger: {len(images_data)}")
    
    # Télécharge toutes les images
    results = []
    for i, item in enumerate(images_data, 1):
        print(f"\n[{i}/{len(images_data)}] Traitement: {item['ref']}")
        result = download_image(item['url'], item['ref'], output_dir)
        results.append(result)
        
        # Pause pour ne pas surcharger le serveur
        time.sleep(0.5)
    
    # Sauvegarde les résultats
    results_file = script_dir / 'download_results.json'
    with open(results_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Statistiques
    success_count = sum(1 for r in results if r['status'] == 'success')
    error_count = len(results) - success_count
    
    print("\n" + "="*60)
    print("📊 RÉSUMÉ")
    print("="*60)
    print(f"✅ Téléchargés avec succès: {success_count}")
    print(f"❌ Erreurs: {error_count}")
    print(f"📄 Résultats sauvegardés dans: {results_file}")
    print("="*60)

if __name__ == '__main__':
    main()
