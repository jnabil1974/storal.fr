# Gestion des Images de Toiles

Ce dossier contient les scripts pour télécharger et intégrer les images de toiles à Supabase.

## 📁 Fichiers

- **images.json** - Liste des URLs d'images à télécharger
- **download_images.py** - Script de téléchargement des images
- **insert_images_db.py** - Script d'insertion dans Supabase
- **images/** - Dossier contenant les images téléchargées

## 🚀 Utilisation

### 1. Télécharger les images

```bash
cd script_nab
python3 download_images.py
```

Ce script va :
- Créer le dossier `images/`
- Télécharger toutes les images depuis les URLs
- Sauvegarder un fichier `download_results.json` avec les résultats

### 2. Insérer dans la base de données

```bash
python3 insert_images_db.py
```

Ce script va :
- Lire les résultats de téléchargement
- Préparer les enregistrements pour la table `toile_colors`
- Demander confirmation avant insertion
- Insérer les données dans Supabase

## 📊 Structure des données

Chaque image est parsée depuis sa référence :

```
Exemple: "gold 0744 120 chantilly"
- collection: "gold"
- code: "0744"
- largeur: "120"
- nom: "chantilly"
```

## ⚙️ Configuration requise

Variables d'environnement dans `.env.local` :
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 Dépendances Python

```bash
pip install requests supabase python-dotenv
```
