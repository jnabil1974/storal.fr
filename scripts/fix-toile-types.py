#!/usr/bin/env python3
"""
Script pour corriger l'association des toiles aux types corrects
"""

import os
from supabase import create_client, Client

# Configuration Supabase (directement depuis les valeurs connues)
url = "https://qctnvyxtbvnvllchuibu.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdG52eXh0YnZudmxsY2h1aWJ1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzMxOTUwNCwiZXhwIjoyMDQ4ODk1NTA0fQ.k8A5PemFbRf-p6yJlOEeJvYT1b3KJrwSbcQaQ5-q5IM"

supabase: Client = create_client(url, key)

def fix_toile_types():
    """Corriger l'association des toiles aux types"""
    
    print("🔧 Correction de l'association des toiles aux types...")
    
    # 1. Orchestra Max (type 2)
    print("\n📝 Mise à jour Orchestra Max (type 2)...")
    result = supabase.table('toile_colors')\
        .update({'toile_type_id': 2})\
        .like('image_url', '%ORCHESTRA MAX%')\
        .execute()
    print(f"✅ {len(result.data) if result.data else 0} toiles Orchestra Max mises à jour")
    
    # 2. Sattler (type 3)
    print("\n📝 Mise à jour Sattler (type 3)...")
    result = supabase.table('toile_colors')\
        .update({'toile_type_id': 3})\
        .like('image_url', '%SATLER%')\
        .execute()
    print(f"✅ {len(result.data) if result.data else 0} toiles Sattler mises à jour")
    
    # 3. Vérifier la répartition finale
    print("\n📊 Répartition finale:")
    types = supabase.table('toile_types').select('*').order('id').execute()
    
    for t in types.data:
        colors = supabase.table('toile_colors')\
            .select('id', count='exact')\
            .eq('toile_type_id', t['id'])\
            .execute()
        count = colors.count if colors.count else 0
        print(f"   {t['name']} (ID {t['id']}): {count} couleurs")
    
    print("\n✅ Correction terminée!")

if __name__ == "__main__":
    fix_toile_types()
