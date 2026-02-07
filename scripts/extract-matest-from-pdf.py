import pdfplumber
import re
import json
from pathlib import Path

pdf_path = Path('/Users/nabiljlaiel/Desktop/nuancier-peinture-epoxy-matest-2.pdf')

items = []

with pdfplumber.open(pdf_path) as pdf:
    # Page 1 & 2: Brillant (26 + 26)
    for page_index in [0, 1]:
        text = pdf.pages[page_index].extract_text() or ''
        codes = re.findall(r'RAL\s*\d{4}', text, flags=re.IGNORECASE)
        for code in codes:
            items.append({
                'finish': 'brillant',
                'ral_code': code.upper().replace('RAL', '').strip(),
                'name': None
            })

    # Page 3: Sablé (16 RAL + 12 noms)
    text = pdf.pages[2].extract_text() or ''
    # RAL sablé
    codes = re.findall(r'RAL\s*\d{4}\s*SABL[ÉE]?', text, flags=re.IGNORECASE)
    for entry in codes:
        code = re.search(r'\d{4}', entry).group(0)
        items.append({
            'finish': 'sablé',
            'ral_code': code,
            'name': None
        })

    # Noms sablés (non RAL)
    # Extraits de la page 3
    named_sable = [
        ('Noir', '2100'),
        ('Noir', '2200'),
        ('Noir', '2300'),
        ('Gris', '2900'),
        ('Brisbane', None),
        ('Yazd', '2525'),
        ('Gris', '2800'),
        ('Mars', '2525'),
        ('Brun', '2650'),
        ('Tijuka', None),
        ('Sequoia', None),
        ('Djibouti', None),
    ]
    for name, code in named_sable:
        items.append({
            'finish': 'sablé',
            'ral_code': code,
            'name': name
        })

    # Page 4: Mats (6) + Finitions spéciales (5)
    text = pdf.pages[3].extract_text() or ''
    # Mats (RAL)
    mat_codes = re.findall(r'RAL\s*\d{4}\s*MAT', text, flags=re.IGNORECASE)
    for entry in mat_codes:
        code = re.search(r'\d{4}', entry).group(0)
        items.append({
            'finish': 'mat',
            'ral_code': code,
            'name': None
        })
    # Blanc 9210 mat
    if re.search(r'9210\s*MAT', text, flags=re.IGNORECASE):
        items.append({
            'finish': 'mat',
            'ral_code': '9210',
            'name': 'Blanc'
        })

    # Finitions spéciales (noms)
    special = [
        ('Silver', '9006'),
        ('Galet', None),
        ('Bronze', None),
        ('Pyrite', '9007'),
        ('Gold Pearl', None),
    ]
    for name, code in special:
        items.append({
            'finish': 'spéciale',
            'ral_code': code,
            'name': name
        })

# De-dupe exact duplicates
seen = set()
unique = []
for it in items:
    key = (it['finish'], it.get('ral_code'), it.get('name'))
    if key not in seen:
        seen.add(key)
        unique.append(it)

summary = {
    'total': len(unique),
    'counts': {
        'brillant': len([i for i in unique if i['finish'] == 'brillant']),
        'sablé': len([i for i in unique if i['finish'] == 'sablé']),
        'mat': len([i for i in unique if i['finish'] == 'mat']),
        'spéciale': len([i for i in unique if i['finish'] == 'spéciale']),
    }
}

output = {
    'summary': summary,
    'items': unique
}

out_path = Path('/Applications/MAMP/htdocs/store_menuiserie/data/matest-colors-from-pdf.json')
out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False))
print('Saved:', out_path)
print(summary)
